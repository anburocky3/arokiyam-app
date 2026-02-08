type BreakCardProps = {
  isBreakActive: boolean
  breakEndsAt: number | null
  onStartBreak: () => void
}

const formatCountdown = (endTime: number | null): string => {
  if (!endTime) return '--:--'
  const remaining = Math.max(0, endTime - Date.now())
  const totalSeconds = Math.ceil(remaining / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export const BreakCard = ({
  isBreakActive,
  breakEndsAt,
  onStartBreak
}: BreakCardProps): React.JSX.Element => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Break timer</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {isBreakActive ? formatCountdown(breakEndsAt) : 'Ready'}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Randomized breaks between 45-75 minutes.
        </p>
      </div>
      <button
        className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-500/60"
        onClick={onStartBreak}
        type="button"
      >
        Start a break now
        <span className="block text-xs font-normal text-slate-500 dark:text-slate-400">
          Force a 60 second reset
        </span>
      </button>
    </div>
  )
}
