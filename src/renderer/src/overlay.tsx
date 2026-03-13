import './assets/main.css'

import { StrictMode, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { StressSnapshot, OverlayState, OverlayToast } from '../../shared/monitor'

const formatCountdown = (endTime: number | null): string => {
  if (!endTime) return '--:--'
  const remaining = Math.max(0, endTime - Date.now())
  const totalSeconds = Math.ceil(remaining / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

type OverlayViewState = {
  state: OverlayState
  toast: OverlayToast | null
  snapshot: StressSnapshot | null
}

type HealthStrictness = 'basic' | 'medium' | 'strict'

const HEALTH_STRICTNESS_KEY = 'arokiyam-health-strictness'

const getStoredHealthStrictness = (): HealthStrictness => {
  const stored = window.localStorage.getItem(HEALTH_STRICTNESS_KEY)
  if (stored === 'basic' || stored === 'medium' || stored === 'strict') return stored
  return 'basic'
}

const getStoredActivityEnabled = (key: string, defaultEnabled = true): boolean => {
  const raw = window.localStorage.getItem(key)
  if (!raw) return defaultEnabled
  try {
    const parsed = JSON.parse(raw) as { enabled?: boolean }
    return parsed.enabled ?? defaultEnabled
  } catch {
    return defaultEnabled
  }
}

export const OverlayApp = (): React.JSX.Element => {
  const [overlayState, setOverlayState] = useState<OverlayViewState>({
    state: {
      mode: 'normal',
      breakEndsAt: null,
      blinkEndsAt: null,
      hydrationEndsAt: null,
      drinkEndsAt: null,
      breathingActive: false
    },
    toast: null,
    snapshot: null
  })
  const [now, setNow] = useState(() => Date.now())
  const [healthStrictness, setHealthStrictness] =
    useState<HealthStrictness>(getStoredHealthStrictness)
  const [modeStartAt, setModeStartAt] = useState<number | null>(null)
  const lastModeRef = useRef<OverlayState['mode']>('normal')

  useEffect(() => {
    const unsubscribeState = window.api.onOverlayState((state) => {
      if (state.mode !== lastModeRef.current) {
        setModeStartAt(state.mode === 'normal' ? null : Date.now())
        lastModeRef.current = state.mode
      }
      setOverlayState((prev) => ({ ...prev, state }))
    })
    const unsubscribeToast = window.api.onOverlayToast((toast) => {
      setOverlayState((prev) => ({ ...prev, toast }))
    })
    const unsubscribeStress = window.api.onStressUpdate((snapshot) => {
      setOverlayState((prev) => ({ ...prev, snapshot }))
    })
    return () => {
      unsubscribeState()
      unsubscribeToast()
      unsubscribeStress()
    }
  }, [])

  useEffect(() => {
    const handleStorage = (event: StorageEvent): void => {
      if (event.key !== HEALTH_STRICTNESS_KEY) return
      setHealthStrictness(getStoredHealthStrictness())
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const isBreakMode = overlayState.state.mode === 'break'
  const isBlinkMode = overlayState.state.mode === 'blink'
  const isHydrationMode = overlayState.state.mode === 'hydration'
  const isDrinkMode = overlayState.state.mode === 'drink'
  let countdownTarget = overlayState.state.breakEndsAt
  if (isBlinkMode) {
    countdownTarget = overlayState.state.blinkEndsAt
  } else if (isHydrationMode) {
    countdownTarget = overlayState.state.hydrationEndsAt
  } else if (isDrinkMode) {
    countdownTarget = overlayState.state.drinkEndsAt
  }
  const countdown = formatCountdown(countdownTarget)

  const toastVisible = overlayState.toast && overlayState.toast.expiresAt > now

  const skipDelayMs = 10_000
  const skipUnlockAt =
    healthStrictness === 'medium' && modeStartAt ? modeStartAt + skipDelayMs : null
  const skipLocked = skipUnlockAt ? now < skipUnlockAt : false
  const canSkipOrSnooze = healthStrictness === 'basic' || !skipLocked
  const showSkipOrSnooze = healthStrictness !== 'strict'
  const showEligibleControls = showSkipOrSnooze && canSkipOrSnooze
  const actionFadeClass = 'opacity-80 transition-opacity hover:opacity-100'
  const skipUnlockIn = skipUnlockAt ? Math.max(0, Math.ceil((skipUnlockAt - now) / 1000)) : 0
  const showSkipCountdown = showSkipOrSnooze && !canSkipOrSnooze && skipUnlockIn > 0

  let overlayClass = 'bg-transparent text-white'
  if (isBreakMode || isBlinkMode) {
    overlayClass = 'bg-black/95 text-white'
  } else if (isHydrationMode) {
    overlayClass =
      'bg-[radial-gradient(circle_at_top,#0ea5e9_0%,#0f172a_55%,#020617_100%)] text-white'
  } else if (isDrinkMode) {
    overlayClass =
      'bg-[radial-gradient(circle_at_top,#f59e0b_0%,#4b2a14_55%,#1f1208_100%)] text-white'
  }

  const activityToast = useMemo(() => {
    const snapshot = overlayState.snapshot
    if (!snapshot) return null

    const breakEnabled = getStoredActivityEnabled('arokiyam-break-config', true)
    const blinkEnabled = getStoredActivityEnabled('arokiyam-blink-config', true)
    const hydrationEnabled = getStoredActivityEnabled('arokiyam-hydration-config', true)
    const drinkEnabled = getStoredActivityEnabled('arokiyam-drink-config', true)

    const candidates: Array<{ label: string; time: number }> = []

    if (blinkEnabled && !snapshot.isBlinkActive) {
      candidates.push({ label: 'Blink', time: snapshot.nextBlinkAt })
    }
    if (breakEnabled && !snapshot.isBreakActive) {
      candidates.push({ label: 'Break', time: snapshot.nextBreakAt })
    }
    if (hydrationEnabled && !snapshot.isHydrationActive) {
      candidates.push({ label: 'Hydration', time: snapshot.nextHydrationAt })
    }
    if (drinkEnabled && !snapshot.isDrinkActive) {
      candidates.push({ label: 'Drink', time: snapshot.nextDrinkAt })
    }

    if (!candidates.length) return null

    const next = candidates.reduce((soonest, item) => (item.time < soonest.time ? item : soonest))
    const remainingMs = next.time - now

    if (remainingMs > 0 && remainingMs <= 5_000) {
      const secondsLeft = Math.ceil(remainingMs / 1000)
      return `${next.label} starts in ${secondsLeft}s`
    }

    return null
  }, [overlayState.snapshot, now])

  return (
    <div
      className={`min-h-screen w-full font-['Space_Grotesk'] transition-colors duration-300 ${overlayClass}`}
    >
      {toastVisible && (
        <div className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 rounded-full bg-black/70 px-6 py-2 text-sm font-medium text-white shadow-lg">
          {overlayState.toast?.message}
        </div>
      )}

      {activityToast && !isBreakMode && !isBlinkMode && !isHydrationMode && !isDrinkMode && (
        <div className="pointer-events-none absolute bottom-8 right-8 rounded-2xl border border-white/20 bg-black/70 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          {activityToast}
        </div>
      )}

      {isBreakMode && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">Break time</p>
            <h1 className="text-4xl font-semibold md:text-5xl font-['Fraunces']">
              Reset your energy
            </h1>
            <p className="text-base text-white/70">
              Follow the breathing guide and stretch your wrists.
            </p>
          </div>
          <div className="relative flex h-56 w-56 items-center justify-center">
            <div className="absolute h-56 w-56 rounded-full border border-white/30" />
            <div className="absolute h-40 w-40 rounded-full border border-white/20" />
            <div className="absolute h-24 w-24 rounded-full border border-white/10" />
            <div className="h-16 w-16 rounded-full bg-white/90 shadow-[0_0_25px_rgba(255,255,255,0.4)] animate-breath" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-white/70">Deep breath sync</p>
            <p className="text-3xl font-semibold">{countdown}</p>
          </div>
          {showEligibleControls && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                className={`rounded-full border border-white/40 bg-white/15 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/70 ${actionFadeClass}`}
                onClick={() => void window.api.skipBreak()}
                type="button"
              >
                Skip
              </button>
            </div>
          )}
        </div>
      )}

      {isBlinkMode && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">Blink break</p>
            <h1 className="text-4xl font-semibold md:text-5xl font-['Fraunces']">Rest your eyes</h1>
            <p className="text-base text-white/70">Close your eyes, breathe, and relax.</p>
          </div>
          <div className="relative flex items-center justify-center gap-6">
            <div className="absolute -inset-6 rounded-full bg-linear-to-r from-pink-500/30 via-sky-500/30 to-emerald-400/30 blur-2xl" />
            <div className="relative flex h-20 w-28 items-center justify-center rounded-full bg-white/10 shadow-[0_0_25px_rgba(59,130,246,0.35)]">
              <div className="h-10 w-20 rounded-full bg-linear-to-r from-rose-400 via-amber-300 to-sky-400 animate-eye-glow">
                <div className="mx-auto h-10 w-20 rounded-full bg-black/80 animate-blink" />
              </div>
            </div>
            <div className="relative flex h-20 w-28 items-center justify-center rounded-full bg-white/10 shadow-[0_0_25px_rgba(236,72,153,0.35)]">
              <div className="h-10 w-20 rounded-full bg-linear-to-r from-emerald-400 via-cyan-300 to-violet-400 animate-eye-glow">
                <div className="mx-auto h-10 w-20 rounded-full bg-black/80 animate-blink" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-white/70">Blinking in progress</p>
            <p className="text-3xl font-semibold">{countdown}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {showEligibleControls && (
              <button
                className={`rounded-full border border-white/40 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/70 ${actionFadeClass}`}
                onClick={() => void window.api.skipBlink()}
                type="button"
              >
                Skip
              </button>
            )}
            {showEligibleControls && (
              <button
                className={`rounded-full border border-white/40 bg-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/70 ${actionFadeClass}`}
                onClick={() => void window.api.snoozeBlink()}
                type="button"
              >
                Snooze
              </button>
            )}
          </div>
        </div>
      )}

      {isHydrationMode && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">Hydration lock</p>
            <h1 className="text-4xl font-semibold md:text-5xl font-['Fraunces']">
              Drink some water
            </h1>
            <p className="text-base text-white/70">
              Slow sips. Reset your focus and keep your body steady.
            </p>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-10 rounded-full bg-sky-500/20 blur-3xl" />
            <div className="relative h-60 w-40 rounded-[2.5rem] border border-white/30 bg-white/5 p-4 shadow-[0_0_40px_rgba(56,189,248,0.35)]">
              <div className="relative h-full w-full overflow-hidden rounded-4xl">
                <div className="absolute inset-x-0 bottom-0 h-3/5 rounded-4xl bg-linear-to-b from-cyan-300/80 via-sky-400/70 to-blue-600/80 animate-water-rise" />
                <div className="absolute inset-x-0 bottom-0 h-3/5 rounded-4xl bg-white/10 animate-water-wave" />
                <span className="absolute bottom-6 left-6 h-3 w-3 rounded-full bg-white/80 animate-bubble" />
                <span className="absolute bottom-10 right-8 h-2 w-2 rounded-full bg-white/60 animate-bubble" />
                <span className="absolute bottom-16 left-10 h-2.5 w-2.5 rounded-full bg-white/70 animate-bubble" />
              </div>
              <div className="absolute inset-x-6 top-6 h-1 rounded-full bg-white/30" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-white/70">Hydration in progress</p>
            <p className="text-3xl font-semibold">{countdown}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              className="rounded-full border border-white/40 bg-white/15 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/70"
              onClick={() => void window.api.completeHydration()}
              type="button"
            >
              I drank
            </button>
            {showEligibleControls && (
              <button
                className={`rounded-full border border-white/40 bg-white/25 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/70 ${actionFadeClass}`}
                onClick={() => void window.api.snoozeHydration()}
                type="button"
              >
                Snooze
              </button>
            )}
          </div>
        </div>
      )}

      {isDrinkMode && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">Focus drink</p>
            <h1 className="text-4xl font-semibold md:text-5xl font-['Fraunces']">
              Coffee, tea, or juice
            </h1>
            <p className="text-base text-white/70">
              Take a sip to stay healthy and focused on development.
            </p>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-10 rounded-full bg-amber-400/20 blur-3xl" />
            <div className="relative flex h-48 w-40 items-end justify-center">
              <div className="absolute -top-6 left-1/2 h-12 w-12 -translate-x-1/2 rounded-full border border-white/30 bg-white/5" />
              <div className="absolute top-0 left-1/2 h-20 w-24 -translate-x-1/2">
                <span className="absolute left-2 top-0 h-12 w-4 rounded-full bg-white/20 blur-sm animate-steam" />
                <span className="absolute right-2 top-3 h-10 w-3 rounded-full bg-white/20 blur-sm animate-steam" />
              </div>
              <div className="relative h-32 w-32 rounded-3xl border border-white/30 bg-white/10 shadow-[0_0_30px_rgba(251,191,36,0.35)]">
                <div className="absolute inset-x-4 top-4 h-6 rounded-2xl bg-white/15" />
                <div className="absolute inset-x-6 bottom-6 h-10 rounded-2xl bg-linear-to-r from-amber-300/80 via-orange-400/70 to-rose-400/70 animate-cup-wave" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-white/70">Focus drink in progress</p>
            <p className="text-3xl font-semibold">{countdown}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              className="rounded-full border border-white/40 bg-white/15 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/70"
              onClick={() => void window.api.completeDrink()}
              type="button"
            >
              Done
            </button>
            {showEligibleControls && (
              <button
                className={`rounded-full border border-white/40 bg-white/25 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/70 ${actionFadeClass}`}
                onClick={() => void window.api.snoozeDrink()}
                type="button"
              >
                Snooze
              </button>
            )}
          </div>
        </div>
      )}
      {showSkipCountdown && (isBreakMode || isBlinkMode || isHydrationMode || isDrinkMode) && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-white/70">
          You can skip this in {skipUnlockIn}s
        </div>
      )}
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OverlayApp />
  </StrictMode>
)
