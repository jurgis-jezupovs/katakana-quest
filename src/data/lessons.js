import { CHARACTERS, DAKUTEN } from './katakana.js'

const byRow = (chars, row) => chars.filter((c) => c.row === row).map((c) => c.kana)

// A unit is a node on the learning path. Each unit contains `lessonCount`
// lessons. Earlier lessons in a unit introduce its kana; later lessons mix in
// previously learned kana for spaced review.
export const UNITS = [
  {
    id: 'vowels',
    title: 'Vowels',
    subtitle: 'ア イ ウ エ オ',
    color: '#58cc02',
    kanas: byRow(CHARACTERS, 'vowels'),
    lessonCount: 3,
  },
  {
    id: 'k',
    title: 'K Row',
    subtitle: 'カ キ ク ケ コ',
    color: '#1cb0f6',
    kanas: byRow(CHARACTERS, 'k'),
    lessonCount: 3,
  },
  {
    id: 's',
    title: 'S Row',
    subtitle: 'サ シ ス セ ソ',
    color: '#ce82ff',
    kanas: byRow(CHARACTERS, 's'),
    lessonCount: 3,
  },
  {
    id: 't',
    title: 'T Row',
    subtitle: 'タ チ ツ テ ト',
    color: '#ff9600',
    kanas: byRow(CHARACTERS, 't'),
    lessonCount: 3,
  },
  {
    id: 'n',
    title: 'N Row',
    subtitle: 'ナ ニ ヌ ネ ノ',
    color: '#58cc02',
    kanas: byRow(CHARACTERS, 'n'),
    lessonCount: 3,
  },
  {
    id: 'h',
    title: 'H Row',
    subtitle: 'ハ ヒ フ ヘ ホ',
    color: '#1cb0f6',
    kanas: byRow(CHARACTERS, 'h'),
    lessonCount: 3,
  },
  {
    id: 'm',
    title: 'M Row',
    subtitle: 'マ ミ ム メ モ',
    color: '#ce82ff',
    kanas: byRow(CHARACTERS, 'm'),
    lessonCount: 3,
  },
  {
    id: 'yr',
    title: 'Y & R Rows',
    subtitle: 'ヤ ユ ヨ ラ リ ル レ ロ',
    color: '#ff9600',
    kanas: [...byRow(CHARACTERS, 'y'), ...byRow(CHARACTERS, 'r')],
    lessonCount: 4,
  },
  {
    id: 'wn',
    title: 'W Row & N',
    subtitle: 'ワ ヲ ン',
    color: '#58cc02',
    kanas: byRow(CHARACTERS, 'w'),
    lessonCount: 3,
  },
  {
    id: 'dakuten',
    title: 'Dakuten',
    subtitle: 'ガ ザ ダ バ パ …',
    color: '#1cb0f6',
    kanas: DAKUTEN.map((c) => c.kana),
    lessonCount: 5,
  },
]

// All kana taught up to and including the given unit (for review pools).
export function kanasUpTo(unitId) {
  const pool = []
  for (const u of UNITS) {
    pool.push(...u.kanas)
    if (u.id === unitId) break
  }
  return pool
}

export function getLessonPlan(unitId, lessonIndex) {
  const unitIndex = UNITS.findIndex((unit) => unit.id === unitId)
  if (unitIndex < 0) return null

  const unit = UNITS[unitIndex]
  if (!Number.isInteger(lessonIndex) || lessonIndex < 0 || lessonIndex >= unit.lessonCount) return null

  const previousKanas = UNITS.slice(0, unitIndex).flatMap((previousUnit) => previousUnit.kanas)
  const isCapstone = lessonIndex === unit.lessonCount - 1
  const teachingLessonCount = Math.max(1, unit.lessonCount - 1)
  const chunkIndex = Math.min(lessonIndex, teachingLessonCount - 1)
  const start = Math.floor((chunkIndex * unit.kanas.length) / teachingLessonCount)
  const end = Math.floor(((chunkIndex + 1) * unit.kanas.length) / teachingLessonCount)
  const introduced = isCapstone ? [] : unit.kanas.slice(start, end)
  const currentUnitPool = isCapstone ? unit.kanas : unit.kanas.slice(0, end)
  const pool = [...previousKanas, ...currentUnitPool]

  return {
    targets: isCapstone ? unit.kanas : introduced,
    pool,
    reviewTargets: isCapstone ? previousKanas : pool.filter((kana) => !introduced.includes(kana)),
    withIntro: introduced.length > 0,
  }
}

export const ALL_UNIT_KANAS = UNITS.flatMap((u) => u.kanas)
