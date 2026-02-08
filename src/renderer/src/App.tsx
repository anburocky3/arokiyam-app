import { useEffect, useState } from 'react'
import { formatBytes, formatDateTime, formatUptime, getGreeting } from './helpers/system'
import { getInitialTheme, getNextTheme } from './helpers/theme'
import { StressSection } from './components/StressSection'
import { useStressMonitor } from './hooks/useStressMonitor'

type SystemInfo = {
  hostname: string
  platform: string
  release: string
  arch: string
  totalMem: number
  freeMem: number
  uptime: number
}

type BlinkConfig = {
  enabled: boolean
  minMinutes: number
  maxMinutes: number
  durationSeconds: number
  snoozeMinutes: number
}

const defaultBlinkConfig: BlinkConfig = {
  enabled: true,
  minMinutes: 8,
  maxMinutes: 18,
  durationSeconds: 6,
  snoozeMinutes: 3
}

const getStoredBlinkConfig = (): BlinkConfig => {
  const stored = window.localStorage.getItem('arokiyam-blink-config')
  if (!stored) return defaultBlinkConfig
  try {
    const parsed = JSON.parse(stored) as BlinkConfig
    return { ...defaultBlinkConfig, ...parsed }
  } catch {
    return defaultBlinkConfig
  }
}

function App(): React.JSX.Element {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [uptimeSeconds, setUptimeSeconds] = useState<number | null>(null)
  const [currentTime, setCurrentTime] = useState(() => new Date())
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'preferences' | 'support'>('dashboard')
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme)
  const [blinkConfig, setBlinkConfig] = useState<BlinkConfig>(getStoredBlinkConfig)
  const shouldTrackUptime = uptimeSeconds !== null
  const stressSnapshot = useStressMonitor()

  useEffect(() => {
    let isMounted = true
    window.api
      .getSystemInfo()
      .then((info) => {
        if (!isMounted) return
        setSystemInfo(info)
        setUptimeSeconds(Math.floor(info.uptime))
      })
      .catch(() => {
        if (!isMounted) return
        setSystemInfo(null)
      })
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!shouldTrackUptime) return undefined
    const id = setInterval(() => {
      setUptimeSeconds((prev) => (prev ?? 0) + 1)
    }, 1_000)
    return () => clearInterval(id)
  }, [shouldTrackUptime])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem('arokiyam-theme', theme)
  }, [theme])

  useEffect(() => {
    window.localStorage.setItem('arokiyam-blink-config', JSON.stringify(blinkConfig))
    void window.api.setBlinkConfig(blinkConfig)
  }, [blinkConfig])

  const greeting = getGreeting(currentTime)

  const uptimeLabel = uptimeSeconds === null ? '--' : formatUptime(uptimeSeconds)
  const bootedAt = uptimeSeconds === null ? null : new Date(Date.now() - uptimeSeconds * 1000)

  const handleStartBreak = (): void => {
    void window.api.requestBreak()
  }

  const updateBlinkConfig = (patch: Partial<BlinkConfig>): void => {
    setBlinkConfig((prev) => {
      const next = { ...prev, ...patch }
      if (next.minMinutes > next.maxMinutes) next.maxMinutes = next.minMinutes
      return next
    })
  }

  const panelClass =
    'rounded-3xl border border-slate-200/70 bg-white/70 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-slate-700/60 dark:bg-slate-900/70'
  const cardClass =
    'rounded-2xl border border-slate-200/70 bg-white/70 dark:border-slate-700/60 dark:bg-slate-900/70'

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top,#f8efe4_0%,#f3f6ff_45%,#eef7f1_100%)] px-6 py-8 font-['Space_Grotesk'] text-slate-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top,#1218260%,#0f172a55%,#0b1120_100%)] dark:text-slate-100 lg:px-12">
      <button
        className="absolute right-6 top-6 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-700 shadow-sm transition hover:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-500/60 z-99"
        onClick={() => setTheme(getNextTheme(theme))}
        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        type="button"
      >
        {theme === 'light' ? (
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
          </svg>
        ) : (
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M5 5l1.5 1.5M17.5 17.5 19 19M2 12h2M20 12h2M5 19l1.5-1.5M17.5 6.5 19 5" />
          </svg>
        )}
      </button>
      <header
        className={`mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-7 lg:flex-row lg:items-center lg:justify-between ${panelClass}`}
      >
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Arokiyam
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-slate-900 dark:text-slate-100 md:text-4xl font-['Fraunces']">
            {greeting}, welcome back.
          </h1>
          <p className="max-w-xl text-sm text-slate-600 dark:text-slate-300">
            This dashboard keeps the essentials visible, so you can feel confident about your
            computer today.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeMenu === 'dashboard'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'border border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-500/60'
            }`}
            onClick={() => setActiveMenu('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeMenu === 'preferences'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'border border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-500/60'
            }`}
            onClick={() => setActiveMenu('preferences')}
          >
            Preferences
          </button>
          <button
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeMenu === 'support'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'border border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-500/60'
            }`}
            onClick={() => setActiveMenu('support')}
          >
            Support
          </button>
        </div>
      </header>

      {activeMenu === 'dashboard' && (
        <main className="mx-auto mt-8 grid w-full max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className={`${cardClass} p-5`}>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                  Local time
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  {currentTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {currentTime.toLocaleDateString([], {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className={`${cardClass} p-5`}>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                  Computer on
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  {uptimeLabel}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Since {bootedAt ? formatDateTime(bootedAt) : 'loading...'}
                </p>
              </div>
            </div>

            <div className={`${panelClass} p-6`}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Health battery
                </h2>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                  {stressSnapshot?.isBreakActive ? 'Break active' : 'Monitoring'}
                </span>
              </div>
              <div className="mt-6">
                <StressSection snapshot={stressSnapshot} onStartBreak={handleStartBreak} />
              </div>
            </div>
          </section>
        </main>
      )}

      {activeMenu === 'preferences' && (
        <section className={`mx-auto mt-8 w-full max-w-6xl p-6 ${panelClass}`}>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Preferences</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Adjust the experience to match how you like to work.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className={`${cardClass} p-5`}>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Notifications
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Helpful reminders for updates
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  Enabled
                </span>
              </div>
            </div>
            <div className={`${cardClass} p-5`}>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Auto start</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Open Arokiyam at startup
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                  On
                </span>
              </div>
            </div>
            <div className={`${cardClass} p-5`}>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Quiet hours
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Silence reminders overnight
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                  10:00 PM - 7:00 AM
                </span>
              </div>
            </div>
            <div className={`${cardClass} p-5 md:col-span-2`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Blink overlay
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    A gentle black screen reminder with skip or snooze.
                  </p>
                </div>
                <button
                  className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-500/60"
                  onClick={() => updateBlinkConfig({ enabled: !blinkConfig.enabled })}
                  type="button"
                >
                  {blinkConfig.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-4">
                <label className="flex flex-col gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Min minutes
                  <input
                    className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100"
                    type="number"
                    min={2}
                    max={120}
                    value={blinkConfig.minMinutes}
                    onChange={(event) =>
                      updateBlinkConfig({ minMinutes: Number(event.target.value) })
                    }
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Max minutes
                  <input
                    className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100"
                    type="number"
                    min={2}
                    max={120}
                    value={blinkConfig.maxMinutes}
                    onChange={(event) =>
                      updateBlinkConfig({ maxMinutes: Number(event.target.value) })
                    }
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Duration (sec)
                  <input
                    className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100"
                    type="number"
                    min={3}
                    max={20}
                    value={blinkConfig.durationSeconds}
                    onChange={(event) =>
                      updateBlinkConfig({ durationSeconds: Number(event.target.value) })
                    }
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Snooze (min)
                  <input
                    className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100"
                    type="number"
                    min={1}
                    max={20}
                    value={blinkConfig.snoozeMinutes}
                    onChange={(event) =>
                      updateBlinkConfig({ snoozeMinutes: Number(event.target.value) })
                    }
                  />
                </label>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeMenu === 'support' && (
        <section className={`mx-auto mt-8 w-full max-w-6xl p-6 ${panelClass}`}>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Support</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Need help? We have quick guides and a friendly checklist for you.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className={`${cardClass} p-5`}>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                How to speed up my PC
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Simple steps in 5 minutes
              </p>
            </div>
            <div className={`${cardClass} p-5`}>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Backing up your files
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Keep memories safe</p>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default App
