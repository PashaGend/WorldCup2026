import { useState, useEffect } from 'react'

export function useUser() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mundial_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (userData) => {
    localStorage.setItem('mundial_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('mundial_user')
    setUser(null)
  }

  return { user, login, logout }
}
