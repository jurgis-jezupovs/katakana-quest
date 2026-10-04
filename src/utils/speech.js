// Text-to-speech for Japanese kana using the Web Speech API.
// Gracefully degrades when no Japanese voice is available.

import { BY_KANA } from '../data/katakana.js'
import { BY_WORD } from '../data/words.js'

let jaVoice = null
let fallbackVoice = null
let voicesLoaded = false
let warned = false

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

function loadVoices() {
  if (!supported) return
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return
  voicesLoaded = true
  // Prefer an explicit Japanese voice.
  jaVoice =
    voices.find((v) => (v.lang || '').toLowerCase().replace('_', '-').startsWith('ja')) ||
    voices.find((v) => /japan/i.test(v.name)) ||
    null
  // Firefox only produces audio when a voice is explicitly assigned, so we
  // keep a default (usually the system/English voice) for the fallback path.
  fallbackVoice =
    voices.find((v) => v.default) ||
    voices.find((v) => (v.lang || '').toLowerCase().startsWith('en')) ||
    voices[0] ||
    null
}

export function initSpeech() {
  if (!supported) return
  loadVoices()
  window.speechSynthesis.onvoiceschanged = loadVoices
  // Some browsers (notably Firefox) never fire `voiceschanged`, so poll briefly.
  let tries = 0
  const iv = setInterval(() => {
    loadVoices()
    if (voicesLoaded || ++tries > 20) clearInterval(iv)
  }, 250)
}

export function hasJapaneseVoice() {
  if (!voicesLoaded) loadVoices()
  return !!jaVoice
}

export function speak(text, { rate = 0.85 } = {}) {
  if (!supported) return false
  if (!voicesLoaded) loadVoices()
  const synth = window.speechSynthesis
  try {
    synth.cancel()

    let spoken = text
    let voice = jaVoice
    let lang = 'ja-JP'

    // No Japanese voice on this device/browser: read the romaji with the
    // default voice instead of staying silent (common on Windows Firefox).
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
    // Firefox requires an explicit voice; without it it stays silent.
    if (voice) u.voice = voice
    u.lang = lang
    u.rate = rate
    u.pitch = 1

    // Chrome can leave the engine paused; resume defensively.
    try { synth.resume() } catch {}
    synth.speak(u)
    return true
  } catch (e) {
    return false
  }
}
