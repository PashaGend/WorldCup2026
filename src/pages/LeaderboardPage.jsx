import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { MATCHES, TEAM_EN_TO_HE } from '../lib/matches'

export default function LeaderboardPage({ user }) {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadScores() }, [])

  async function loadScores() {
    setLoading(true)
    try {
      const [{ data: users }, { data: predictions }, { data: results }, { data: scorePreds }, apiScores] = await Promise.all([
        supabase.from('users').select('id, nickname'),
        supabase.from('predictions').select('*'),
        supabase.from('results').select('*'),
        supabase.from('score_predictions').select('*'),
        fetch('https://worldcup26.ir/get/games').then(r => r.ok ? r.json() : { games: [] }).catch(() => ({ games: [] })),
      ])

      const rmap = {}; results?.forEach(r => { rmap[r.match_id] = r.result })

      // Build live score map from API
      const liveScores = {}
      for (const g of apiScores.games || []) {
        if (g.finished !== 'TRUE') continue
        const homeHe = TEAM_EN_TO_HE[g.home_team_name_en]
        const awayHe = TEAM_EN_TO_HE[g.away_team_name_en]
        if (!homeHe || !awayHe) continue
        let match = MATCHES.find(m => m.home === homeHe && m.away === awayHe)
        if (match) {
          liveScores[match.id] = { home: parseInt(g.home_score), away: parseInt(g.away_score) }
        } else {
          match = MATCHES.find(m => m.home === awayHe && m.away === homeHe)
          if (match) liveScores[match.id] = { home: parseInt(g.away_score), away: parseInt(g.home_score) }
        }
      }

      // Build score predictions map: user_id -> match_id -> { home, away }
      const spmap = {}
      scorePreds?.forEach(sp => {
        if (!spmap[sp.user_id]) spmap[sp.user_id] = {}
        spmap[sp.user_id][sp.match_id] = { home: sp.home_score, away: sp.away_score }
      })

      const umap = {}; users?.forEach(u => { umap[u.id] = { nickname: u.nickname, points: 0, total: 0 } })
      predictions?.forEach(p => {
        if (!umap[p.user_id]) return
        const sc = liveScores[p.match_id]
        const result = rmap[p.match_id] || (sc ? (sc.home > sc.away ? 'home' : sc.home < sc.away ? 'away' : 'draw') : null)
        if (!result) return
        umap[p.user_id].total++
        if (p.prediction !== result) return
        let pts = 1
        const sp = spmap[p.user_id]?.[p.match_id]
        if (sc && sp && sp.home === sc.home && sp.away === sc.away) pts += 3
        umap[p.user_id].points += pts
      })
      setScores(Object.values(umap).sort((a, b) => b.points - a.points || b.total - a.total))
    } finally { setLoading(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64" style={{ background: '#1a1a2e' }}>
      <div className="animate-spin text-4xl">⚽</div>
    </div>
  )

  const myRank = scores.findIndex(s => s.nickname === user.nickname) + 1
  const rankEmoji = ['🥇', '🥈', '🥉']

  return (
    <div className="pb-4 min-h-screen" dir="rtl" style={{ background: '#1a1a2e' }}>
      {myRank > 0 && (
        <div className="mx-3 mt-3 flex items-center justify-between px-5 py-3 rounded-2xl"
          style={{ background: 'linear-gradient(135deg, #064e3b, #065f46)', border: '1px solid rgba(52,211,153,0.2)' }}>
          <span className="text-emerald-300 text-sm">המיקום שלי</span>
          <span className="text-white font-black text-2xl">#{myRank}</span>
        </div>
      )}

      <div className="mx-3 mt-3 space-y-2">
        {scores.map((s, i) => {
          const isMe = s.nickname === user.nickname
          const isFirst = i === 0
          return (
            <div key={s.nickname} className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{
                background: isMe ? 'rgba(52,211,153,0.1)' : isFirst ? 'rgba(251,191,36,0.07)' : 'rgba(255,255,255,0.03)',
                border: isMe ? '1px solid rgba(52,211,153,0.3)' : isFirst ? '1px solid rgba(251,191,36,0.25)' : '1px solid rgba(255,255,255,0.06)'
              }}>
              <span className="text-xl w-7 text-center">{rankEmoji[i] || <span className="text-gray-600 font-black text-sm">{i + 1}</span>}</span>
              <span className={`flex-1 font-bold text-sm ${isMe ? 'text-emerald-300' : isFirst ? 'text-yellow-300' : 'text-gray-300'}`}>
                {s.nickname} {isMe && <span className="text-xs text-emerald-600">(אתה)</span>}
              </span>
              <span className={`font-black text-lg ${isMe ? 'text-emerald-400' : isFirst ? 'text-yellow-400' : 'text-gray-400'}`}>{s.points}</span>
              <span className="text-gray-600 text-xs">נק'</span>
            </div>
          )
        })}
      </div>

      {scores.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">⚽</p>
          <p className="text-gray-600">עדיין אין ניחושים</p>
        </div>
      )}
    </div>
  )
}
