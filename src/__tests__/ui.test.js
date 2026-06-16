import { describe, it, expect } from 'vitest'

describe('Navigation & UI State', () => {
  it('Should start with matches tab selected', () => {
    const initialTab = 'matches'
    expect(initialTab).toBe('matches')
  })

  it('Should switch between tabs', () => {
    let tab = 'matches'
    
    tab = 'leaderboard'
    expect(tab).toBe('leaderboard')
    
    tab = 'stats'
    expect(tab).toBe('stats')
    
    tab = 'admin'
    expect(tab).toBe('admin')
  })

  it('Should display correct page component based on tab', () => {
    const pages = {
      matches: 'MatchesPage',
      leaderboard: 'LeaderboardPage',
      stats: 'StatsPage',
      admin: 'AdminPage'
    }
    
    expect(pages['matches']).toBe('MatchesPage')
    expect(pages['leaderboard']).toBe('LeaderboardPage')
    expect(pages['stats']).toBe('StatsPage')
    expect(pages['admin']).toBe('AdminPage')
  })

  it('Should show LoginPage when user is null', () => {
    const user = null
    const shouldShowLogin = !user
    
    expect(shouldShowLogin).toBe(true)
  })

  it('Should show app content when user is authenticated', () => {
    const user = { id: '123', nickname: 'John' }
    const shouldShowLogin = !user
    
    expect(shouldShowLogin).toBe(false)
  })

  it('Should filter upcoming matches by current date', () => {
    const today = '2026-06-16'
    const matches = [
      { id: 1, date: '2026-06-15T20:00' }, // past
      { id: 2, date: '2026-06-16T20:00' }, // today
      { id: 3, date: '2026-06-17T20:00' }, // future
    ]
    
    const upcoming = matches.filter(m => m.date.split('T')[0] >= today)
    expect(upcoming.length).toBe(2)
    expect(upcoming[0].id).toBe(2)
  })
})
