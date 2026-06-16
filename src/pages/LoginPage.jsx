import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LoginPage({ onLogin }) {
  const [phone, setPhone] = useState('')
  const [nickname, setNickname] = useState('')
  const [step, setStep] = useState('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handlePhone(e) {
    e.preventDefault()
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length < 9) { setError('מספר טלפון לא תקין'); return }
    setLoading(true); setError('')
    try {
      const { data, error } = await supabase.from('users').select('*').eq('phone', cleaned).single()
      if (error && error.code !== 'PGRST116') throw error
      if (data) { onLogin(data) } else { setStep('nickname') }
    } catch { setError('שגיאה, נסה שוב') }
    finally { setLoading(false) }
  }

  async function handleRegister(e) {
    e.preventDefault()
    if (!nickname.trim()) { setError('נא להכניס ניקנים'); return }
    const cleaned = phone.replace(/\D/g, '')
    setLoading(true); setError('')
    try {
      const { data, error } = await supabase.from('users').insert({ phone: cleaned, nickname: nickname.trim() }).select().single()
      if (error) throw error
      onLogin(data)
    } catch (err) {
      setError(err.code === '23505' ? 'הניקנים תפוס, בחר אחר' : 'שגיאה, נסה שוב')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #16213e 0%, #1a1a2e 40%, #1a1a2e 100%)' }}>
      {/* Field lines bg */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px)' }} />

      {/* Logo */}
      <div className="text-center mb-10 relative z-10">
        <div className="text-8xl mb-5 filter drop-shadow-2xl">⚽</div>
        <h1 className="text-white text-4xl font-black tracking-tight mb-1">מונדיאל 2026</h1>
        <p className="text-emerald-400 text-sm font-medium">מי מנחש נכון יותר?</p>
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="rounded-3xl p-6 relative overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>

          {step === 'phone' ? (
            <form onSubmit={handlePhone} dir="rtl">
              <label className="block text-emerald-300 text-sm font-medium mb-3">מספר טלפון</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="0501234567"
                className="w-full rounded-2xl px-4 py-4 text-center text-xl font-bold mb-2 focus:outline-none transition-all"
                style={{ background: '#fff', border: '2px solid #d1fae5', color: '#111', caretColor: '#059669' }}
                dir="ltr" />
              <p className="text-gray-600 text-xs text-center mb-5">משתמש קיים? תכנס אוטומטית</p>
              {error && <p className="text-red-400 text-sm text-center mb-3">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-2xl font-black text-white text-base transition-all active:scale-95 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 8px 24px rgba(5,150,105,0.4)' }}>
                {loading ? 'בודק...' : 'כניסה →'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} dir="rtl">
              <div className="text-center mb-5">
                <span className="text-3xl">🎉</span>
                <p className="text-white font-bold mt-2">ברוך הבא!</p>
                <p className="text-gray-400 text-sm">בחר שם שיופיע בטבלה</p>
              </div>
              <input type="text" value={nickname} onChange={e => setNickname(e.target.value)}
                placeholder="שם..."
                className="w-full rounded-2xl px-4 py-4 text-center text-xl font-bold mb-4 focus:outline-none transition-all"
                style={{ background: '#fff', border: '2px solid #fde68a', color: '#111', caretColor: '#f59e0b' }} />
              {error && <p className="text-red-400 text-sm text-center mb-3">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-2xl font-black text-gray-900 text-base transition-all active:scale-95 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', boxShadow: '0 8px 24px rgba(251,191,36,0.35)' }}>
                {loading ? 'נרשם...' : '🏆 הצטרף למשחק'}
              </button>
              <button type="button" onClick={() => { setStep('phone'); setError('') }}
                className="w-full mt-3 text-gray-600 text-xs underline">חזרה</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
