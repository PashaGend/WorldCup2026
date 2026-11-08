import { describe, it, expect } from 'vitest'
import { getExactScoreBonus } from '../lib/matches'

describe('Leaderboard scoring — DB scores (no API)', () => {

  function calcPoints(predictions, results, scorePreds) {
    const rmap = {}
    const scoreMap = {}
    const stageMap = {}
    results.forEach(r => {
      rmap[r.match_id] = r.result
      stageMap[r.match_id] = r.stage
      if (r.home_score != null) scoreMap[r.match_id] = { home: r.home_score, away: r.away_score }
    })
    const spmap = {}
    scorePreds.forEach(sp => {
      if (!spmap[sp.user_id]) spmap[sp.user_id] = {}
      spmap[sp.user_id][sp.match_id] = { home: sp.home_score, away: sp.away_score }
    })
    const umap = {}
    predictions.forEach(p => {
      if (!umap[p.user_id]) umap[p.user_id] = { points: 0, total: 0 }
      const result = rmap[p.match_id]
      if (!result) return
      umap[p.user_id].total++
      if (p.prediction !== result) return
      let pts = 1
      const sc = scoreMap[p.match_id]
      const sp = spmap[p.user_id]?.[p.match_id]
      if (sc && sp && sp.home === sc.home && sp.away === sc.away) pts += getExactScoreBonus(stageMap[p.match_id])
      umap[p.user_id].points += pts
    })
    return umap
  }

  const results = [
    { match_id: 1, result: 'home', home_score: 2, away_score: 0 },
    { match_id: 2, result: 'draw', home_score: 1, away_score: 1 },
    { match_id: 3, result: 'away', home_score: 0, away_score: 2 },
  ]

  it('correct outcome gives 1 point', () => {
    const preds = [{ user_id: 'u1', match_id: 1, prediction: 'home' }]
    const scores = calcPoints(preds, results, [])
    expect(scores['u1'].points).toBe(1)
    expect(scores['u1'].total).toBe(1)
  })

  it('wrong outcome gives 0 points', () => {
    const preds = [{ user_id: 'u1', match_id: 1, prediction: 'away' }]
    const scores = calcPoints(preds, results, [])
    expect(scores['u1'].points).toBe(0)
    expect(scores['u1'].total).toBe(1)
  })

  it('exact score bonus gives +3 (total 4)', () => {
    const preds = [{ user_id: 'u1', match_id: 1, prediction: 'home' }]
    const sp = [{ user_id: 'u1', match_id: 1, home_score: 2, away_score: 0 }]
    const scores = calcPoints(preds, results, sp)
    expect(scores['u1'].points).toBe(4)
  })

  it('wrong score prediction gives only 1 point (no bonus)', () => {
    const preds = [{ user_id: 'u1', match_id: 1, prediction: 'home' }]
    const sp = [{ user_id: 'u1', match_id: 1, home_score: 3, away_score: 0 }]
    const scores = calcPoints(preds, results, sp)
    expect(scores['u1'].points).toBe(1)
  })

  it('no score prediction gives only 1 point', () => {
    const preds = [{ user_id: 'u1', match_id: 1, prediction: 'home' }]
    const scores = calcPoints(preds, results, [])
    expect(scores['u1'].points).toBe(1)
  })

  it('match without result in DB gives 0 points (no API fallback)', () => {
    const preds = [{ user_id: 'u1', match_id: 99, prediction: 'home' }]
    const scores = calcPoints(preds, results, [])
    expect(scores['u1'].points).toBe(0)
    expect(scores['u1'].total).toBe(0)
  })

  it('multiple matches accumulate correctly', () => {
    const preds = [
      { user_id: 'u1', match_id: 1, prediction: 'home' },
      { user_id: 'u1', match_id: 2, prediction: 'draw' },
      { user_id: 'u1', match_id: 3, prediction: 'home' },
    ]
    const sp = [{ user_id: 'u1', match_id: 2, home_score: 1, away_score: 1 }]
    const scores = calcPoints(preds, results, sp)
    expect(scores['u1'].points).toBe(1 + 4 + 0)
    expect(scores['u1'].total).toBe(3)
  })

  it('admin sync saves score — result with null score gives no bonus', () => {
    const resultsNoScore = [{ match_id: 1, result: 'home', home_score: null, away_score: null }]
    const preds = [{ user_id: 'u1', match_id: 1, prediction: 'home' }]
    const sp = [{ user_id: 'u1', match_id: 1, home_score: 2, away_score: 0 }]
    const scores = calcPoints(preds, resultsNoScore, sp)
    expect(scores['u1'].points).toBe(1)
  })

  it('round-of-16 exact score bonus gives +5 (total 6)', () => {
    const r16Results = [{ match_id: 89, result: 'home', home_score: 2, away_score: 0, stage: 'שמינית גמר' }]
    const preds = [{ user_id: 'u1', match_id: 89, prediction: 'home' }]
    const sp = [{ user_id: 'u1', match_id: 89, home_score: 2, away_score: 0 }]
    const scores = calcPoints(preds, r16Results, sp)
    expect(scores['u1'].points).toBe(6)
  })

  it('quarterfinal exact score bonus gives +10 (total 11)', () => {
    const qfResults = [{ match_id: 97, result: 'home', home_score: 2, away_score: 0, stage: 'רבע גמר' }]
    const preds = [{ user_id: 'u1', match_id: 97, prediction: 'home' }]
    const sp = [{ user_id: 'u1', match_id: 97, home_score: 2, away_score: 0 }]
    const scores = calcPoints(preds, qfResults, sp)
    expect(scores['u1'].points).toBe(11)
  })

  it('third place exact score bonus gives +12 (total 13)', () => {
    const tpResults = [{ match_id: 103, result: 'away', home_score: 0, away_score: 1, stage: 'מקום 3' }]
    const preds = [{ user_id: 'u1', match_id: 103, prediction: 'away' }]
    const sp = [{ user_id: 'u1', match_id: 103, home_score: 0, away_score: 1 }]
    const scores = calcPoints(preds, tpResults, sp)
    expect(scores['u1'].points).toBe(13)
  })

  it('semifinal exact score bonus gives +15 (total 16)', () => {
    const sfResults = [{ match_id: 101, result: 'draw', home_score: 1, away_score: 1, stage: 'חצי גמר' }]
    const preds = [{ user_id: 'u1', match_id: 101, prediction: 'draw' }]
    const sp = [{ user_id: 'u1', match_id: 101, home_score: 1, away_score: 1 }]
    const scores = calcPoints(preds, sfResults, sp)
    expect(scores['u1'].points).toBe(16)
  })

  it('final exact score bonus gives +20 (total 21)', () => {
    const finalResults = [{ match_id: 104, result: 'home', home_score: 3, away_score: 1, stage: 'גמר' }]
    const preds = [{ user_id: 'u1', match_id: 104, prediction: 'home' }]
    const sp = [{ user_id: 'u1', match_id: 104, home_score: 3, away_score: 1 }]
    const scores = calcPoints(preds, finalResults, sp)
    expect(scores['u1'].points).toBe(21)
  })
})
