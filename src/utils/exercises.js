import { BY_KANA } from '../data/katakana.js'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function sample(arr, n) {
  return shuffle(arr).slice(0, n)
}

const romaji = (kana) => BY_KANA[kana]?.romaji ?? ''

// Build distractor options that are different from the answer.
function distractors(answerKana, pool, count, key = 'kana') {
  const candidates = pool.filter((k) => k !== answerKana && romaji(k) !== romaji(answerKana))
  const picked = sample(candidates, count).map((k) => (key === 'romaji' ? romaji(k) : k))
  return [...new Set(picked)]
}

function makeSelectRomaji(kana, pool) {
  const options = shuffle([romaji(kana), ...distractors(kana, pool, 3, 'romaji')])
  return { id: rid(), type: 'selectRomaji', kana, options, answer: romaji(kana) }
}

function makeSelectKatakana(kana, pool) {
  const options = shuffle([kana, ...distractors(kana, pool, 3, 'kana')])
  return { id: rid(), type: 'selectKatakana', romaji: romaji(kana), options, answer: kana }
}

function makeListen(kana, pool) {
  const options = shuffle([kana, ...distractors(kana, pool, 3, 'kana')])
  return { id: rid(), type: 'listen', kana, options, answer: kana }
}

function makeType(kana) {
  return { id: rid(), type: 'typeRomaji', kana, answer: romaji(kana) }
}

function makeMatch(kanas) {
  const chosen = sample(kanas, Math.min(5, kanas.length))
  return {
    id: rid(),
    type: 'match',
    pairs: chosen.map((k) => ({ kana: k, romaji: romaji(k) })),
  }
}

let _id = 0
function rid() {
  return `ex_${_id++}`
}

// Generate a lesson focused on new kana, with a small number of earlier kana
// deliberately brought back for practice.
export function generateLesson(targets, pool, opts = {}) {
  const { withIntro = false, reviewTargets = [] } = opts
  const distractorPool = [...new Set(pool)]
  const ex = []

  if (withIntro) {
    for (const k of targets) ex.push({ id: rid(), type: 'intro', kana: k })
  }

  // New kana receive multiple question types; a smaller sample of earlier
  // kana is mixed in so each lesson also revisits previously learned material.
  const quiz = []
  targets.forEach((k, i) => {
    quiz.push(makeSelectRomaji(k, distractorPool))
    quiz.push(i % 2 === 0 ? makeSelectKatakana(k, distractorPool) : makeListen(k, distractorPool))
  })

  const review = sample(reviewTargets, Math.min(3, reviewTargets.length))
  review.forEach((k, i) => {
    quiz.push(i % 2 === 0 ? makeListen(k, distractorPool) : makeSelectKatakana(k, distractorPool))
  })

  const practiceTargets = [...new Set([...targets, ...review])]
  sample(practiceTargets, Math.min(2, practiceTargets.length)).forEach((k) => quiz.push(makeType(k)))

  const sequence = shuffle(quiz)

  const matchTargets = [...new Set([...targets, ...review])]
  if (matchTargets.length >= 3) {
    sequence.splice(Math.floor(sequence.length / 2), 0, makeMatch(matchTargets))
  }

  return [...ex, ...sequence]
}

// Generate a review session focused on the provided kana (weak/due first).
export function generateReview(kanas, pool, count = 12) {
  const distractorPool = [...new Set(pool)]
  const focus = kanas.length ? kanas : sample(pool, Math.min(count, pool.length))
  const out = []
  let i = 0
  while (out.length < count && focus.length) {
    const k = focus[i % focus.length]
    const r = out.length % 3
    if (r === 0) out.push(makeSelectRomaji(k, distractorPool))
    else if (r === 1) out.push(makeListen(k, distractorPool))
    else out.push(makeSelectKatakana(k, distractorPool))
    i++
  }
  if (focus.length >= 3) out.splice(2, 0, makeMatch(focus))
  return out
}

export { shuffle }
