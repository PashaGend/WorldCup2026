import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { MATCHES, ADMIN_PASSWORD, TEAM_EN_TO_HE } from '../lib/matches'
import { FlagImg } from '../components/FlagImg'

function isBeforeMatch(dateStr) {
  return new Date() < new Date(dateStr)
}

const STAGE_ORDER = ['בתים', 'שלב 32', 'שמינית גמר', 'רבע גמר', 'חצי גמר', 'גמר 3-4', 'גמר']

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [results, setResults] = useState({})
  const [teamNames, setTeamNames] = useState({}) // matchId -> { home, away }
  const [saving, setSaving] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState('')
  const [activeStage, setActiveStage] = useState('בתים')
  const [editingTeam, setEditingTeam] = useState(null) // { matchId, side }
  const [teamInput, setTeamInput] = useState('')

  useEffect(() => { if (authed) loadData() }, [authed])

  async function loadData() {
    const [resData, namesData] = await Promise.all([
      supabase.from('results').select('*'),
      supabase.from('match_teams').select('*').catch(() => ({ data: [] })),
    ])
    const rmap = {}
    resData.data?.forEach(r => { rmap[r.match_id] = r.result })
    setResults(rmap)
    const nmap = {}
    namesData.data?.forEach(n => { nmap[n.match_id] = { home: n.home, away: n.away } })
    setTeamNames(nmap)
  }

  async function setResult(matchId, result) {
    setSaving(matchId)
    try {
      if (results[matchId]) {
        await supabase.from('results').update({ result }).eq('match_id', matchId)
      } else {
        await supabase.from('results').insert({ match_id: matchId, result })
      }
      setResults(prev => ({ ...prev, [matchId]: result }))
    } catch { alert('שגיאה') }
    finally { setSaving(null) }
  }

  async function saveTeamName(matchId, side, name) {
    const existing = teamNames[matchId]
    const update = { match_id: matchId, home: existing?.home || '', away: existing?.away || '', [side]: name }
    try {
      if (existing) {
        await supabase.from('match_teams').update({ [side]: name }).eq('match_id', matchId)
      } else {
        await supabase.from('match_teams').insert(update)
      }
      setTeamNames(prev => ({ ...prev, [matchId]: { ...prev[matchId], ...update } }))
    } catch { alert('שגיאה בשמירת שם') }
    setEditingTeam(null)
  }

  async function handleSync() {
    setSyncing(true)
    setSyncMsg('')
    try {
      const res = await fetch('https://worldcup26.ir/get/games')
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      let updated = 0
      for (const g of data.games || []) {
        if (g.finished !== 'TRUE') continue
        const homeHe = TEAM_EN_TO_HE[g.home_team_name_en]
        const awayHe = TEAM_EN_TO_HE[g.away_team_name_en]
        if (!homeHe || !awayHe) continue
        let match = MATCHES.find(m => m.home === homeHe && m.away === awayHe)
        let h = parseInt(g.home_score), a = parseInt(g.away_score)
        if (!match) {
          match = MATCHES.find(m => m.home === awayHe && m.away === homeHe)
          if (match) { [h, a] = [a, h] }
        }
        if (!match) continue
        const outcome = h > a ? 'home' : h < a ? 'away' : 'draw'
        if (results[match.id] === outcome) continue
        await setResult(match.id, outcome)
        updated++
      }
      setSyncMsg(updated > 0 ? `✅ עודכנו ${updated} משחקים` : '✅ הכל עדכני')
    } catch (e) {
      setSyncMsg('⚠️ שגיאה: ' + e.message)
    } finally { setSyncing(false) }
  }

  if (!authed) return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0d1526' }}>
      <div className="rounded-3xl p-8 w-full max-w-sm shadow-2xl" dir="rtl"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
        <h2 className="text-xl font-black text-white text-center mb-6">🔐 כניסת מנהל</h2>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && password === ADMIN_PASSWORD && setAuthed(true)}
          placeholder="סיסמה"
          className="w-full rounded-2xl px-4 py-3 text-center text-white text-lg mb-4 focus:outline-none"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }} />
        {password && password !== ADMIN_PASSWORD && <p className="text-red-400 text-sm text-center mb-3">סיסמה שגויה</p>}
        <button onClick={() => password === ADMIN_PASSWORD && setAuthed(true)}
          className="w-full py-3 rounded-2xl font-black text-white transition active:scale-95"
          style={{ background: 'linear-gradient(135deg, #1d4ed8, #1e40af)' }}>כניסה</button>
      </div>
    </div>
  )

  // Group matches by stage
  const byStage = {}
  for (const m of MATCHES) {
    const s = m.stage || 'בתים'
    if (!byStage[s]) byStage[s] = []
    byStage[s].push(m)
  }
  const stages = STAGE_ORDER.filter(s => byStage[s])
  const stageMatches = (byStage[activeStage] || []).filter(m => !isBeforeMatch(m.date))

  return (
    <div className="pb-24 min-h-screen" dir="rtl" style={{ background: '#0d1526' }}>
      <div className="px-3 pt-4">
        {/* Sync button */}
        <button onClick={handleSync} disabled={syncing}
          className="w-full font-black py-3 rounded-2xl mb-2 transition active:scale-95 disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: 'white', boxShadow: '0 4px 20px rgba(37,99,235,0.4)' }}>
          {syncing ? '🔄 מסנכרן...' : '🔄 עדכן תוצאות אוטומטית'}
        </button>
        {syncMsg && <p className="text-center text-sm text-blue-300 mb-3">{syncMsg}</p>}

        {/* Stage tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: 'none' }}>
          {stages.map(s => (
            <button key={s} onClick={() => setActiveStage(s)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition"
              style={{
                background: activeStage === s ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                border: activeStage === s ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.08)',
                color: activeStage === s ? '#fff' : '#6b7280'
              }}>
              {s}
            </button>
          ))}
        </div>

        {stageMatches.length === 0 && (
          <p className="text-center text-gray-600 py-8">עדיין לא התחיל אף משחק בשלב זה</p>
        )}

        <div className="space-y-2">
          {stageMatches.map(match => {
            const names = teamNames[match.id]
            const homeName = names?.home || match.home
            const awayName = names?.away || match.away
            const isKnockout = match.stage && match.stage !== 'בתים'

            return (
              <div key={match.id} className="rounded-2xl p-4 shadow"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {/* Team names - editable in knockout */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  {match.home && !match.home.startsWith('ש') && !match.home.startsWith('ר') && !match.home.startsWith('ח') && !match.home.startsWith('ק') && !match.home.startsWith('מ') && !match.home.startsWith('1') && !match.home.startsWith('3') ? (
                    <>
                      <FlagImg country={match.home} size={20} className="rounded" />
                      <span className="text-sm font-bold text-white">{match.home}</span>
                      <span className="text-gray-600 text-xs">vs</span>
                      <FlagImg country={match.away} size={20} className="rounded" />
                      <span className="text-sm font-bold text-white">{match.away}</span>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 w-full">
                      {/* Home team */}
                      {editingTeam?.matchId === match.id && editingTeam?.side === 'home' ? (
                        <input autoFocus value={teamInput} onChange={e => setTeamInput(e.target.value)}
                          onBlur={() => saveTeamName(match.id, 'home', teamInput)}
                          onKeyDown={e => e.key === 'Enter' && saveTeamName(match.id, 'home', teamInput)}
                          className="flex-1 text-xs text-white bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-center focus:outline-none" />
                      ) : (
                        <button onClick={() => { setEditingTeam({ matchId: match.id, side: 'home' }); setTeamInput(homeName) }}
                          className="flex-1 text-xs rounded-lg px-2 py-1.5 text-center border transition"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.2)', color: homeName !== match.home ? '#fff' : '#6b7280' }}>
                          {homeName} ✏️
                        </button>
                      )}
                      <span className="text-gray-600 text-xs font-bold">vs</span>
                      {/* Away team */}
                      {editingTeam?.matchId === match.id && editingTeam?.side === 'away' ? (
                        <input autoFocus value={teamInput} onChange={e => setTeamInput(e.target.value)}
                          onBlur={() => saveTeamName(match.id, 'away', teamInput)}
                          onKeyDown={e => e.key === 'Enter' && saveTeamName(match.id, 'away', teamInput)}
                          className="flex-1 text-xs text-white bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-center focus:outline-none" />
                      ) : (
                        <button onClick={() => { setEditingTeam({ matchId: match.id, side: 'away' }); setTeamInput(awayName) }}
                          className="flex-1 text-xs rounded-lg px-2 py-1.5 text-center border transition"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.2)', color: awayName !== match.away ? '#fff' : '#6b7280' }}>
                          {awayName} ✏️
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Result buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'home', label: `1 - ${homeName}` },
                    { key: 'draw', label: 'תיקו X' },
                    { key: 'away', label: `2 - ${awayName}` },
                  ].map(opt => (
                    <button key={opt.key} onClick={() => setResult(match.id, opt.key)} disabled={saving === match.id}
                      className="py-2 rounded-xl text-xs font-bold transition active:scale-95"
                      style={{
                        background: results[match.id] === opt.key ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.05)',
                        border: results[match.id] === opt.key ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                        color: results[match.id] === opt.key ? '#34d399' : '#9ca3af'
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
