export const getInitialTheme = (): 'light' | 'dark' => {
  const stored = window.localStorage.getItem('arokiyam-theme')
  if (stored === 'light' || stored === 'dark') return stored
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export const getNextTheme = (current: 'light' | 'dark'): 'light' | 'dark' =>
  current === 'light' ? 'dark' : 'light'
