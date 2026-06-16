export default function Navbar({ tab, setTab }) {
  const tabs = [
    { key: 'matches', icon: '⚽', label: 'משחקים' },
    { key: 'leaderboard', icon: '🏆', label: 'טבלה' },
    { key: 'stats', icon: '📊', label: 'סטטיסטיקה' },
    { key: 'admin', icon: '⚙️', label: 'מנהל' },
  ]

  return (
    <div className="sticky bottom-0 z-50"
      style={{ background: 'rgba(6,30,16,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-all relative ${
              tab === t.key ? 'text-emerald-400' : 'text-gray-600 hover:text-gray-400'
            }`}>
            {tab === t.key && (
              <span className="absolute top-0 inset-x-3 h-0.5 rounded-full bg-emerald-400" />
            )}
            <span className={`text-xl transition-transform duration-150 ${tab === t.key ? 'scale-110' : 'scale-100'}`}>{t.icon}</span>
            <span className={`text-xs tracking-tight ${tab === t.key ? 'font-bold text-emerald-300' : 'font-medium'}`}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
