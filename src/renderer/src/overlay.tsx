import './assets/main.css'

import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { OverlayState, OverlayToast } from '../../shared/monitor'

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
}

const OverlayApp = (): React.JSX.Element => {
  const [overlayState, setOverlayState] = useState<OverlayViewState>({
    state: { mode: 'normal', breakEndsAt: null, blinkEndsAt: null, breathingActive: false },
    toast: null
  })
  const [, setTick] = useState(0)

  useEffect(() => {
    const unsubscribeState = window.api.onOverlayState((state) => {
      setOverlayState((prev) => ({ ...prev, state }))
    })
    const unsubscribeToast = window.api.onOverlayToast((toast) => {
      setOverlayState((prev) => ({ ...prev, toast }))
    })
    return () => {
      unsubscribeState()
      unsubscribeToast()
    }
  }, [])

  useEffect(() => {
    const id = setInterval(() => setTick((value) => value + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const isBreakMode = overlayState.state.mode === 'break'
  const isBlinkMode = overlayState.state.mode === 'blink'
  const countdown = formatCountdown(
    isBlinkMode ? overlayState.state.blinkEndsAt : overlayState.state.breakEndsAt
  )

  const toastVisible = overlayState.toast && overlayState.toast.expiresAt > Date.now()

  return (
    <div
      className={`min-h-screen w-full font-['Space_Grotesk'] transition-colors duration-300 ${
        isBreakMode || isBlinkMode ? 'bg-black/95 text-white' : 'bg-transparent text-white'
      }`}
    >
      {toastVisible && (
        <div className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 rounded-full bg-black/70 px-6 py-2 text-sm font-medium text-white shadow-lg">
          {overlayState.toast?.message}
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
            <button
              className="rounded-full border border-white/40 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/70"
              onClick={() => void window.api.skipBlink()}
              type="button"
            >
              Skip
            </button>
            <button
              className="rounded-full border border-white/40 bg-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/70"
              onClick={() => void window.api.snoozeBlink()}
              type="button"
            >
              Snooze
            </button>
          </div>
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
