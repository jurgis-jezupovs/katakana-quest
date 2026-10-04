# Katakana Quest

A mobile-first, Duolingo-style React app for learning Japanese **Katakana** — with a few improvements over Duolingo.

## Features

- **Duolingo-style learning path** — winding path of units (vowels → K → S → … → dakuten) with lesson nodes, hearts, XP, and a daily streak.
- **Varied exercises** — select the sound, pick the character, listen-and-choose (Japanese text-to-speech), tap-the-pairs matching, and free-typing recall.
- **Progressive lessons** — characters are introduced in groups, earlier characters return for practice, and each unit ends with a mixed review.
- **Teaching cards with mnemonics** — new characters are introduced with a memory aid + example word.

### Improvements over Duolingo

- **Smart Review (spaced repetition)** — characters you get wrong resurface sooner; review is limited to characters you've encountered and targets the due/weakest kana.
- **Unlimited-hearts practice** — Smart Review never blocks you on mistakes.
- **Free-typing exercises** — stronger active recall than multiple-choice-only.
- **Character chart with strength heatmap** — see at a glance which kana are strong / learning / weak, tap any to hear it.
- **Audio for every character** via the Web Speech API (uses an installed Japanese voice when available).
- **Dark mode** and offline progress saved in `localStorage`.

## Run locally

```bash
npm install
npm run dev
```

Then open the printed `localhost` URL.

```bash
npm run build   # production build
npm run preview # preview the build
```

## Tech

React 18 + Vite, Tailwind CSS, lucide-react icons, Web Speech API for pronunciation.

> **Audio note:** pronunciation uses your device's installed Japanese (`ja-JP`) voice. Most phones and modern browsers include one; if none is installed, audio is silently skipped while everything else works.
