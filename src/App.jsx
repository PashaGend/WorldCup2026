import { useState, useEffect } from 'react'
import { useUser } from './lib/useUser'
import { supabase } from './lib/supabase'
import LoginPage from './pages/LoginPage'
import MatchesPage from './pages/MatchesPage'
import LeaderboardPage from './pages/LeaderboardPage'
import StatsPage from './pages/StatsPage'
import AdminPage from './pages/AdminPage'
import Navbar from './components/Navbar'

export default function App() {
  const { user, login, logout } = useUser()
  const [tab, setTab] = useState('matches')

  // Verify user still exists in DB on every load
  useEffect(() => {
    if (!user) return
    supabase.from('users').select('id').eq('id', user.id).single()
      .then(({ data }) => { if (!data) logout() })
  }, [])

  if (!user) return <LoginPage onLogin={login} />

  return (
    <div className="max-w-[480px] mx-auto min-h-screen flex flex-col" dir="rtl" style={{ background: '#1a1a2e' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-3"
        style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚽</span>
          <div>
            <h1 className="text-white font-black text-base leading-none tracking-tight">מונדיאל 2026</h1>
            <p className="text-emerald-300 text-xs mt-0.5 opacity-80">שלום, {user.nickname}</p>
          </div>
        </div>
        <button onClick={logout}
          className="text-xs text-emerald-300 border border-emerald-700 px-3 py-1.5 rounded-full hover:bg-emerald-900/50 transition-all">
          יציאה
        </button>
      </div>

      <div className="flex-1">
        {tab === 'matches' && <MatchesPage user={user} />}
        {tab === 'leaderboard' && <LeaderboardPage user={user} />}
        {tab === 'stats' && <StatsPage user={user} />}
        {tab === 'admin' && <AdminPage />}
      </div>

      <Navbar tab={tab} setTab={setTab} />
    </div>
  )
}
