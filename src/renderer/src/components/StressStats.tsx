import { useEffect, useState } from 'react'
import type { StressSnapshot } from '../../../shared/monitor'

type StressStatsProps = {
  snapshot: StressSnapshot
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

export const StressStats = ({ snapshot }: StressStatsProps): React.JSX.Element => {
  const [tick, setTick] = useState(0)
  const primaryActivity = snapshot.isBlinkActive
    ? { label: 'Blink ends in', time: snapshot.blinkEndsAt }
    : { label: 'Next blink', time: snapshot.nextBlinkAt }
  const secondaryActivity = snapshot.isBreakActive
    ? { label: 'Break ends in', time: snapshot.breakEndsAt }
    : { label: 'Next break', time: snapshot.nextBreakAt }
  const scrollMinutes = Math.floor(snapshot.scrollingStreakMs / 60000)

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
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Randomized based on stress · Scroll streak {scrollMinutes} min
        </p>
      </div>
    </div>
  )
}
