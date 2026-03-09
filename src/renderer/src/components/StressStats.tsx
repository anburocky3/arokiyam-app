import { useEffect, useState } from 'react'
import type { StressSnapshot } from '../../../shared/monitor'

type StressStatsProps = {
  snapshot: StressSnapshot
  onStartBreak: () => void
  onStartBlink: () => void
  onStartHydration: () => void
  onStartDrink: () => void
  blinkEnabled: boolean
  hydrationEnabled: boolean
  drinkEnabled: boolean
}

const formatNumber = (value: number): string => Intl.NumberFormat().format(Math.round(value))

const formatCountdown = (target: number): string => {
  const remaining = Math.max(0, target - Date.now())
  const totalSeconds = Math.ceil(remaining / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const formatHumanRemaining = (target: number): string => {
  const remaining = Math.max(0, target - Date.now())
  const totalSeconds = Math.ceil(remaining / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0 && minutes > 0) return `${hours} hr ${minutes} min`
  if (hours > 0) return `${hours} hr`
  if (minutes > 0) return `${minutes} min`
  return `${seconds} sec`
}

const getActivityTime = (time: number | null): string => {
  if (!time) return '--:--'
  return formatCountdown(time)
}

const getActivityHumanTime = (time: number | null): string => {
  if (!time) return '--'
  return formatHumanRemaining(time)
}

export const StressStats = ({
  snapshot,
  onStartBreak,
  onStartBlink,
  onStartHydration,
  onStartDrink,
  blinkEnabled,
  hydrationEnabled,
  drinkEnabled
}: StressStatsProps): React.JSX.Element => {
  const [, setTick] = useState(0)
  const primaryActivity = !blinkEnabled
    ? { label: 'Blink disabled', time: null }
    : snapshot.isBlinkActive
      ? { label: 'Blink ends in', time: snapshot.blinkEndsAt }
      : { label: 'Next blink', time: snapshot.nextBlinkAt }
  const secondaryActivity = snapshot.isBreakActive
    ? { label: 'Break ends in', time: snapshot.breakEndsAt }
    : { label: 'Next break', time: snapshot.nextBreakAt }
  const hydrationActivity = !hydrationEnabled
    ? { label: 'Hydration disabled', time: null }
    : snapshot.isHydrationActive
      ? { label: 'Hydration ends in', time: snapshot.hydrationEndsAt }
      : { label: 'Next hydration', time: snapshot.nextHydrationAt }
  const drinkActivity = !drinkEnabled
    ? { label: 'Drink disabled', time: null }
    : snapshot.isDrinkActive
      ? { label: 'Drink ends in', time: snapshot.drinkEndsAt }
      : { label: 'Next drink', time: snapshot.nextDrinkAt }
  const scrollMinutes = Math.floor(snapshot.scrollingStreakMs / 60000)

  const canStartBreak = !snapshot.isBreakActive
  const canStartBlink =
    blinkEnabled &&
    !snapshot.isBreakActive &&
    !snapshot.isBlinkActive &&
    !snapshot.isHydrationActive &&
    !snapshot.isDrinkActive
  const canStartHydration =
    hydrationEnabled &&
    !snapshot.isBreakActive &&
    !snapshot.isBlinkActive &&
    !snapshot.isHydrationActive &&
    !snapshot.isDrinkActive
  const canStartDrink =
    drinkEnabled &&
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
    <div className="grid gap-4 md:grid-cols-3">
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
      <div className="">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Wrist odometer
        </p>
        <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
          {formatNumber(snapshot.totalMouseDistance)} px
        </p>
      </div>
      <div className="col-span-3">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Next activity
        </p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-rose-200/70 bg-linear-to-br from-rose-100 to-orange-100 p-4 dark:border-rose-500/30 dark:from-rose-500/20 dark:to-orange-500/20">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-700 dark:text-rose-200">
                {secondaryActivity.label}
              </p>
              <button
                className={`${actionButtonBase} px-2 py-1 text-[11px] ${
                  canStartBreak ? actionButtonEnabled : actionButtonDisabled
                }`}
                onClick={onStartBreak}
                disabled={!canStartBreak}
                type="button"
              >
                Break now
              </button>
            </div>
            <p className="mt-2 text-2xl font-bold text-rose-900 dark:text-white">
              {getActivityTime(secondaryActivity.time)}
            </p>
            <p className="mt-1 text-xs font-semibold text-rose-700/80 dark:text-rose-200/90">
              in {getActivityHumanTime(secondaryActivity.time)}
            </p>
          </div>
          <div className="rounded-2xl border border-indigo-200/70 bg-linear-to-br from-indigo-100 to-sky-100 p-4 dark:border-indigo-500/30 dark:from-indigo-500/25 dark:to-sky-500/20">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-700 dark:text-indigo-200">
                {primaryActivity.label}
              </p>
              <button
                className={`${actionButtonBase} px-2 py-1 text-[11px] ${
                  canStartBlink ? actionButtonEnabled : actionButtonDisabled
                }`}
                onClick={onStartBlink}
                disabled={!canStartBlink}
                type="button"
              >
                {blinkEnabled ? 'Blink now' : 'Disabled'}
              </button>
            </div>
            <p className="mt-2 text-2xl font-bold text-indigo-900 dark:text-white">
              {getActivityTime(primaryActivity.time)}
            </p>
            <p className="mt-1 text-xs font-semibold text-indigo-700/80 dark:text-indigo-200/90">
              {blinkEnabled
                ? `in ${getActivityHumanTime(primaryActivity.time)}`
                : 'Enable in Preferences'}
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-200/70 bg-linear-to-br from-cyan-100 to-teal-100 p-4 dark:border-cyan-500/30 dark:from-cyan-500/20 dark:to-emerald-500/20">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-200">
                {hydrationActivity.label}
              </p>
              <button
                className={`${actionButtonBase} px-2 py-1 text-[11px] ${
                  canStartHydration ? actionButtonEnabled : actionButtonDisabled
                }`}
                onClick={onStartHydration}
                disabled={!canStartHydration}
                type="button"
              >
                {hydrationEnabled ? 'Hydrate now' : 'Disabled'}
              </button>
            </div>
            <p className="mt-2 text-2xl font-bold text-cyan-900 dark:text-white">
              {getActivityTime(hydrationActivity.time)}
            </p>
            <p className="mt-1 text-xs font-semibold text-cyan-700/80 dark:text-cyan-200/90">
              {hydrationEnabled
                ? `in ${getActivityHumanTime(hydrationActivity.time)}`
                : 'Enable in Preferences'}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200/70 bg-linear-to-br from-amber-100 to-lime-100 p-4 dark:border-amber-500/30 dark:from-amber-500/20 dark:to-lime-500/20">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-200">
                {drinkActivity.label}
              </p>
              <button
                className={`${actionButtonBase} px-2 py-1 text-[11px] ${
                  canStartDrink ? actionButtonEnabled : actionButtonDisabled
                }`}
                onClick={onStartDrink}
                disabled={!canStartDrink}
                type="button"
              >
                {drinkEnabled ? 'Drink now' : 'Disabled'}
              </button>
            </div>
            <p className="mt-2 text-2xl font-bold text-amber-900 dark:text-white">
              {getActivityTime(drinkActivity.time)}
            </p>
            <p className="mt-1 text-xs font-semibold text-amber-700/80 dark:text-amber-200/90">
              {drinkEnabled
                ? `in ${getActivityHumanTime(drinkActivity.time)}`
                : 'Enable in Preferences'}
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 ml-2">
          Randomized based on stress · Scroll streak {scrollMinutes} min
        </p>
      </div>
    </div>
  )
}
