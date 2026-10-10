import React, { useEffect, useState } from 'react'
import { Home as HomeIcon, Grid3x3, User, Flame, Zap } from 'lucide-react'
import Home from './components/Home.jsx'
import Chart from './components/Chart.jsx'
import Profile from './components/Profile.jsx'
import LessonPlayer from './components/LessonPlayer.jsx'
import { useProgress } from './hooks/useProgress.js'
import { initSpeech } from './utils/speech.js'
import { UNITS, getLessonPlan } from './data/lessons.js'
import { generateLesson, generateReview } from './utils/exercises.js'

export default function App() {
  const progress = useProgress()
  const [view, setView] = useState('home')
  const [session, setSession] = useState(null)

  useEffect(() => {
    initSpeech()
  }, [])

  const startLesson = (unitId, lessonIndex) => {
    const unit = UNITS.find((u) => u.id === unitId)
    const plan = getLessonPlan(unitId, lessonIndex)
    if (!unit || !plan) return
    const exercises = generateLesson(plan.targets, plan.pool, {
      withIntro: plan.withIntro,
      reviewTargets: plan.reviewTargets,
    })
    setSession({
      title: `${unit.title} · Lesson ${lessonIndex + 1}`,
      exercises,
      unitId,
      lessonIndex,
      practiceMode: false,
    })
  }

  const learnedKanas = UNITS.flatMap((unit) => unit.kanas).filter(
    (kana) => progress.state.stats[kana]?.seen > 0
  )

  const startReview = () => {
    if (!learnedKanas.length) return
    const due = progress.dueKanas(learnedKanas)
    const weak = progress.weakKanas(learnedKanas)
    const focus = [...new Set([...due, ...weak])].slice(0, 8)
    const exercises = generateReview(focus, learnedKanas, 12)
    setSession({
      title: 'Smart Review',
      exercises,
      practiceMode: true,
    })
  }

  const finishSession = (xp) => {
    if (session && !session.practiceMode) {
      progress.completeLesson(session.unitId, session.lessonIndex, xp)
    } else if (session) {
      // Practice still grants a little XP and keeps the streak alive.
      progress.completeLesson('review', Date.now(), xp)
    }
    setSession(null)
  }

  if (session) {
    return (
      <div className="h-full bg-white dark:bg-gray-900">
        <LessonPlayer
          title={session.title}
          exercises={session.exercises}
          recordResult={progress.recordResult}
          practiceMode={session.practiceMode}
          onExit={() => setSession(null)}
          onComplete={finishSession}
        />
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 text-duo-ink dark:text-gray-100 flex flex-col">
      <TopBar streak={progress.state.streak} xp={progress.state.xp} />

      <main className="flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain no-scrollbar">
        {view === 'home' && (
          <Home
            progress={progress}
            learnedKanas={learnedKanas}
            onStartLesson={startLesson}
            onStartReview={startReview}
          />
        )}
        {view === 'chart' && <Chart progress={progress} />}
        {view === 'profile' && <Profile progress={progress} />}
      </main>

      <BottomNav view={view} setView={setView} />
    </div>
  )
}

function TopBar({ streak, xp }) {
  return (
    <header className="sticky top-0 z-20 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-extrabold text-duo-green">
          <span className="text-xl font-jp">ア</span>
          <span className="tracking-tight">Katakana Quest</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 font-extrabold text-duo-red">
            <Flame className="w-5 h-5" fill="currentColor" />
            {streak}
          </div>
          <div className="flex items-center gap-1 font-extrabold text-duo-gold">
            <Zap className="w-5 h-5" fill="currentColor" />
            {xp}
          </div>
        </div>
      </div>
    </header>
  )
}

function BottomNav({ view, setView }) {
  const items = [
    { id: 'home', icon: HomeIcon, label: 'Learn' },
    { id: 'chart', icon: Grid3x3, label: 'Chart' },
    { id: 'profile', icon: User, label: 'Profile' },
  ]
  return (
    <nav className="sticky bottom-0 z-20 bg-white dark:bg-gray-900 border-t-2 border-gray-100 dark:border-gray-800 safe-bottom">
      <div className="max-w-md mx-auto flex">
        {items.map((it) => {
          const active = view === it.id
          const Icon = it.icon
          return (
            <button
              key={it.id}
              onClick={() => setView(it.id)}
              className={`flex-1 py-3 flex flex-col items-center gap-0.5 font-bold text-xs transition-colors ${
                active ? 'text-duo-blue' : 'text-gray-400'
              }`}
            >
              <span className={`p-1.5 rounded-xl ${active ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
                <Icon className="w-6 h-6" />
              </span>
              {it.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
