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
  minMinutes: 15,
  maxMinutes: 22,
  durationSeconds: 8,
  snoozeMinutes: 5
}

const defaultHydrationConfig: HydrationConfig = {
  enabled: true,
  intervalMinutes: 60,
  durationSeconds: 30,
  snoozeMinutes: 15
}

const defaultDrinkConfig: DrinkConfig = {
  enabled: true,
  intervalMinutes: 180,
  durationSeconds: 30,
  snoozeMinutes: 30
}

const defaultHealthStrictness: HealthStrictness = 'basic'

const healthStrictnessLabels: Record<HealthStrictness, string> = {
  basic: 'Basic',
  medium: 'Medium',
  strict: 'Health conscious'
}

const motivationalQuotes: Array<{ quote: string; author: string }> = [
  { quote: 'Small healthy breaks create big productive days.', author: 'Arokiyam' },
  { quote: 'Take care of your body; your code depends on it.', author: 'Unknown' },
  { quote: 'Focus is a rhythm, not a sprint.', author: 'Arokiyam' },
  { quote: 'Consistency beats intensity for long-term wellness.', author: 'Arokiyam' },
  { quote: 'Hydrate, breathe, blink, then build.', author: 'Arokiyam' }
]

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
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'preferences' | 'about' | 'support'>(
    'dashboard'
  )
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme)
  const [blinkConfig, setBlinkConfig] = useState<BlinkConfig>(getStoredBlinkConfig)
  const [hydrationConfig, setHydrationConfig] = useState<HydrationConfig>(getStoredHydrationConfig)
  const [drinkConfig, setDrinkConfig] = useState<DrinkConfig>(getStoredDrinkConfig)
  const [healthStrictness, setHealthStrictness] =
    useState<HealthStrictness>(getStoredHealthStrictness)
  const [autoStartEnabled, setAutoStartEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true)
  const [displayName, setDisplayName] = useState('')
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
    void window.api
      .getQuietHoursEnabled()
      .then((enabled) => {
        if (!isMounted) return
        setQuietHoursEnabled(enabled)
      })
      .catch(() => {
        if (!isMounted) return
        setQuietHoursEnabled(true)
      })

    void window.api
      .getDisplayName()
      .then((name) => {
        if (!isMounted) return
        setDisplayName(name)
      })
      .catch(() => {
        if (!isMounted) return
        setDisplayName('')
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

      const currentHour = new Date().getHours()
      const inQuietHours = currentHour >= 22 || currentHour < 7
      const remindersBlocked = !notificationsEnabled || (quietHoursEnabled && inQuietHours)
      if (remindersBlocked) {
        if (activityToast) setActivityToast(null)
        return
      }

      const now = Date.now()
      const candidates: Array<{ label: string; time: number }> = []

      if (blinkConfig.enabled && !snapshot.isBlinkActive) {
        candidates.push({ label: 'Blink', time: snapshot.nextBlinkAt })
      }
      if (!snapshot.isBreakActive) {
        candidates.push({ label: 'Break', time: snapshot.nextBreakAt })
      }
      if (hydrationConfig.enabled && !snapshot.isHydrationActive) {
        candidates.push({ label: 'Hydration', time: snapshot.nextHydrationAt })
      }
      if (drinkConfig.enabled && !snapshot.isDrinkActive) {
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
  }, [
    activityToast,
    notificationsEnabled,
    quietHoursEnabled,
    blinkConfig.enabled,
    hydrationConfig.enabled,
    drinkConfig.enabled
  ])

  const greeting = getGreeting(currentTime)
  const displayGreetingName = displayName.trim() || 'there'
  const quoteIndex =
    (currentTime.getDate() + currentTime.getMonth() * 31 + currentTime.getFullYear()) %
    motivationalQuotes.length
  const todaysQuote = motivationalQuotes[quoteIndex]
  const needsMachineRest = (uptimeSeconds ?? 0) >= 10 * 60 * 60

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

  const toggleQuietHours = (): void => {
    const next = !quietHoursEnabled
    setQuietHoursEnabled(next)
    void window.api
      .setQuietHoursEnabled(next)
      .then(setQuietHoursEnabled)
      .catch(() => setQuietHoursEnabled(!next))
  }

  const toggleBlinkEnabled = (): void => {
    updateBlinkConfig({ enabled: !blinkConfig.enabled })
  }

  const toggleHydrationEnabled = (): void => {
    updateHydrationConfig({ enabled: !hydrationConfig.enabled })
  }

  const toggleDrinkEnabled = (): void => {
    updateDrinkConfig({ enabled: !drinkConfig.enabled })
  }

  const isInQuietHours = (date = new Date()): boolean => {
    const hour = date.getHours()
    return hour >= 22 || hour < 7
  }

  const handleDisplayNameChange = (value: string): void => {
    setDisplayName(value)
  }

  const saveDisplayName = (): void => {
    void window.api
      .setDisplayName(displayName)
      .then(setDisplayName)
      .catch(() => undefined)
  }

  const TogglePill = ({
    enabled,
    onClick,
    enabledColor,
    disabledColor,
    onIcon,
    offIcon,
    ariaLabel
  }: {
    enabled: boolean
    onClick: () => void
    enabledColor: string
    disabledColor: string
    onIcon: React.JSX.Element
    offIcon: React.JSX.Element
    ariaLabel: string
  }): React.JSX.Element => (
    <button
      className={`group relative inline-flex h-6 w-12 items-center rounded-full p-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
        enabled
          ? `${enabledColor} shadow-[0_5px_24px_rgba(16,185,129,0.35)]`
          : `${disabledColor} shadow-[0_5px_24px_rgba(244,63,94,0.25)]`
      }`}
      onClick={onClick}
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={ariaLabel}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow transition-transform duration-300 ${
          enabled ? 'translate-x-6' : '-translate-x-1'
        }`}
      >
        {enabled ? onIcon : offIcon}
      </span>
    </button>
  )

  const panelClass =
    'rounded-3xl border border-slate-200/70 bg-white/70 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-slate-700/60 dark:bg-slate-900/70'
  const cardClass =
    'rounded-2xl border border-slate-200/70 bg-white/70 dark:border-slate-700/60 dark:bg-slate-900/70'

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top,#f8efe4_0%,#f3f6ff_45%,#eef7f1_100%)] px-6 py-8 font-['Space_Grotesk'] text-slate-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top,#000000_0%,#0f172a_55%,#0b1120_100%)] dark:text-slate-100 lg:px-12">
      {/*   */}
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
            {greeting}, {displayGreetingName}.
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
              activeMenu === 'about'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'border border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-500/60'
            }`}
            onClick={() => setActiveMenu('about')}
          >
            About
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
            {needsMachineRest && (
              <div className="rounded-2xl border border-amber-300/70 bg-linear-to-r from-amber-100 to-orange-100 p-4 text-amber-900 shadow-sm dark:border-amber-500/30 dark:from-amber-500/20 dark:to-orange-500/20 dark:text-amber-100">
                <p className="text-sm font-bold uppercase tracking-[0.16em]">
                  Machine rest reminder
                </p>
                <p className="mt-1 text-sm font-medium">
                  This machine has been running for over 10 hours. Give it some rest for better
                  performance.
                </p>
              </div>
            )}

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
              <div className={`${cardClass} p-5 md:col-span-2`}>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                  Motivation for today
                </p>
                <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  &ldquo;{todaysQuote.quote}&rdquo;
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  - {todaysQuote.author}
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
                  blinkEnabled={blinkConfig.enabled}
                  hydrationEnabled={hydrationConfig.enabled}
                  drinkEnabled={drinkConfig.enabled}
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
            <div className={`${cardClass} p-5 col-span-2`}>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Your name</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Used for personalized greetings in dashboard
              </p>
              <div className="mt-4 flex items-center gap-2">
                <input
                  className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100"
                  value={displayName}
                  onChange={(event) => handleDisplayNameChange(event.target.value)}
                  onBlur={saveDisplayName}
                  placeholder="Enter your name"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Saved automatically when you leave the field.
              </p>
            </div>
            <div className={`${cardClass} p-5 flex justify-between`}>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Notifications
                </p>
                <small className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Helpful reminders for updates
                </small>
              </div>
              <TogglePill
                enabled={notificationsEnabled}
                onClick={toggleNotifications}
                enabledColor="bg-gradient-to-r from-emerald-500 to-cyan-500"
                disabledColor="bg-gradient-to-r from-slate-500 to-slate-700"
                ariaLabel="Toggle notifications"
                onIcon={
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
                    <path d="M9 17a3 3 0 0 0 6 0" />
                  </svg>
                }
                offIcon={
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M10.3 5.1A6 6 0 0 1 18 11v3.2a2 2 0 0 0 .6 1.4L20 17h-5" />
                    <path d="M4 4l16 16" />
                    <path d="M6.2 6.2A6 6 0 0 0 6 11v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
                  </svg>
                }
              />
            </div>
            <div className={`${cardClass} p-5 flex justify-between`}>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Auto start
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Open Arokiyam at startup
                </p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Works after installing Arokiyam from setup. Portable/dev mode cannot auto start.
                </p>
              </div>

              <div className="">
                <TogglePill
                  enabled={autoStartEnabled}
                  onClick={toggleAutoStart}
                  enabledColor="bg-gradient-to-r from-sky-500 to-indigo-500"
                  disabledColor="bg-gradient-to-r from-slate-500 to-slate-700"
                  ariaLabel="Toggle auto start"
                  onIcon={
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M4 12h10" />
                      <path d="m10 6 6 6-6 6" />
                    </svg>
                  }
                  offIcon={
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M8 8l8 8" />
                      <path d="m16 8-8 8" />
                    </svg>
                  }
                />
              </div>
            </div>
            <div className={`${cardClass} p-5 flex justify-between`}>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Quiet hours
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Silence reminders overnight
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      !quietHoursEnabled
                        ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                        : isInQuietHours()
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
                    }`}
                  >
                    {!quietHoursEnabled
                      ? 'Disabled'
                      : isInQuietHours()
                        ? 'Active now'
                        : 'Starts at 10:00 PM'}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    10:00 PM - 7:00 AM
                  </span>
                </div>
              </div>
              <TogglePill
                enabled={quietHoursEnabled}
                onClick={toggleQuietHours}
                enabledColor="bg-gradient-to-r from-violet-500 to-fuchsia-500"
                disabledColor="bg-gradient-to-r from-slate-500 to-slate-700"
                ariaLabel="Toggle quiet hours"
                onIcon={
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
                  </svg>
                }
                offIcon={
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M5 5l1.5 1.5M17.5 17.5 19 19M2 12h2M20 12h2M5 19l1.5-1.5M17.5 6.5 19 5" />
                  </svg>
                }
              />
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
                    A gentle black screen reminder. Recommended: every 15-22 minutes.
                  </p>
                </div>
                <TogglePill
                  enabled={blinkConfig.enabled}
                  onClick={toggleBlinkEnabled}
                  enabledColor="bg-gradient-to-r from-indigo-500 to-sky-500"
                  disabledColor="bg-gradient-to-r from-slate-500 to-slate-700"
                  ariaLabel="Toggle blink overlay"
                  onIcon={
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                  }
                  offIcon={
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                      <path d="M4 4l16 16" />
                    </svg>
                  }
                />
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
                    Periodic water reminders. Recommended: every 60 minutes.
                  </p>
                </div>
                <TogglePill
                  enabled={hydrationConfig.enabled}
                  onClick={toggleHydrationEnabled}
                  enabledColor="bg-gradient-to-r from-cyan-500 to-teal-500"
                  disabledColor="bg-gradient-to-r from-slate-500 to-slate-700"
                  ariaLabel="Toggle hydration lock"
                  onIcon={
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 2s5 5.2 5 9a5 5 0 0 1-10 0c0-3.8 5-9 5-9Z" />
                    </svg>
                  }
                  offIcon={
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 2s5 5.2 5 9a5 5 0 0 1-10 0c0-3.8 5-9 5-9Z" />
                      <path d="M4 4l16 16" />
                    </svg>
                  }
                />
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
                    Coffee, tea, or juice reminders. Recommended: every 180 minutes.
                  </p>
                </div>
                <TogglePill
                  enabled={drinkConfig.enabled}
                  onClick={toggleDrinkEnabled}
                  enabledColor="bg-gradient-to-r from-amber-500 to-orange-500"
                  disabledColor="bg-gradient-to-r from-slate-500 to-slate-700"
                  ariaLabel="Toggle focus drink"
                  onIcon={
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M4 6h12v4a6 6 0 1 1-12 0V6Z" />
                      <path d="M16 8h2a2 2 0 0 1 0 4h-2" />
                    </svg>
                  }
                  offIcon={
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M4 6h12v4a6 6 0 1 1-12 0V6Z" />
                      <path d="M16 8h2a2 2 0 0 1 0 4h-2" />
                      <path d="M4 4l16 16" />
                    </svg>
                  }
                />
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

      {activeMenu === 'about' && (
        <section className={`mx-auto mt-8 w-full max-w-6xl p-6 ${panelClass}`}>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">About</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Arokiyam is a health companion for coding, designed to help developers work with better
            focus and healthier habits.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className={`${cardClass} p-5`}>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Author</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Built and maintained by Anbuselvan Rocky
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="https://anbuselvan-annamalai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-500/60"
                >
                  Website
                </a>
                <a
                  href="https://github.com/anburocky3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-500/60"
                >
                  GitHub
                </a>
              </div>
            </div>

            <div className={`${cardClass} p-5`}>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Project</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Open-source desktop app built with Electron + React + TypeScript.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="https://github.com/anburocky3/arokiyam-app/fork"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-500/60"
                >
                  GitHub Repository
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeMenu === 'support' && (
        <section className={`mx-auto mt-8 w-full max-w-6xl p-6 ${panelClass}`}>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Support</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Need help? We have quick guides and a friendly checklist for you. Reach out anytime!
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

      <div className="mx-auto mt-10 w-full text-center text-xs text-slate-500 dark:text-slate-400 ">
        <div className="dark:text-slate-300 mb-5 flex items-center justify-center">
          <span className="mr-2">Made with ❤️ by </span>
          {'  '}
          <a
            href="https://anbuselvan-annamalai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-800 font-medium dark:text-green-400 transition "
          >
            Anbuselvan Rocky
          </a>
        </div>
        <div className="mb-4 flex items-center justify-center gap-3">
          <a
            href="https://github.com/anburocky3"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            title="GitHub"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300/80 text-slate-600 transition hover:border-slate-500 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-200 dark:hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.61-3.37-1.19-3.37-1.19-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.61.07-.61 1 .07 1.53 1.02 1.53 1.02.89 1.52 2.33 1.08 2.9.83.09-.64.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.02-2.67-.1-.26-.44-1.28.1-2.66 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.84c.85 0 1.7.12 2.5.35 1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.4.1 2.66.64.69 1.02 1.58 1.02 2.67 0 3.84-2.33 4.69-4.56 4.94.36.3.67.88.67 1.77v2.62c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
            </svg>
          </a>
          <a
            href="https://github.com/anburocky3/arokiyam-app/fork"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Repository"
            title="Repository"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300/80 text-slate-600 transition hover:border-slate-500 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-400 dark:hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                fill="currentColor"
                d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
              />
            </svg>
          </a>
          <a
            href="https://anbuselvan-annamalai.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Website"
            title="Website"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300/80 text-slate-600 transition hover:border-slate-500 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-400 dark:hover:text-white"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18" />
              <path d="M12 3a15 15 0 0 1 0 18" />
              <path d="M12 3a15 15 0 0 0 0 18" />
            </svg>
          </a>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 ">
          All Rights Reserved &copy; {new Date().getFullYear()}
        </div>
      </div>
    </div>
  )
}

export default App
