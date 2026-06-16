import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { MATCHES } from '../lib/matches'
import { FlagImg } from '../components/FlagImg'

const PICK_LABEL = { home: '1', draw: 'X', away: '2' }
const PICK_NAME = {
  home: (match) => match.home,
  draw: () => 'תיקו',
  away: (match) => match.away,
}

export default function StatsPage({ user }) {
  const [users, setUsers] = useState([])
  const [allPredictions, setAllPredictions] = useState([])
  const [results, setResults] = useState({})
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    const [usersRes, predRes, resultRes] = await Promise.all([
      supabase.from('users').select('id, nickname'),
      supabase.from('predictions').select('*'),
      supabase.from('results').select('*'),
    ])
    const usersList = usersRes.data || []
    setUsers(usersList)
    setAllPredictions(predRes.data || [])
    const rmap = {}
    resultRes.data?.forEach(r => { rmap[r.match_id] = r.result })
    setResults(rmap)
    const me = usersList.find(u => u.nickname === user.nickname)
    if (me) setSelected(me)
    setLoading(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64" style={{ background: '#14532d' }}>
      <div className="animate-bounce text-5xl">⚽</div>
    </div>
  )

  function getUserStats(userId) {
    const userPreds = {}
    allPredictions.filter(p => p.user_id === userId).forEach(p => { userPreds[p.match_id] = p.prediction })
    return MATCHES.map(m => {
      const pick = userPreds[m.id]
      const res = results[m.id]
      const played = !!res
      const status = !played ? 'future' : !pick ? 'missed' : pick === res ? 'correct' : 'wrong'
      return { match: m, pick, result: res, played, status }
    })
  }

  const stats = selected ? getUserStats(selected.id) : []
  const played = stats.filter(s => s.played)
  const correct = played.filter(s => s.status === 'correct').length
  const wrong = played.filter(s => s.status === 'wrong').length
  const missed = played.filter(s => s.status === 'missed').length
  const future = stats.filter(s => s.status === 'future')
  const predicted = future.filter(s => s.pick)

  return (
    <div className="pb-24 min-h-screen" dir="rtl" style={{ background: '#14532d' }}>
      {/* User selector */}
      <div className="px-3 pt-4 pb-3">
        <p className="text-green-200 text-xs font-medium mb-2">בחר משתתף לצפייה:</p>
        <div className="flex flex-wrap gap-2">
          {users.map(u => (
            <button key={u.id} onClick={() => setSelected(u)}
              className={`px-3 py-1.5 rounded-full text-sm font-bold border transition-all ${
                selected?.id === u.id
                  ? 'bg-white text-green-800 border-white shadow'
                  : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
              }`}>
              {u.nickname}{u.nickname === user.nickname ? ' (אני)' : ''}
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <>
          {/* Summary */}
          {played.length > 0 && (
            <div className="mx-3 mb-3 grid grid-cols-3 gap-2">
              <div className="rounded-2xl p-3 text-center bg-white shadow">
                <p className="text-green-700 text-2xl font-black">{correct}</p>
                <p className="text-gray-500 text-xs mt-0.5">✅ נכון</p>
              </div>
              <div className="rounded-2xl p-3 text-center bg-white shadow">
                <p className="text-red-500 text-2xl font-black">{wrong}</p>
                <p className="text-gray-500 text-xs mt-0.5">❌ טעות</p>
              </div>
              <div className="rounded-2xl p-3 text-center bg-white shadow">
                <p className="text-gray-400 text-2xl font-black">{missed}</p>
                <p className="text-gray-500 text-xs mt-0.5">⬜ לא ניחש</p>
              </div>
            </div>
          )}

          {/* Played matches */}
          {played.length > 0 && (
            <div className="px-3 mb-4">
              <p className="text-green-200 text-xs font-bold mb-2 px-1">משחקים שהסתיימו</p>
              <div className="space-y-2">
                {played.map(({ match, pick, result: res, status }) => (
                  <div key={match.id} className={`bg-white rounded-2xl px-4 py-3 shadow border-r-4 ${
                    status === 'correct' ? 'border-green-500' :
                    status === 'wrong' ? 'border-red-400' :
                    'border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <FlagImg country={match.home} size={20} className="rounded flex-shrink-0" />
                        <span className="text-xs font-bold text-gray-800 truncate">{match.home}</span>
                        <span className="text-gray-400 text-xs mx-0.5">vs</span>
                        <FlagImg country={match.away} size={20} className="rounded flex-shrink-0" />
                        <span className="text-xs font-bold text-gray-800 truncate">{match.away}</span>
                      </div>
                      <span className="text-lg flex-shrink-0 mr-2">
                        {status === 'correct' ? '✅' : status === 'wrong' ? '❌' : '⬜'}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-1.5">
                      <span className="text-xs text-gray-500">
                        ניחוש:{' '}
                        <span className={`font-bold ${pick ? 'text-gray-800' : 'text-gray-300'}`}>
                          {pick ? `${PICK_LABEL[pick]} (${PICK_NAME[pick](match)})` : 'לא ניחש'}
                        </span>
                      </span>
                      <span className="text-xs text-gray-500">
                        תוצאה:{' '}
                        <span className="font-bold text-gray-800">{PICK_LABEL[res]} ({PICK_NAME[res](match)})</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {played.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">⚽</p>
              <p className="text-green-300">עדיין לא הסתיים אף משחק</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
