import { useEffect, useRef, useState } from 'react'
import { formatDateTime, formatUptime, getGreeting } from './helpers/system'
import { getInitialTheme, getNextTheme } from './helpers/theme'
import { StressSection } from './components/StressSection'
import { useStressMonitor } from './hooks/useStressMonitor'

type BlinkConfig = {
  enabled: boolean
  minMinutes: number
  maxMinutes: number
  durationSeconds: number
  snoozeMinutes: number
}

type HydrationConfig = {
  enabled: boolean
  intervalMinutes: number
  durationSeconds: number
  snoozeMinutes: number
}

type DrinkConfig = {
  enabled: boolean
  intervalMinutes: number
  durationSeconds: number
  snoozeMinutes: number
}

type HealthStrictness = 'basic' | 'medium' | 'strict'

const defaultBlinkConfig: BlinkConfig = {
  enabled: true,
  minMinutes: 8,
  maxMinutes: 18,
  durationSeconds: 6,
  snoozeMinutes: 3
}

const defaultHydrationConfig: HydrationConfig = {
  enabled: true,
  intervalMinutes: 45,
  durationSeconds: 25,
  snoozeMinutes: 10
}

const defaultDrinkConfig: DrinkConfig = {
  enabled: true,
  intervalMinutes: 120,
  durationSeconds: 30,
  snoozeMinutes: 20
}

const defaultHealthStrictness: HealthStrictness = 'basic'

const healthStrictnessLabels: Record<HealthStrictness, string> = {
  basic: 'Basic',
  medium: 'Medium',
  strict: 'Health conscious'
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

const getStoredHydrationConfig = (): HydrationConfig => {
  const stored = window.localStorage.getItem('arokiyam-hydration-config')
  if (!stored) return defaultHydrationConfig
  try {
    const parsed = JSON.parse(stored) as HydrationConfig
    return { ...defaultHydrationConfig, ...parsed }
  } catch {
    return defaultHydrationConfig
  }
}

const getStoredDrinkConfig = (): DrinkConfig => {
  const stored = window.localStorage.getItem('arokiyam-drink-config')
  if (!stored) return defaultDrinkConfig
  try {
    const parsed = JSON.parse(stored) as DrinkConfig
    return { ...defaultDrinkConfig, ...parsed }
  } catch {
    return defaultDrinkConfig
  }
}

const getStoredHealthStrictness = (): HealthStrictness => {
  const stored = window.localStorage.getItem('arokiyam-health-strictness')
  if (stored === 'basic' || stored === 'medium' || stored === 'strict') return stored
  return defaultHealthStrictness
}

function App(): React.JSX.Element {
  const [uptimeSeconds, setUptimeSeconds] = useState<number | null>(null)
  const [currentTime, setCurrentTime] = useState(() => new Date())
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'preferences' | 'support'>('dashboard')
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme)
  const [blinkConfig, setBlinkConfig] = useState<BlinkConfig>(getStoredBlinkConfig)
  const [hydrationConfig, setHydrationConfig] = useState<HydrationConfig>(getStoredHydrationConfig)
  const [drinkConfig, setDrinkConfig] = useState<DrinkConfig>(getStoredDrinkConfig)
  const [healthStrictness, setHealthStrictness] =
    useState<HealthStrictness>(getStoredHealthStrictness)
  const [autoStartEnabled, setAutoStartEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const shouldTrackUptime = uptimeSeconds !== null
  const stressSnapshot = useStressMonitor()
  const [activityToast, setActivityToast] = useState<{ message: string; expiresAt: number } | null>(
    null
  )
  const snapshotRef = useRef(stressSnapshot)

  useEffect(() => {
    let isMounted = true
    window.api
      .getSystemInfo()
      .then((info) => {
        if (!isMounted) return
        setUptimeSeconds(Math.floor(info.uptime))
      })
      .catch(() => {
        if (!isMounted) return
        setUptimeSeconds(null)
      })
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    void window.api
      .getAutoStart()
      .then((enabled) => {
        if (!isMounted) return
        setAutoStartEnabled(enabled)
      })
      .catch(() => {
        if (!isMounted) return
        setAutoStartEnabled(false)
      })

    void window.api
      .getNotificationsEnabled()
      .then((enabled) => {
        if (!isMounted) return
        setNotificationsEnabled(enabled)
      })
      .catch(() => {
        if (!isMounted) return
        setNotificationsEnabled(true)
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

  useEffect(() => {
    window.localStorage.setItem('arokiyam-hydration-config', JSON.stringify(hydrationConfig))
    void window.api.setHydrationConfig(hydrationConfig)
  }, [hydrationConfig])

  useEffect(() => {
    window.localStorage.setItem('arokiyam-drink-config', JSON.stringify(drinkConfig))
    void window.api.setDrinkConfig(drinkConfig)
  }, [drinkConfig])

  useEffect(() => {
    window.localStorage.setItem('arokiyam-health-strictness', healthStrictness)
  }, [healthStrictness])

  useEffect(() => {
    snapshotRef.current = stressSnapshot
  }, [stressSnapshot])

  useEffect(() => {
    const id = setInterval(() => {
      const snapshot = snapshotRef.current
      if (!snapshot) return

      const now = Date.now()
      const candidates: Array<{ label: string; time: number }> = []

      if (!snapshot.isBlinkActive) {
        candidates.push({ label: 'Blink', time: snapshot.nextBlinkAt })
      }
      if (!snapshot.isBreakActive) {
        candidates.push({ label: 'Break', time: snapshot.nextBreakAt })
      }
      if (!snapshot.isHydrationActive) {
        candidates.push({ label: 'Hydration', time: snapshot.nextHydrationAt })
      }
      if (!snapshot.isDrinkActive) {
        candidates.push({ label: 'Drink', time: snapshot.nextDrinkAt })
      }

      if (!candidates.length) return

      const next = candidates.reduce((soonest, item) => (item.time < soonest.time ? item : soonest))
      const remainingMs = next.time - now

      if (remainingMs > 0 && remainingMs <= 5_000) {
        const secondsLeft = Math.ceil(remainingMs / 1000)
        setActivityToast({
          message: `${next.label} starts in ${secondsLeft}s`,
          expiresAt: next.time
        })
        return
      }

      if (activityToast && activityToast.expiresAt <= now) {
        setActivityToast(null)
      }
    }, 1000)

    return () => clearInterval(id)
  }, [activityToast])

  const greeting = getGreeting(currentTime)

  const uptimeLabel = uptimeSeconds === null ? '--' : formatUptime(uptimeSeconds)
  const bootedAt =
    uptimeSeconds === null ? null : new Date(currentTime.getTime() - uptimeSeconds * 1000)

  const handleStartBreak = (): void => {
    void window.api.requestBreak()
  }

  const handleStartBlink = (): void => {
    void window.api.requestBlink()
  }

  const handleStartHydration = (): void => {
    void window.api.requestHydration()
  }

  const handleStartDrink = (): void => {
    void window.api.requestDrink()
  }

  const updateBlinkConfig = (patch: Partial<BlinkConfig>): void => {
    setBlinkConfig((prev) => {
      const next = { ...prev, ...patch }
      if (next.minMinutes > next.maxMinutes) next.maxMinutes = next.minMinutes
      return next
    })
  }

  const updateHydrationConfig = (patch: Partial<HydrationConfig>): void => {
    setHydrationConfig((prev) => ({ ...prev, ...patch }))
  }

  const updateDrinkConfig = (patch: Partial<DrinkConfig>): void => {
    setDrinkConfig((prev) => ({ ...prev, ...patch }))
  }

  const toggleAutoStart = (): void => {
    const next = !autoStartEnabled
    setAutoStartEnabled(next)
    void window.api
      .setAutoStart(next)
      .then(setAutoStartEnabled)
      .catch(() => setAutoStartEnabled(!next))
  }

  const toggleNotifications = (): void => {
    const next = !notificationsEnabled
    setNotificationsEnabled(next)
    void window.api
      .setNotificationsEnabled(next)
      .then(setNotificationsEnabled)
      .catch(() => setNotificationsEnabled(!next))
  }

  const panelClass =
    'rounded-3xl border border-slate-200/70 bg-white/70 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-slate-700/60 dark:bg-slate-900/70'
  const cardClass =
    'rounded-2xl border border-slate-200/70 bg-white/70 dark:border-slate-700/60 dark:bg-slate-900/70'

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top,#f8efe4_0%,#f3f6ff_45%,#eef7f1_100%)] px-6 py-8 font-['Space_Grotesk'] text-slate-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top,#1218260%,#0f172a55%,#0b1120_100%)] dark:text-slate-100 lg:px-12">
      {activityToast && (
        <div className="absolute right-6 top-20 z-50 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-lg dark:border-slate-700/60 dark:bg-slate-900/90 dark:text-slate-100">
          {activityToast.message}
        </div>
      )}
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
            Arokiyam ·{' '}
            <span className="tracking-wider! text-orange-500!">
              {healthStrictnessLabels[healthStrictness]}
            </span>
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
                  Computer on from
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
                <StressSection
                  snapshot={stressSnapshot}
                  onStartBreak={handleStartBreak}
                  onStartBlink={handleStartBlink}
                  onStartHydration={handleStartHydration}
                  onStartDrink={handleStartDrink}
                />
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
                <button
                  className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-500/60"
                  onClick={toggleNotifications}
                  type="button"
                >
                  {notificationsEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
            <div className={`${cardClass} p-5`}>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Auto start</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Open Arokiyam at startup
              </p>
              <div className="mt-4 flex items-center gap-2">
                <button
                  className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-500/60"
                  onClick={toggleAutoStart}
                  type="button"
                >
                  {autoStartEnabled ? 'On' : 'Off'}
                </button>
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
            <div className={`${cardClass} p-5`}>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Health strictness
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Control how strict activity screens should be.
              </p>
              <div className="mt-4">
                <label className="flex flex-col gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Choose level
                  <select
                    className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100"
                    value={healthStrictness}
                    onChange={(event) =>
                      setHealthStrictness(event.target.value as HealthStrictness)
                    }
                  >
                    <option value="basic">{healthStrictnessLabels.basic}</option>
                    <option value="medium">{healthStrictnessLabels.medium}</option>
                    <option value="strict">{healthStrictnessLabels.strict}</option>
                  </select>
                </label>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {healthStrictness === 'basic' && 'Skip or snooze anytime during an activity.'}
                  {healthStrictness === 'medium' &&
                    'Skip or snooze after 10 seconds of the activity.'}
                  {healthStrictness === 'strict' &&
                    'No skipping. Finish the activity or wait for it to end.'}
                </p>
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
            <div className={`${cardClass} p-5 md:col-span-2`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Hydration lock
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Periodic water reminders with a short focus lock.
                  </p>
                </div>
                <button
                  className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-500/60"
                  onClick={() => updateHydrationConfig({ enabled: !hydrationConfig.enabled })}
                  type="button"
                >
                  {hydrationConfig.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <label className="flex flex-col gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Interval (min)
                  <input
                    className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100"
                    type="number"
                    min={15}
                    max={180}
                    value={hydrationConfig.intervalMinutes}
                    onChange={(event) =>
                      updateHydrationConfig({ intervalMinutes: Number(event.target.value) })
                    }
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Duration (sec)
                  <input
                    className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100"
                    type="number"
                    min={10}
                    max={120}
                    value={hydrationConfig.durationSeconds}
                    onChange={(event) =>
                      updateHydrationConfig({ durationSeconds: Number(event.target.value) })
                    }
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Snooze (min)
                  <input
                    className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100"
                    type="number"
                    min={5}
                    max={60}
                    value={hydrationConfig.snoozeMinutes}
                    onChange={(event) =>
                      updateHydrationConfig({ snoozeMinutes: Number(event.target.value) })
                    }
                  />
                </label>
              </div>
            </div>
            <div className={`${cardClass} p-5 md:col-span-2`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Focus drink
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Coffee, tea, or juice to stay sharp and focused.
                  </p>
                </div>
                <button
                  className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-500/60"
                  onClick={() => updateDrinkConfig({ enabled: !drinkConfig.enabled })}
                  type="button"
                >
                  {drinkConfig.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <label className="flex flex-col gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Interval (min)
                  <input
                    className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100"
                    type="number"
                    min={60}
                    max={240}
                    value={drinkConfig.intervalMinutes}
                    onChange={(event) =>
                      updateDrinkConfig({ intervalMinutes: Number(event.target.value) })
                    }
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Duration (sec)
                  <input
                    className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100"
                    type="number"
                    min={15}
                    max={180}
                    value={drinkConfig.durationSeconds}
                    onChange={(event) =>
                      updateDrinkConfig({ durationSeconds: Number(event.target.value) })
                    }
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Snooze (min)
                  <input
                    className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100"
                    type="number"
                    min={10}
                    max={120}
                    value={drinkConfig.snoozeMinutes}
                    onChange={(event) =>
                      updateDrinkConfig({ snoozeMinutes: Number(event.target.value) })
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

      <div className="mx-auto mt-12 w-full max-w-6xl text-center text-xs text-slate-500 dark:text-slate-400 ">
        <span className="text-sm mb-2 block font-medium text-slate-900 ">
          Made with ❤️ by{' '}
          <a
            href="https://anbuselvan-annamalai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-800"
          >
            Anbuselvan Rocky
          </a>
        </span>
        {/* (
        <a
          href="https://github.com/anburocky3/arokiyam-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        ) */}
        <div>All Rights Reserved &copy; {new Date().getFullYear()} </div>
      </div>
    </div>
  )
}

export default App
