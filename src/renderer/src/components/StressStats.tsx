import { useEffect, useState } from 'react'
import type { StressSnapshot } from '../../../shared/monitor'

type StressStatsProps = {
  snapshot: StressSnapshot
  onStartBreak: () => void
  onStartBlink: () => void
  onStartHydration: () => void
  onStartDrink: () => void
}

const formatNumber = (value: number): string => Intl.NumberFormat().format(Math.round(value))

const formatCountdown = (target: number): string => {
  const remaining = Math.max(0, target - Date.now())
  const totalSeconds = Math.ceil(remaining / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const getActivityCountdown = (label: string, time: number | null): string => {
  if (!time) return `${label} · --:--`
  return `${label} · ${formatCountdown(time)}`
}

export const StressStats = ({
  snapshot,
  onStartBreak,
  onStartBlink,
  onStartHydration,
  onStartDrink
}: StressStatsProps): React.JSX.Element => {
  const [, setTick] = useState(0)
  const primaryActivity = snapshot.isBlinkActive
    ? { label: 'Blink ends in', time: snapshot.blinkEndsAt }
    : { label: 'Next blink', time: snapshot.nextBlinkAt }
  const secondaryActivity = snapshot.isBreakActive
    ? { label: 'Break ends in', time: snapshot.breakEndsAt }
    : { label: 'Next break', time: snapshot.nextBreakAt }
  const hydrationActivity = snapshot.isHydrationActive
    ? { label: 'Hydration ends in', time: snapshot.hydrationEndsAt }
    : { label: 'Next hydration', time: snapshot.nextHydrationAt }
  const drinkActivity = snapshot.isDrinkActive
    ? { label: 'Drink ends in', time: snapshot.drinkEndsAt }
    : { label: 'Next drink', time: snapshot.nextDrinkAt }
  const scrollMinutes = Math.floor(snapshot.scrollingStreakMs / 60000)

  const canStartBreak = !snapshot.isBreakActive
  const canStartBlink =
    !snapshot.isBreakActive &&
    !snapshot.isBlinkActive &&
    !snapshot.isHydrationActive &&
    !snapshot.isDrinkActive
  const canStartHydration =
    !snapshot.isBreakActive &&
    !snapshot.isBlinkActive &&
    !snapshot.isHydrationActive &&
    !snapshot.isDrinkActive
  const canStartDrink =
    !snapshot.isBreakActive &&
    !snapshot.isBlinkActive &&
    !snapshot.isHydrationActive &&
    !snapshot.isDrinkActive

  const actionButtonBase =
    'rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2 text-left text-xs font-semibold text-slate-700 transition dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200'
  const actionButtonEnabled = 'hover:border-slate-300 dark:hover:border-slate-500/60'
  const actionButtonDisabled = 'cursor-not-allowed opacity-60'

  useEffect(() => {
    const id = setInterval(() => setTick((value) => value + 1), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Keys per minute
        </p>
        <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
          {formatNumber(snapshot.kpm)}
        </p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Mouse travel / min
        </p>
        <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
          {formatNumber(snapshot.mouseDistancePerMin)} px
        </p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Wrist odometer
        </p>
        <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
          {formatNumber(snapshot.totalMouseDistance)} px
        </p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Next activity
        </p>
        <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
          {getActivityCountdown(primaryActivity.label, primaryActivity.time)}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          {getActivityCountdown(secondaryActivity.label, secondaryActivity.time)}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          {getActivityCountdown(hydrationActivity.label, hydrationActivity.time)}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          {getActivityCountdown(drinkActivity.label, drinkActivity.time)}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Randomized based on stress · Scroll streak {scrollMinutes} min
        </p>
        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Quick actions
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <button
              className={`${actionButtonBase} ${
                canStartBlink ? actionButtonEnabled : actionButtonDisabled
              }`}
              onClick={onStartBlink}
              disabled={!canStartBlink}
              type="button"
            >
              Start blink
            </button>
            <button
              className={`${actionButtonBase} ${
                canStartBreak ? actionButtonEnabled : actionButtonDisabled
              }`}
              onClick={onStartBreak}
              disabled={!canStartBreak}
              type="button"
            >
              Start break
            </button>
            <button
              className={`${actionButtonBase} ${
                canStartHydration ? actionButtonEnabled : actionButtonDisabled
              }`}
              onClick={onStartHydration}
              disabled={!canStartHydration}
              type="button"
            >
              Start hydration
            </button>
            <button
              className={`${actionButtonBase} ${
                canStartDrink ? actionButtonEnabled : actionButtonDisabled
              }`}
              onClick={onStartDrink}
              disabled={!canStartDrink}
              type="button"
            >
              Start drink
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
