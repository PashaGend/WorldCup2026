import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { MATCHES, TEAM_EN_TO_HE } from '../lib/matches'
import { FlagImg } from '../components/FlagImg'

function isBeforeMatch(d) { return new Date() < new Date(d) }

function groupByDate(matches) {
  const g = {}
  for (const m of matches) {
    const day = m.date.split('T')[0]
    if (!g[day]) g[day] = []
    g[day].push(m)
  }
  return g
}

function formatDate(d) {
  return new Date(d + 'T00:00').toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })
}

function formatTime(d) {
  return new Date(d).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
}

function ScoreInput({ value, onChange }) {
  return (
    <input
      type="number" min={0} max={20} value={value}
      onChange={e => onChange(Math.max(0, Math.min(20, parseInt(e.target.value) || 0)))}
      className="w-10 h-10 text-center font-black text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
      style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)', color: '#fff' }}
    />
  )
}

function MatchCard({ match, savedPick, savedScore, result, score, onSave }) {
  const canPredict = isBeforeMatch(match.date) && !result
  const [localPick, setLocalPick] = useState(savedPick || null)
  const [localHome, setLocalHome] = useState(savedScore?.home ?? '')
  const [localAway, setLocalAway] = useState(savedScore?.away ?? '')
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    setLocalPick(savedPick || null)
    setLocalHome(savedScore?.home ?? '')
    setLocalAway(savedScore?.away ?? '')
  }, [savedPick, savedScore])

  const hasScore = localHome !== '' && localAway !== ''
  const outcomeChanged = localPick !== (savedPick || null)
  const scoreChanged = hasScore && (localHome !== (savedScore?.home ?? '') || localAway !== (savedScore?.away ?? ''))
  const isDirty = outcomeChanged || scoreChanged

  const isCorrect = result && savedPick === result
  const isWrong = result && savedPick && savedPick !== result
  const missed = result && !savedPick
  const isCorrectScore = result && score && savedScore
    && savedScore.home === score.home && savedScore.away === score.away

  async function handleSave() {
    if (!localPick || saving) return
    setSaving(true)
    try {
      await onSave(match.id, localPick, hasScore ? localHome : null, hasScore ? localAway : null)
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 2000)
    } catch (e) {
      alert('שגיאה בשמירה: ' + e.message)
    } finally { setSaving(false) }
  }

  const accentBorder = isCorrect ? '#fbbf24' : isWrong ? '#f87171' : isDirty ? '#34d399' : 'transparent'

  return (
    <div className="mx-3 my-2 rounded-2xl overflow-hidden shadow-lg slide-up"
      style={{ background: 'linear-gradient(160deg, #1a2e1f 0%, #111c14 100%)', border: `2px solid ${accentBorder !== 'transparent' ? accentBorder : 'rgba(255,255,255,0.22)'}` }}>

      {/* Top strip */}
      <div className="flex items-center justify-between px-4 py-2"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span className="text-xs text-emerald-600 font-medium">{match.stage ? match.stage : `בית ${match.group}`} · {formatTime(match.date)}</span>
        <div className="flex items-center gap-1.5">
          {isCorrect && !isCorrectScore && <span className="text-xs bg-yellow-400 text-yellow-900 font-black px-2.5 py-0.5 rounded-full">✓ 1 נק'</span>}
          {isCorrectScore && <span className="text-xs bg-emerald-400 text-emerald-900 font-black px-2.5 py-0.5 rounded-full">🎯 4 נק'!</span>}
          {isWrong && <span className="text-xs bg-red-900/60 text-red-300 font-semibold px-2.5 py-0.5 rounded-full border border-red-800/50">✗ טעות</span>}
          {missed && <span className="text-xs bg-gray-800 text-gray-500 px-2.5 py-0.5 rounded-full">לא ניחשת</span>}
          {!result && savedPick && !isDirty && <span className="text-xs text-emerald-500 font-medium">✓ שמור</span>}
          {isDirty && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
        </div>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex flex-col items-center gap-2 flex-1">
          <FlagImg country={match.home} size={56} className="rounded-xl shadow-lg" />
          <span className="text-sm font-bold text-white text-center leading-tight">{match.home}</span>
        </div>

        <div className="flex flex-col items-center px-4">
          {(() => {
            const apiOutcome = score ? (score.home > score.away ? 'home' : score.home < score.away ? 'away' : 'draw') : null
            const scoreValid = score && (!result || apiOutcome === result)
            return scoreValid ? (
              <span className="text-2xl font-black text-white">{score.away}:{score.home}</span>
            ) : (
              <span className="text-2xl font-black text-gray-700">{result ? '' : 'VS'}</span>
            )
          })()}
          {result && (
            <span className="mt-1 text-xs font-black text-gray-400 bg-gray-800 px-2 py-0.5 rounded-lg">
              {result === 'home' ? '1' : result === 'draw' ? 'X' : '2'}
            </span>
          )}
          {result && savedScore && (
            <span className={`mt-1 text-xs font-bold px-2 py-0.5 rounded-lg ${isCorrectScore ? 'text-emerald-300 bg-emerald-900/40' : 'text-gray-500 bg-gray-800'}`}>
              ניחשת: {savedScore.away}:{savedScore.home}
            </span>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 flex-1">
          <FlagImg country={match.away} size={56} className="rounded-xl shadow-lg" />
          <span className="text-sm font-bold text-white text-center leading-tight">{match.away}</span>
        </div>
      </div>

      {/* Pick buttons */}
      <div className="grid grid-cols-3 gap-2 px-4 pb-3">
        {[
          { key: 'home', short: '1', country: match.home },
          { key: 'draw', short: 'X', country: null },
          { key: 'away', short: '2', country: match.away },
        ].map(opt => {
          const isLocal = localPick === opt.key
          const isSaved = savedPick === opt.key
          const isRes = result === opt.key

          let bg, border, text
          if (isLocal && isRes) { bg = '#fbbf24'; border = '#fbbf24'; text = '#1a1a00' }
          else if (isLocal && !isSaved) { bg = '#ffffff'; border = '#86efac'; text = '#064e3b' }
          else if (isLocal) { bg = '#ffffff'; border = '#ffffff'; text = '#064e3b' }
          else if (isRes) { bg = 'rgba(248,113,113,0.1)'; border = 'rgba(248,113,113,0.4)'; text = '#f87171' }
          else if (canPredict) { bg = 'rgba(255,255,255,0.04)'; border = 'rgba(255,255,255,0.08)'; text = '#9ca3af' }
          else { bg = 'rgba(255,255,255,0.02)'; border = 'rgba(255,255,255,0.04)'; text = '#4b5563' }

          return (
            <button key={opt.key}
              onClick={() => canPredict && setLocalPick(opt.key)}
              disabled={!canPredict}
              className={`py-3 rounded-xl flex flex-col items-center gap-1 transition-all duration-150 ${isLocal ? 'btn-pop' : ''} ${canPredict && !isLocal ? 'active:scale-95' : ''} ${!canPredict ? 'cursor-not-allowed' : ''}`}
              style={{ background: bg, border: `1.5px solid ${border}`, color: text }}>
              <div className="flex items-center gap-1">
                {opt.country && <FlagImg country={opt.country} size={14} className="rounded" />}
                <span className="font-black text-sm">{opt.short}</span>
              </div>
              <span style={{ fontSize: '9px', opacity: 0.7 }} className="text-center truncate w-full px-1">
                {opt.key === 'draw' ? 'תיקו' : opt.country}
              </span>
            </button>
          )
        })}
      </div>

      {/* Exact score inputs */}
      {canPredict && (
        <div className="px-4 pb-3">
          <div className="rounded-2xl px-4 py-3" dir="rtl"
            style={{ background: 'rgba(251,191,36,0.07)', border: '1.5px dashed rgba(251,191,36,0.35)' }}>
            <p className="text-center text-xs font-bold mb-2.5" style={{ color: '#fbbf24' }}>
              🎯 תוצאה מדויקת — בונוס +3 נק' <span className="font-normal opacity-70">(אופציונלי)</span>
            </p>
            <div className="flex items-center justify-center gap-3" dir="rtl">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400 font-medium">{match.home}</span>
                <ScoreInput value={localHome} onChange={setLocalHome} />
              </div>
              <span className="font-black text-xl mt-4" style={{ color: '#fbbf24' }}>:</span>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400 font-medium">{match.away}</span>
                <ScoreInput value={localAway} onChange={setLocalAway} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save button */}
      {canPredict && isDirty && localPick && (
        <div className="px-4 pb-4">
          <button onClick={handleSave} disabled={saving}
            className="w-full py-2.5 rounded-xl font-black text-sm transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff', boxShadow: '0 4px 15px rgba(5,150,105,0.4)' }}>
            {saving ? '⏳ שומר...' : '💾 שמור ניחוש'}
          </button>
        </div>
      )}
      {justSaved && !isDirty && (
        <p className="text-center text-emerald-400 text-xs font-bold pb-3">✅ נשמר!</p>
      )}
      {!canPredict && !result && (
        <p className="text-center text-gray-700 text-xs pb-3">🔒 המשחק התחיל</p>
      )}
    </div>
  )
}

export default function MatchesPage({ user }) {
  const [predictions, setPredictions] = useState({})
  const [scorePreds, setScorePreds] = useState({}) // matchId -> { home, away }
  const [results, setResults] = useState({})
  const [scores, setScores] = useState({}) // live API scores

  useEffect(() => { loadData() }, [user.id])
  useEffect(() => { loadLiveScores() }, [])

  async function loadLiveScores() {
    try {
      const res = await fetch('https://worldcup26.ir/get/games')
      if (!res.ok) return
      const data = await res.json()
      const map = {}
      for (const g of data.games || []) {
        if (g.finished !== 'TRUE') continue
        const homeHe = TEAM_EN_TO_HE[g.home_team_name_en]
        const awayHe = TEAM_EN_TO_HE[g.away_team_name_en]
        if (!homeHe || !awayHe) continue
        let match = MATCHES.find(m => m.home === homeHe && m.away === awayHe)
        if (match) {
          map[match.id] = { home: parseInt(g.home_score), away: parseInt(g.away_score) }
        } else {
          match = MATCHES.find(m => m.home === awayHe && m.away === homeHe)
          if (match) map[match.id] = { home: parseInt(g.away_score), away: parseInt(g.home_score) }
        }
      }
      setScores(map)
    } catch { /* silent */ }
  }

  async function loadData() {
    const [p, r, sp] = await Promise.all([
      supabase.from('predictions').select('*').eq('user_id', user.id),
      supabase.from('results').select('*'),
      supabase.from('score_predictions').select('*').eq('user_id', user.id),
    ])
    if (p.data) { const m = {}; p.data.forEach(x => { m[x.match_id] = x.prediction }); setPredictions(m) }
    if (r.data) { const m = {}; r.data.forEach(x => { m[x.match_id] = x.result }); setResults(m) }
    if (sp.data) { const m = {}; sp.data.forEach(x => { m[x.match_id] = { home: x.home_score, away: x.away_score } }); setScorePreds(m) }
  }

  async function handleSave(matchId, outcome, homeScore, awayScore) {
    // Save outcome to predictions
    let error
    if (predictions[matchId]) {
      const res = await supabase.from('predictions').update({ prediction: outcome }).eq('user_id', user.id).eq('match_id', matchId)
      error = res.error
    } else {
      const res = await supabase.from('predictions').insert({ user_id: user.id, match_id: matchId, prediction: outcome })
      error = res.error
    }
    if (error) throw new Error(error.message)

    // Save score prediction if provided
    if (homeScore !== null && awayScore !== null) {
      const res = scorePreds[matchId]
        ? await supabase.from('score_predictions').update({ home_score: homeScore, away_score: awayScore }).eq('user_id', user.id).eq('match_id', matchId)
        : await supabase.from('score_predictions').insert({ user_id: user.id, match_id: matchId, home_score: homeScore, away_score: awayScore })
      if (res.error) throw new Error(res.error.message)
      setScorePreds(prev => ({ ...prev, [matchId]: { home: homeScore, away: awayScore } }))
    }

    setPredictions(prev => ({ ...prev, [matchId]: outcome }))
  }

  const myPoints = Object.entries(predictions).reduce((acc, [id, outcome]) => {
    const matchId = parseInt(id)
    const sc = scores[matchId]
    const result = results[id] || (sc ? (sc.home > sc.away ? 'home' : sc.home < sc.away ? 'away' : 'draw') : null)
    if (!result || outcome !== result) return acc
    let pts = 1
    const sp = scorePreds[matchId]
    if (sc && sp && sp.home === sc.home && sp.away === sc.away) pts += 3
    return acc + pts
  }, 0)

  const today = new Date().toISOString().split('T')[0]
  const upcomingMatches = MATCHES.filter(m => m.date.split('T')[0] >= today)
  const grouped = groupByDate(upcomingMatches)

  return (
    <div className="pb-4 min-h-screen" dir="rtl" style={{ background: '#1a1a2e' }}>
      {/* Points hero */}
      <div className="mx-3 mt-3 mb-3 rounded-2xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%)', boxShadow: '0 8px 32px rgba(124,58,237,0.35)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)' }} />
        <div className="relative flex items-center justify-between px-6 py-5">
          <div>
            <p className="text-emerald-300 text-xs font-medium mb-1">הניקוד שלי</p>
            <p className="text-white text-5xl font-black leading-none">{myPoints}</p>
            <p className="text-emerald-400 text-sm font-medium mt-1">נקודות</p>
          </div>
          <div className="text-6xl filter drop-shadow-lg">🏆</div>
        </div>
      </div>

      {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([day, dayMatches]) => (
        <div key={day}>
          <div className="px-4 pt-3 pb-1.5">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">📅 {formatDate(day)}</span>
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>
          </div>
          {[...dayMatches].sort((a, b) => a.date.localeCompare(b.date)).map(m => (
            <MatchCard key={m.id} match={m} savedPick={predictions[m.id]} savedScore={scorePreds[m.id]}
              result={results[m.id] || (scores[m.id] ? (scores[m.id].home > scores[m.id].away ? 'home' : scores[m.id].home < scores[m.id].away ? 'away' : 'draw') : null)}
              score={scores[m.id]} onSave={handleSave} />
          ))}
        </div>
      ))}
    </div>
  )
}
