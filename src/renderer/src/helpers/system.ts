export const formatBytes = (bytes: number): string => {
  const gb = bytes / 1024 ** 3
  return `${gb.toFixed(1)} GB`
}

export const formatUptime = (seconds: number): string => {
  const totalSeconds = Math.max(0, Math.floor(seconds))
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60
  const pad = (value: number): string => value.toString().padStart(2, '0')
  const dayPrefix = days > 0 ? `${days}d ` : ''
  return `${dayPrefix}${pad(hours)}:${pad(minutes)}:${pad(secs)}`
}

export const resolvePlatform = (platform: string): string => {
  if (platform === 'win32') return 'Windows'
  if (platform === 'darwin') return 'macOS'
  if (platform === 'linux') return 'Linux'
  return platform
}

export const getGreeting = (date: Date): string => {
  const hour = date.getHours()
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 17) return 'Good afternoon'
  if (hour >= 17 && hour < 22) return 'Good evening'
  return 'Good night'
}

export const formatDateTime = (date: Date): string => {
  const datePart = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)

  const timePart = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
    .format(date)
    .replace(' ', '')
    .toLowerCase()

  return `${datePart} at ${timePart}`
}
