import React, { useState } from 'react'
import { Volume2, Lightbulb, X } from 'lucide-react'
import { CHARACTERS, DAKUTEN } from '../data/katakana.js'
import { speak } from '../utils/speech.js'

const ROW_LABELS = {
  vowels: 'Vowels',
  k: 'K',
  s: 'S',
  t: 'T',
  n: 'N',
  h: 'H',
  m: 'M',
  y: 'Y',
  r: 'R',
  w: 'W / N',
  g: 'G (dakuten)',
  z: 'Z (dakuten)',
  d: 'D (dakuten)',
  b: 'B (dakuten)',
  p: 'P (handakuten)',
}

function groupByRow(chars) {
  const groups = {}
  for (const c of chars) {
    ;(groups[c.row] ||= []).push(c)
  }
  return groups
}

function strengthColor(st) {
  if (!st) return 'bg-gray-100 dark:bg-gray-800 text-duo-ink dark:text-gray-100'
  if (st.strength >= 4) return 'bg-green-100 text-duo-greenDark dark:bg-green-900/40 dark:text-green-300'
  if (st.strength >= 2) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
  return 'bg-red-100 text-duo-red dark:bg-red-900/40 dark:text-red-300'
}

export default function Chart({ progress }) {
  const [active, setActive] = useState(null)
  const [showDakuten, setShowDakuten] = useState(false)
  const chars = showDakuten ? DAKUTEN : CHARACTERS
  const groups = groupByRow(chars)
  const stats = progress.state.stats

  return (
    <div className="mx-auto max-w-md px-4 pt-4 pb-28">
      <h1 className="text-2xl font-extrabold text-duo-ink dark:text-gray-100 mb-1">Character Chart</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Tap any character to hear it and see a memory tip.</p>

      <div className="flex gap-2 mb-6">
        <Tab active={!showDakuten} onClick={() => setShowDakuten(false)}>Basic (46)</Tab>
        <Tab active={showDakuten} onClick={() => setShowDakuten(true)}>Dakuten (25)</Tab>
      </div>

      <div className="flex flex-col gap-5">
        {Object.entries(groups).map(([row, items]) => (
          <div key={row}>
            <div className="text-xs font-bold uppercase text-gray-400 mb-2">{ROW_LABELS[row] || row}</div>
            <div className="grid grid-cols-5 gap-2">
              {items.map((c) => (
                <button
                  key={c.kana}
                  onClick={() => {
                    setActive(c)
                    speak(c.kana)
                  }}
                  className={`aspect-square rounded-xl grid place-items-center font-jp font-extrabold text-2xl shadow-card active:translate-y-[2px] transition-transform ${strengthColor(stats[c.kana])}`}
                >
                  {c.kana}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <Legend className="bg-green-100 dark:bg-green-900/40" label="Strong" />
        <Legend className="bg-amber-100 dark:bg-amber-900/40" label="Learning" />
        <Legend className="bg-red-100 dark:bg-red-900/40" label="Weak" />
        <Legend className="bg-gray-100 dark:bg-gray-800" label="New" />
      </div>

      {active && <DetailSheet c={active} st={stats[active.kana]} onClose={() => setActive(null)} />}
    </div>
  )
}

function Tab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 rounded-xl font-extrabold text-sm transition-colors ${
        active ? 'bg-duo-blue text-white shadow-card' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
      }`}
    >
      {children}
    </button>
  )
}

function Legend({ className, label }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`w-3 h-3 rounded ${className}`} />
      {label}
    </div>
  )
}

function DetailSheet({ c, st, onClose }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-t-3xl p-6 animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400">
          <X className="w-6 h-6" />
        </button>
        <div className="text-center">
          <button onClick={() => speak(c.kana)} className="text-[90px] leading-none font-jp text-duo-ink dark:text-gray-100 active:scale-95 transition-transform">
            {c.kana}
          </button>
          <div className="text-2xl font-extrabold text-duo-blue">{c.romaji}</div>
          <button onClick={() => speak(c.kana)} className="mt-3 inline-flex items-center gap-2 text-duo-blue font-bold">
            <Volume2 className="w-5 h-5" /> Play sound
          </button>
        </div>
        <div className="mt-5 flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4">
          <Lightbulb className="w-5 h-5 text-duo-gold shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 dark:text-gray-200">{c.mnemonic}</p>
        </div>
        <div className="mt-3 text-center text-sm text-gray-500 font-jp">{c.example}</div>
        {st && (
          <div className="mt-4 text-center text-xs text-gray-400">
            Seen {st.seen}× · {st.seen ? Math.round((st.correct / st.seen) * 100) : 0}% correct · Strength {st.strength}/5
          </div>
        )}
      </div>
    </div>
  )
}
