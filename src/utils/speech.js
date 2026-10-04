// Text-to-speech for Japanese kana using the Web Speech API.
// Gracefully degrades when no Japanese voice is available.
//
// iOS/Safari specifics handled here:
//  - speech is blocked until a user gesture "unlocks" the engine, so lesson
//    auto-play would stay silent; we unlock on the first touch/click/key.
//  - getVoices() is often empty at startup and can change later.
//  - cancel() immediately followed by speak() can drop the new utterance.
//  - the default Japanese voice is not always the best one installed.

import { BY_KANA } from '../data/katakana.js'
import { BY_WORD } from '../data/words.js'

let jaVoice = null
let fallbackVoice = null
let voicesLoaded = false
let warned = false
let unlocked = false
let speakToken = 0
let pending = null

const supported =
  typeof window !== 'undefined' &&
  'speechSynthesis' in window &&
  typeof SpeechSynthesisUtterance !== 'undefined'

const normLang = (v) => (v.lang || '').toLowerCase().replace('_', '-')

// Higher is better: prefer premium/enhanced and well-known natural voices.
function scoreVoice(v) {
  let s = 0
  if (/premium/i.test(v.name)) s += 40
  if (/enhanced/i.test(v.name)) s += 30
  if (/kyoko|otoya|hattori|o-ren|google|nanami|haruka|ayumi/i.test(v.name)) s += 15
  if (v.localService) s += 5
  if (normLang(v) === 'ja-jp') s += 3
  return s
}

function loadVoices() {
  if (!supported) return
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return
  voicesLoaded = true
  const ja = voices.filter((v) => normLang(v).startsWith('ja') || /japan/i.test(v.name))
  jaVoice = ja.sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] || null
  // Firefox/Safari only produce audio when a voice is explicitly assigned, so
  // keep a default (usually the system/English voice) for the fallback path.
  fallbackVoice =
    voices.find((v) => v.default) ||
    voices.find((v) => normLang(v).startsWith('en')) ||
    voices[0] ||
    null
}

// Speaking a silent utterance inside a user gesture enables later programmatic
// speech (needed on iOS Safari).
function unlock() {
  if (!supported || unlocked) return
  unlocked = true
  try {
    const u = new SpeechSynthesisUtterance(' ')
    u.volume = 0
    window.speechSynthesis.speak(u)
  } catch {}
  loadVoices()
  for (const ev of ['touchend', 'click', 'keydown']) window.removeEventListener(ev, unlock, true)
}

export function initSpeech() {
  if (!supported) return
  loadVoices()
  if (window.speechSynthesis.addEventListener) {
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
  } else {
    window.speechSynthesis.onvoiceschanged = loadVoices
  }
  // Some browsers never fire `voiceschanged`, so poll briefly.
  let tries = 0
  const iv = setInterval(() => {
    loadVoices()
    if (voicesLoaded || ++tries > 20) clearInterval(iv)
  }, 250)

  for (const ev of ['touchend', 'click', 'keydown']) window.addEventListener(ev, unlock, true)
  // iOS can leave the engine stuck after backgrounding the tab.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      speakToken++
      try { window.speechSynthesis.cancel() } catch {}
    }
  })
}

export function hasJapaneseVoice() {
  if (!voicesLoaded) loadVoices()
  return !!jaVoice
}

function doSpeak(text, rate) {
  const synth = window.speechSynthesis
  let spoken = text
  let voice = jaVoice
  let lang = 'ja-JP'

  // No Japanese voice on this device/browser: read the romaji with the
  // default voice instead of staying silent.
  if (!voice) {
    const romaji = BY_KANA[text]?.romaji ?? BY_WORD[text]?.romaji
    if (romaji) spoken = romaji
    voice = fallbackVoice
    lang = fallbackVoice?.lang || 'en-US'
    if (!warned) {
      warned = true
      console.warn(
        '[speech] No Japanese (ja-JP) voice installed. Falling back to romaji ' +
          'pronunciation. Install a Japanese system voice for accurate audio.'
      )
    }
  }

  const u = new SpeechSynthesisUtterance(spoken)
  if (voice) u.voice = voice
  u.lang = voice?.lang || lang
  u.rate = rate
  u.pitch = 1
  u.volume = 1
  // Keep a reference so the utterance isn't garbage-collected mid-speech.
  pending = u
  u.onend = u.onerror = () => {
    if (pending === u) pending = null
  }

  try { synth.resume() } catch {}
  synth.speak(u)
}

export function speak(text, { rate = 0.6 } = {}) {
  if (!supported || !text) return false
  if (!voicesLoaded) loadVoices()
  const synth = window.speechSynthesis
  const token = ++speakToken
  try {
    if (synth.speaking || synth.pending) {
      synth.cancel()
      // iOS drops an utterance queued in the same tick as cancel().
      setTimeout(() => {
        if (token === speakToken) doSpeak(text, rate)
      }, 80)
    } else {
      doSpeak(text, rate)
    }
    return true
  } catch (e) {
    return false
  }
}
