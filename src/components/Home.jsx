import React, { useMemo } from 'react'
import { Check, Lock, Star, Crown, Dumbbell, Sparkles } from 'lucide-react'
import { UNITS } from '../data/lessons.js'

// Winding offsets to mimic Duolingo's snake path.
const OFFSETS = [0, 40, 64, 40, 0, -40, -64, -40]

function LessonNode({ status, color, onClick, offset, index }) {
  const isLocked = status === 'locked'
  const isDone = status === 'done'
  const isActive = status === 'active'

  return (
    <div className="relative flex justify-center" style={{ transform: `translateX(${offset}px)` }}>
      {isActive && (
        <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 text-duo-green text-xs font-extrabold px-3 py-1 rounded-xl shadow-card border-2 border-gray-100 dark:border-gray-700 animate-pop">
          START
          <span className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 rotate-45 bg-white dark:bg-gray-800 border-r-2 border-b-2 border-gray-100 dark:border-gray-700" />
        </span>
      )}
      <button
        onClick={isLocked ? undefined : onClick}
        disabled={isLocked}
        aria-label={`Lesson ${index + 1} ${status}`}
        className={`relative w-[68px] h-[60px] rounded-[50%] grid place-items-center transition-transform active:translate-y-[3px] ${
          isLocked ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
        style={{
          background: isLocked ? '#e5e5e5' : color,
          boxShadow: isLocked
            ? '0 6px 0 0 #c9c9c9'
            : `0 6px 0 0 ${shade(color, -18)}`,
        }}
      >
        {isActive && (
          <span
            className="absolute inset-0 rounded-[50%] animate-ping opacity-30"
            style={{ background: color }}
          />
        )}
        {isLocked ? (
          <Lock className="w-6 h-6 text-gray-400" />
        ) : isDone ? (
          <Check className="w-7 h-7 text-white" strokeWidth={4} />
        ) : (
          <Star className="w-7 h-7 text-white" fill="white" />
        )}
      </button>
    </div>
  )
}

// Darken a hex color by pct (negative) for the 3D shadow.
function shade(hex, pct) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, Math.min(255, (n >> 16) + pct))
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + pct))
  const b = Math.max(0, Math.min(255, (n & 0xff) + pct))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

export default function Home({ progress, learnedKanas, onStartLesson, onStartReview }) {
  const { isLessonDone, dueKanas, unitProgress } = progress
  const hasLearnedKanas = learnedKanas.length > 0

  // Determine the single global "active" lesson (first incomplete).
  const activeKey = useMemo(() => {
    for (const u of UNITS) {
      for (let i = 0; i < u.lessonCount; i++) {
        if (!isLessonDone(u.id, i)) return `${u.id}:${i}`
      }
    }
    return null
  }, [isLessonDone])

  const dueCount = dueKanas(learnedKanas).length

  let globalIndex = 0

  return (
    <div className="mx-auto max-w-md px-4 pt-4 pb-28">
      {/* Smart review banner — an improvement over Duolingo's rigid path */}
      <button
        onClick={onStartReview}
        disabled={!hasLearnedKanas}
        className="w-full mb-6 rounded-2xl p-4 text-left bg-gradient-to-r from-duo-purple to-duo-blue text-white shadow-btn active:translate-y-[2px] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 grid place-items-center">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="font-extrabold text-lg flex items-center gap-2">
              Smart Review <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-sm text-white/90">
              {!hasLearnedKanas
                ? 'Complete a lesson to unlock review'
                : dueCount > 0
                ? `${dueCount} character${dueCount > 1 ? 's' : ''} ready to review`
                : 'Practice your weakest characters'}
            </div>
          </div>
          {dueCount > 0 && (
            <span className="bg-duo-red text-white text-sm font-extrabold rounded-full px-2.5 py-0.5">
              {dueCount}
            </span>
          )}
        </div>
      </button>

      {UNITS.map((unit) => {
        const up = unitProgress(unit.id, unit.lessonCount)
        return (
          <section key={unit.id} className="mb-8">
            <div
              className="rounded-2xl px-4 py-3 mb-6 text-white shadow-card flex items-center justify-between"
              style={{ background: unit.color }}
            >
              <div>
                <div className="text-xs font-bold uppercase opacity-80">
                  {up.done === up.total && up.total > 0 ? 'Completed' : 'Unit'}
                </div>
                <div className="font-extrabold text-lg leading-tight">{unit.title}</div>
                <div className="text-sm font-jp opacity-90">{unit.subtitle}</div>
              </div>
              {up.done === up.total && up.total > 0 ? (
                <Crown className="w-8 h-8" fill="white" />
              ) : (
                <div className="text-sm font-extrabold opacity-90">
                  {up.done}/{up.total}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-5">
              {Array.from({ length: unit.lessonCount }).map((_, i) => {
                const key = `${unit.id}:${i}`
                const done = isLessonDone(unit.id, i)
                const status = done ? 'done' : key === activeKey ? 'active' : 'locked'
                const offset = OFFSETS[globalIndex % OFFSETS.length]
                globalIndex++
                return (
                  <LessonNode
                    key={key}
                    index={i}
                    status={status}
                    color={unit.color}
                    offset={offset}
                    onClick={() => onStartLesson(unit.id, i)}
                  />
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
