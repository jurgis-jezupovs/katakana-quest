import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'katakana-quest-v1'

// Spaced-repetition intervals per strength level (in hours).
const SRS_HOURS = [4, 8, 24, 72, 168, 336]
const HOUR = 60 * 60 * 1000

const DEFAULT_STATE = {
  xp: 0,
  streak: 0,
  lastActiveDay: null, // YYYY-MM-DD
  completedLessons: {}, // `${unitId}:${index}` -> true
  stats: {}, // kana -> { seen, correct, wrong, strength, due, lastSeen }
  settings: { dark: false, sound: true },
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_STATE }
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULT_STATE,
      ...parsed,
      settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
    }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function daysBetween(a, b) {
  const d1 = new Date(a + 'T00:00:00')
  const d2 = new Date(b + 'T00:00:00')
  return Math.round((d2 - d1) / (24 * HOUR))
}

export function useProgress() {
  const [state, setState] = useState(load)

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore quota errors */
    }
  }, [state])

  // Apply dark mode class.
  useEffect(() => {
    const root = document.documentElement
    if (state.settings.dark) root.classList.add('dark')
    else root.classList.remove('dark')
  }, [state.settings.dark])

  const recordResult = useCallback((kana, correct) => {
    setState((s) => {
      const prev = s.stats[kana] || { seen: 0, correct: 0, wrong: 0, strength: 0 }
      const strength = correct
        ? Math.min(5, prev.strength + 1)
        : Math.max(0, prev.strength - 2)
      const due = Date.now() + SRS_HOURS[strength] * HOUR
      return {
        ...s,
        stats: {
          ...s.stats,
          [kana]: {
            seen: prev.seen + 1,
            correct: prev.correct + (correct ? 1 : 0),
            wrong: prev.wrong + (correct ? 0 : 1),
            strength,
            due,
            lastSeen: Date.now(),
          },
        },
      }
    })
  }, [])

  const completeLesson = useCallback((unitId, index, xpGain) => {
    setState((s) => {
      const today = todayStr()
      let streak = s.streak
      if (s.lastActiveDay !== today) {
        const gap = s.lastActiveDay ? daysBetween(s.lastActiveDay, today) : null
        streak = gap === 1 ? s.streak + 1 : 1
      }
      if (s.streak === 0) streak = Math.max(streak, 1)
      return {
        ...s,
        xp: s.xp + (xpGain || 0),
        streak,
        lastActiveDay: today,
        completedLessons: { ...s.completedLessons, [`${unitId}:${index}`]: true },
      }
    })
  }, [])

  const setSetting = useCallback((key, value) => {
    setState((s) => ({ ...s, settings: { ...s.settings, [key]: value } }))
  }, [])

  const resetAll = useCallback(() => {
    setState({ ...DEFAULT_STATE })
  }, [])

  // Serialize current progress to a shareable JSON string.
  const exportState = useCallback(() => JSON.stringify(state, null, 2), [state])

  // Replace progress from a JSON string. Returns true on success.
  const importState = useCallback((json) => {
    try {
      const parsed = typeof json === 'string' ? JSON.parse(json) : json
      if (!parsed || typeof parsed !== 'object') return false
      setState({
        ...DEFAULT_STATE,
        ...parsed,
        settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
        stats: parsed.stats && typeof parsed.stats === 'object' ? parsed.stats : {},
        completedLessons:
          parsed.completedLessons && typeof parsed.completedLessons === 'object'
            ? parsed.completedLessons
            : {},
      })
      return true
    } catch {
      return false
    }
  }, [])

  // Derived helpers
  const isLessonDone = useCallback(
    (unitId, index) => !!state.completedLessons[`${unitId}:${index}`],
    [state.completedLessons]
  )

  const unitProgress = useCallback(
    (unitId, lessonCount) => {
      let done = 0
      for (let i = 0; i < lessonCount; i++) {
        if (state.completedLessons[`${unitId}:${i}`]) done++
      }
      return { done, total: lessonCount, pct: lessonCount ? done / lessonCount : 0 }
    },
    [state.completedLessons]
  )

  const dueKanas = useCallback(
    (pool) => {
      const now = Date.now()
      return pool.filter((k) => {
        const st = state.stats[k]
        return st && st.due && st.due <= now
      })
    },
    [state.stats]
  )

  const weakKanas = useCallback(
    (pool) => {
      return [...pool]
        .map((k) => ({ k, st: state.stats[k] }))
        .filter((x) => x.st)
        .sort((a, b) => {
          const sa = a.st.strength + a.st.correct / Math.max(1, a.st.seen)
          const sb = b.st.strength + b.st.correct / Math.max(1, b.st.seen)
          return sa - sb
        })
        .map((x) => x.k)
    },
    [state.stats]
  )

  return {
    state,
    recordResult,
    completeLesson,
    setSetting,
    resetAll,
    exportState,
    importState,
    isLessonDone,
    unitProgress,
    dueKanas,
    weakKanas,
  }
}
