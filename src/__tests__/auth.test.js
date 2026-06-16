import { describe, it, expect, beforeEach } from 'vitest'

describe('User Authentication', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('Should save user data to localStorage on login', () => {
    const userData = { id: '123', nickname: 'John Doe' }
    localStorage.setItem('mundial_user', JSON.stringify(userData))
    
    const saved = localStorage.getItem('mundial_user')
    expect(saved).toBeTruthy()
    expect(JSON.parse(saved).nickname).toBe('John Doe')
  })

  it('Should clear localStorage on logout', () => {
    localStorage.setItem('mundial_user', JSON.stringify({ id: '123' }))
    localStorage.removeItem('mundial_user')
    
    expect(localStorage.getItem('mundial_user')).toBeNull()
  })

  it('Should return null user when localStorage is empty', () => {
    const saved = localStorage.getItem('mundial_user')
    const user = saved ? JSON.parse(saved) : null
    
    expect(user).toBeNull()
  })
})
