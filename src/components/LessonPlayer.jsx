import React, { useEffect, useMemo, useRef, useState } from 'react'
import { X, Volume2, Heart, Check, Lightbulb } from 'lucide-react'
import { Button, ProgressBar } from './ui.jsx'
import { BY_KANA } from '../data/katakana.js'
import { speak } from '../utils/speech.js'
import { shuffle } from '../utils/exercises.js'

const HEARTS_MAX = 5

export default function LessonPlayer({
  title,
  exercises,
  recordResult,
  onExit,
  onComplete,
  practiceMode = false, // unlimited hearts in practice/review
}) {
  const [queue, setQueue] = useState(exercises)
  const [index, setIndex] = useState(0)
  const [hearts, setHearts] = useState(HEARTS_MAX)
  const [correctCount, setCorrectCount] = useState(0)
  const [seenCount, setSeenCount] = useState(0)
  const total = exercises.length
  const current = queue[index]
  const done = index >= queue.length

  const initialLen = useRef(exercises.length)

  const handleResult = (correct, kanasInvolved) => {
    kanasInvolved.forEach((k) => recordResult(k, correct))
    setSeenCount((c) => c + 1)
    if (correct) {
      setCorrectCount((c) => c + 1)
    } else if (!practiceMode) {
      setHearts((h) => Math.max(0, h - 1))
    }
  }

  const advance = (requeueEx) => {
    if (requeueEx) {
      setQueue((q) => [...q, { ...requeueEx, id: requeueEx.id + '_r' + Math.random().toString(36).slice(2, 5) }])
    }
    setIndex((i) => i + 1)
  }

  if (done) {
    const accuracy = seenCount ? Math.round((correctCount / seenCount) * 100) : 100
    const xp = practiceMode ? 5 : 10 + (accuracy === 100 ? 5 : 0)
    return <Results title={title} xp={xp} accuracy={accuracy} onComplete={() => onComplete(xp, correctCount, seenCount)} />
  }

  if (hearts === 0 && !practiceMode) {
    return <OutOfHearts onExit={onExit} />
  }

  const progressValue = index / queue.length

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4">
        <button onClick={onExit} aria-label="Exit lesson" className="text-gray-400 hover:text-gray-600">
          <X className="w-7 h-7" strokeWidth={3} />
        </button>
        <ProgressBar value={progressValue} className="flex-1" />
        {!practiceMode && (
          <div className="flex items-center gap-1 text-duo-red font-extrabold">
            <Heart className="w-6 h-6" fill="currentColor" />
            {hearts}
          </div>
        )}
        {practiceMode && (
          <div className="flex items-center gap-1 text-duo-purple font-extrabold text-sm">
            <Heart className="w-6 h-6" fill="currentColor" />∞
          </div>
        )}
      </div>

      {/* Exercise body */}
      <div className="flex-1 overflow-y-auto px-4 no-scrollbar">
        <Exercise key={current.id} ex={current} onResult={handleResult} onNext={advance} />
      </div>
    </div>
  )
}

// ---------------- Exercise router ----------------

function Exercise({ ex, onResult, onNext }) {
  switch (ex.type) {
    case 'intro':
      return <Intro ex={ex} onNext={onNext} />
    case 'selectRomaji':
      return <SelectExercise ex={ex} mode="romaji" onResult={onResult} onNext={onNext} />
    case 'selectKatakana':
      return <SelectExercise ex={ex} mode="kana" onResult={onResult} onNext={onNext} />
    case 'listen':
      return <SelectExercise ex={ex} mode="listen" onResult={onResult} onNext={onNext} />
    case 'typeRomaji':
      return <TypeExercise ex={ex} onResult={onResult} onNext={onNext} />
    case 'match':
      return <MatchExercise ex={ex} onResult={onResult} onNext={onNext} />
    default:
      return null
  }
}

// ---------------- Intro (teaching card) ----------------

function Intro({ ex, onNext }) {
  const c = BY_KANA[ex.kana]
  useEffect(() => {
    const t = setTimeout(() => speak(ex.kana), 350)
    return () => clearTimeout(t)
  }, [ex.kana])
  return (
    <div className="py-6">
      <h2 className="text-xl font-extrabold text-duo-ink dark:text-gray-100 mb-6">New character</h2>
      <div className="rounded-3xl border-2 border-gray-100 dark:border-gray-700 p-8 text-center bg-white dark:bg-gray-800">
        <button
          onClick={() => speak(ex.kana)}
          className="text-[110px] leading-none font-jp text-duo-ink dark:text-gray-100 active:scale-95 transition-transform"
        >
          {ex.kana}
        </button>
        <div className="mt-2 text-3xl font-extrabold text-duo-blue">{c.romaji}</div>
        <button
          onClick={() => speak(ex.kana)}
          className="mt-4 inline-flex items-center gap-2 text-duo-blue font-bold"
        >
          <Volume2 className="w-5 h-5" /> Play sound
        </button>
        <div className="mt-6 flex items-start gap-2 text-left bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4">
          <Lightbulb className="w-5 h-5 text-duo-gold shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 dark:text-gray-200">{c.mnemonic}</p>
        </div>
        <div className="mt-3 text-sm text-gray-400 font-jp">{c.example}</div>
      </div>
      <FooterContinue onClick={() => onNext()} />
    </div>
  )
}

// ---------------- Select exercises ----------------

function SelectExercise({ ex, mode, onResult, onNext }) {
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)
  const correct = checked && selected === ex.answer

  const prompt =
    mode === 'romaji'
      ? { big: ex.kana, label: 'What sound does this make?' }
      : mode === 'kana'
        ? { big: ex.romaji, label: 'Which character is this?' }
        : { big: null, label: 'Which character did you hear?' }

  useEffect(() => {
    if (mode === 'listen') {
      const t = setTimeout(() => speak(ex.kana), 350)
      return () => clearTimeout(t)
    }
  }, [ex, mode])

  const check = () => {
    if (selected == null) return
    const ok = selected === ex.answer
    setChecked(true)
    onResult(ok, [ex.kana])
  }

  return (
    <div className="py-6">
      <h2 className="text-xl font-extrabold text-duo-ink dark:text-gray-100 mb-6">{prompt.label}</h2>

      {mode === 'listen' ? (
        <div className="flex justify-center mb-8">
          <button
            onClick={() => speak(ex.kana)}
            className="w-24 h-24 rounded-2xl bg-duo-blue text-white grid place-items-center shadow-btn active:translate-y-[2px]"
            aria-label="Play sound"
          >
            <Volume2 className="w-10 h-10" />
          </button>
        </div>
      ) : (
        <div className="flex justify-center mb-8">
          <button
            onClick={() => mode === 'romaji' && speak(ex.kana)}
            className="text-[88px] leading-none font-jp text-duo-ink dark:text-gray-100"
          >
            {prompt.big}
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {ex.options.map((opt) => {
          const isSel = selected === opt
          const showCorrect = checked && opt === ex.answer
          const showWrong = checked && isSel && opt !== ex.answer
          const isKana = mode !== 'romaji'
          return (
            <button
              key={opt}
              disabled={checked}
              onClick={() => setSelected(opt)}
              className={`rounded-2xl border-2 p-4 font-extrabold transition-colors ${
                isKana ? 'text-4xl font-jp' : 'text-2xl'
              } ${
                showCorrect
                  ? 'border-duo-green bg-green-50 text-duo-green dark:bg-green-900/30'
                  : showWrong
                    ? 'border-duo-red bg-red-50 text-duo-red dark:bg-red-900/30'
                    : isSel
                      ? 'border-duo-blue bg-blue-50 text-duo-blue dark:bg-blue-900/30'
                      : 'border-gray-200 dark:border-gray-700 text-duo-ink dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      <FeedbackFooter
        checked={checked}
        correct={correct}
        canCheck={selected != null}
        answerText={`${ex.kana} = ${ex.answer}`}
        kana={ex.kana}
        onCheck={check}
        onNext={() => onNext(correct ? null : ex)}
      />
    </div>
  )
}

// ---------------- Type exercise ----------------

function TypeExercise({ ex, onResult, onNext }) {
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const correct = checked && value.trim().toLowerCase() === ex.answer.toLowerCase()
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    const t = setTimeout(() => speak(ex.kana), 350)
    return () => clearTimeout(t)
  }, [ex])

  const check = () => {
    if (!value.trim()) return
    const ok = value.trim().toLowerCase() === ex.answer.toLowerCase()
    setChecked(true)
    onResult(ok, [ex.kana])
  }

  return (
    <div className="py-6">
      <h2 className="text-xl font-extrabold text-duo-ink dark:text-gray-100 mb-6">Type the romaji</h2>
      <div className="flex justify-center mb-8">
        <button onClick={() => speak(ex.kana)} className="text-[88px] leading-none font-jp text-duo-ink dark:text-gray-100">
          {ex.kana}
        </button>
      </div>
      <input
        ref={inputRef}
        value={value}
        disabled={checked}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && (checked ? onNext(correct ? null : ex) : check())}
        placeholder="type here…"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        className={`w-full text-center text-2xl font-extrabold rounded-2xl border-2 p-4 outline-none bg-white dark:bg-gray-800 dark:text-gray-100 ${
          checked
            ? correct
              ? 'border-duo-green text-duo-green'
              : 'border-duo-red text-duo-red'
            : 'border-gray-200 dark:border-gray-700 focus:border-duo-blue'
        }`}
      />
      <FeedbackFooter
        checked={checked}
        correct={correct}
        canCheck={!!value.trim()}
        answerText={`${ex.kana} = ${ex.answer}`}
        kana={ex.kana}
        onCheck={check}
        onNext={() => onNext(correct ? null : ex)}
      />
    </div>
  )
}

// ---------------- Match exercise ----------------

function MatchExercise({ ex, onResult, onNext }) {
  const left = useMemo(() => shuffle(ex.pairs.map((p) => ({ key: p.kana, label: p.kana }))), [ex])
  const right = useMemo(() => shuffle(ex.pairs.map((p) => ({ key: p.kana, label: p.romaji }))), [ex])
  const [selLeft, setSelLeft] = useState(null)
  const [selRight, setSelRight] = useState(null)
  const [matched, setMatched] = useState([])
  const [wrongPair, setWrongPair] = useState(null)

  const tryMatch = (l, r) => {
    if (l === r) {
      const nm = [...matched, l]
      setMatched(nm)
      onResult(true, [l])
      setSelLeft(null)
      setSelRight(null)
      if (nm.length === ex.pairs.length) {
        setTimeout(() => onNext(null), 350)
      }
    } else {
      setWrongPair({ l, r })
      onResult(false, [l, r])
      setTimeout(() => {
        setWrongPair(null)
        setSelLeft(null)
        setSelRight(null)
      }, 600)
    }
  }

  const clickLeft = (k) => {
    if (matched.includes(k)) return
    setSelLeft(k)
    if (selRight != null) tryMatch(k, selRight)
  }
  const clickRight = (k) => {
    if (matched.includes(k)) return
    setSelRight(k)
    if (selLeft != null) tryMatch(selLeft, k)
  }

  const tileClass = (key, sel, side) => {
    const isMatched = matched.includes(key)
    const isWrong = wrongPair && (side === 'l' ? wrongPair.l === key : wrongPair.r === key)
    if (isMatched) return 'border-duo-green bg-green-50 text-duo-green opacity-50 dark:bg-green-900/20'
    if (isWrong) return 'border-duo-red bg-red-50 text-duo-red animate-shake dark:bg-red-900/20'
    if (sel === key) return 'border-duo-blue bg-blue-50 text-duo-blue dark:bg-blue-900/30'
    return 'border-gray-200 dark:border-gray-700 text-duo-ink dark:text-gray-100'
  }

  return (
    <div className="py-6">
      <h2 className="text-xl font-extrabold text-duo-ink dark:text-gray-100 mb-6">Tap the matching pairs</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          {left.map((item) => (
            <button
              key={'l' + item.key}
              onClick={() => {
                clickLeft(item.key)
                speak(item.key)
              }}
              disabled={matched.includes(item.key)}
              className={`rounded-2xl border-2 p-4 text-4xl font-jp font-extrabold transition-colors ${tileClass(item.key, selLeft, 'l')}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {right.map((item) => (
            <button
              key={'r' + item.key}
              onClick={() => clickRight(item.key)}
              disabled={matched.includes(item.key)}
              className={`rounded-2xl border-2 p-4 text-2xl font-extrabold transition-colors ${tileClass(item.key, selRight, 'r')}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------- Shared footers ----------------

function FeedbackFooter({ checked, correct, canCheck, answerText, kana, onCheck, onNext }) {
  return (
    <div
      className={`fixed left-0 right-0 bottom-0 safe-bottom border-t-2 transition-colors ${
        checked
          ? correct
            ? 'bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-900'
            : 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900'
          : 'bg-white border-gray-100 dark:bg-gray-900 dark:border-gray-800'
      }`}
    >
      <div className="max-w-2xl mx-auto px-4 py-4">
        {checked && (
          <div className="flex items-center justify-between mb-3">
            <div className={`flex items-center gap-2 font-extrabold ${correct ? 'text-duo-green' : 'text-duo-red'}`}>
              {correct ? <Check className="w-6 h-6" strokeWidth={4} /> : <X className="w-6 h-6" strokeWidth={4} />}
              <div>
                <div>{correct ? 'Nice!' : 'Correct answer:'}</div>
                {!correct && <div className="text-sm font-bold">{answerText}</div>}
              </div>
            </div>
            <button onClick={() => speak(kana)} className={`${correct ? 'text-duo-green' : 'text-duo-red'}`} aria-label="Replay sound">
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
        )}
        {checked ? (
          <Button color={correct ? 'green' : 'red'} className="w-full" onClick={onNext}>
            Continue
          </Button>
        ) : (
          <Button color={canCheck ? 'green' : 'gray'} disabled={!canCheck} className="w-full" onClick={onCheck}>
            Check
          </Button>
        )}
      </div>
    </div>
  )
}

function FooterContinue({ onClick }) {
  return (
    <div className="fixed left-0 right-0 bottom-0 safe-bottom bg-white dark:bg-gray-900 border-t-2 border-gray-100 dark:border-gray-800">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <Button color="green" className="w-full" onClick={onClick}>
          Continue
        </Button>
      </div>
    </div>
  )
}

// ---------------- Results & out-of-hearts ----------------

function Results({ title, xp, accuracy, onComplete }) {
  return (
    <div className="flex flex-col h-full items-center justify-center text-center px-6 max-w-md mx-auto">
      <div className="text-7xl mb-4 animate-pop">🎉</div>
      <h1 className="text-3xl font-extrabold text-duo-gold mb-1">Lesson Complete!</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">{title}</p>
      <div className="grid grid-cols-2 gap-4 w-full mb-10">
        <div className="rounded-2xl border-2 border-duo-gold/40 bg-amber-50 dark:bg-amber-900/20 p-4">
          <div className="text-xs font-bold uppercase text-duo-gold">Total XP</div>
          <div className="text-2xl font-extrabold text-duo-gold">+{xp}</div>
        </div>
        <div className="rounded-2xl border-2 border-duo-green/40 bg-green-50 dark:bg-green-900/20 p-4">
          <div className="text-xs font-bold uppercase text-duo-green">Accuracy</div>
          <div className="text-2xl font-extrabold text-duo-green">{accuracy}%</div>
        </div>
      </div>
      <Button color="green" className="w-full" onClick={onComplete}>
        Claim Reward
      </Button>
    </div>
  )
}

function OutOfHearts({ onExit }) {
  return (
    <div className="flex flex-col h-full items-center justify-center text-center px-6 max-w-md mx-auto">
      <Heart className="w-20 h-20 text-duo-red mb-4" fill="currentColor" />
      <h1 className="text-2xl font-extrabold text-duo-ink dark:text-gray-100 mb-2">Out of hearts</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Don't worry — mistakes help you learn. Try this lesson again, or use Smart Review to practice with unlimited hearts.
      </p>
      <Button color="green" className="w-full" onClick={onExit}>
        Back to path
      </Button>
    </div>
  )
}
