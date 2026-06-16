import { FLAG_CODE } from '../lib/matches'

export function FlagImg({ country, size = 32, className = '' }) {
  const code = FLAG_CODE[country]
  if (!code) return <span style={{ width: size, display: 'inline-block' }} />
  // flag-icons uses fi fi-{code} class, displays as inline-block with 4:3 ratio
  const height = Math.round(size * 0.75)
  return (
    <span
      className={`fi fi-${code} rounded shadow-sm ${className}`}
      style={{ width: size, height, fontSize: size, lineHeight: `${height}px`, display: 'inline-block', backgroundSize: 'cover' }}
      title={country}
    />
  )
}
