import React, { useRef, useState } from 'react'
import { Flame, Zap, Trophy, Moon, Volume2, RotateCcw, Target, Download, Upload, Check } from 'lucide-react'
import { ALL_CHARACTERS } from '../data/katakana.js'
import { Button } from './ui.jsx'

export default function Profile({ progress }) {
  const { state, setSetting, resetAll, exportState, importState } = progress
  const [confirmReset, setConfirmReset] = useState(false)
  const [copied, setCopied] = useState(false)
  const [importMsg, setImportMsg] = useState(null)
  const fileRef = useRef(null)

  const handleExport = async () => {
    const json = exportState()
    // Download a backup file.
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `katakana-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    // Also copy to clipboard for quick paste into another browser.
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard may be blocked; the download still works */
    }
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const ok = importState(String(reader.result))
      setImportMsg(ok ? 'Progress imported!' : 'Invalid backup file.')
      setTimeout(() => setImportMsg(null), 2500)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handlePasteImport = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const ok = importState(text)
      setImportMsg(ok ? 'Progress imported from clipboard!' : 'Clipboard had no valid backup.')
    } catch {
      setImportMsg('Could not read clipboard — use the file option.')
    }
    setTimeout(() => setImportMsg(null), 2500)
  }

  const total = ALL_CHARACTERS.length
  const mastered = Object.values(state.stats).filter((s) => s.strength >= 4).length
  const learning = Object.values(state.stats).filter((s) => s.strength > 0 && s.strength < 4).length
  const masteryPct = Math.round((mastered / total) * 100)

  return (
    <div className="mx-auto max-w-md px-4 pt-4 pb-28">
      <h1 className="text-2xl font-extrabold text-duo-ink dark:text-gray-100 mb-4">Your Progress</h1>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Stat icon={Flame} color="text-duo-red" value={state.streak} label="Day streak" />
        <Stat icon={Zap} color="text-duo-gold" value={state.xp} label="Total XP" />
        <Stat icon={Trophy} color="text-duo-green" value={`${masteryPct}%`} label="Mastered" />
      </div>

      <div className="rounded-2xl border-2 border-gray-100 dark:border-gray-700 p-4 mb-6">
        <div className="flex items-center gap-2 mb-3 font-extrabold text-duo-ink dark:text-gray-100">
          <Target className="w-5 h-5 text-duo-blue" /> Mastery
        </div>
        <div className="h-5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex">
          <div className="h-full bg-duo-green" style={{ width: `${(mastered / total) * 100}%` }} />
          <div className="h-full bg-duo-gold" style={{ width: `${(learning / total) * 100}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>{mastered} mastered</span>
          <span>{learning} learning</span>
          <span>{total - mastered - learning} new</span>
        </div>
      </div>

      <h2 className="text-lg font-extrabold text-duo-ink dark:text-gray-100 mb-3">Backup &amp; transfer</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        Progress is saved on this browser only. Export it to move it to another browser or device.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-2">
        <Button color="blue" onClick={handleExport}>
          <span className="flex items-center justify-center gap-2">
            {copied ? <Check className="w-5 h-5" /> : <Download className="w-5 h-5" />}
            {copied ? 'Copied!' : 'Export'}
          </span>
        </Button>
        <Button color="white" onClick={() => fileRef.current?.click()}>
          <span className="flex items-center justify-center gap-2">
            <Upload className="w-5 h-5" /> Import file
          </span>
        </Button>
      </div>
      <button
        onClick={handlePasteImport}
        className="text-sm font-bold text-duo-blue hover:underline mb-2"
      >
        Import from clipboard instead
      </button>
      <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={handleFile} />
      {importMsg && (
        <div className="text-sm font-bold text-duo-green mb-4">{importMsg}</div>
      )}
      <div className="h-2" />

      <h2 className="text-lg font-extrabold text-duo-ink dark:text-gray-100 mb-3">Settings</h2>
      <div className="rounded-2xl border-2 border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 mb-6">
        <Toggle
          icon={Moon}
          label="Dark mode"
          checked={state.settings.dark}
          onChange={(v) => setSetting('dark', v)}
        />
        <Toggle
          icon={Volume2}
          label="Sound effects"
          checked={state.settings.sound}
          onChange={(v) => setSetting('sound', v)}
        />
      </div>

      {confirmReset ? (
        <div className="rounded-2xl border-2 border-duo-red/40 bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-sm font-bold text-duo-red mb-3">Reset all progress? This can't be undone.</p>
          <div className="flex gap-3">
            <Button color="white" className="flex-1" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
            <Button color="red" className="flex-1" onClick={() => { resetAll(); setConfirmReset(false) }}>
              Reset
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setConfirmReset(true)}
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-duo-red"
        >
          <RotateCcw className="w-4 h-4" /> Reset progress
        </button>
      )}
    </div>
  )
}

function Stat({ icon: Icon, color, value, label }) {
  return (
    <div className="rounded-2xl border-2 border-gray-100 dark:border-gray-700 p-3 text-center">
      <Icon className={`w-6 h-6 mx-auto mb-1 ${color}`} fill="currentColor" />
      <div className="text-xl font-extrabold text-duo-ink dark:text-gray-100">{value}</div>
      <div className="text-[11px] text-gray-400 font-bold uppercase">{label}</div>
    </div>
  )
}

function Toggle({ icon: Icon, label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between p-4 cursor-pointer">
      <span className="flex items-center gap-3 font-bold text-duo-ink dark:text-gray-100">
        <Icon className="w-5 h-5 text-gray-400" /> {label}
      </span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-12 h-7 rounded-full transition-colors relative ${checked ? 'bg-duo-green' : 'bg-gray-300 dark:bg-gray-600'}`}
      >
        <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${checked ? 'left-6' : 'left-1'}`} />
      </button>
    </label>
  )
}
