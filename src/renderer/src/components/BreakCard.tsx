type BreakCardProps = {
  isBreakActive: boolean
  breakEndsAt: number | null
  onStartBreak: () => void
  breakEnabled: boolean
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
  onStartBreak,
  breakEnabled
}: BreakCardProps): React.JSX.Element => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Break timer</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {!breakEnabled ? 'Disabled' : isBreakActive ? formatCountdown(breakEndsAt) : 'Ready'}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure break interval and duration in Preferences.
        </p>
      </div>
      <button
        className={`rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200 ${
          breakEnabled
            ? 'hover:border-slate-300 dark:hover:border-slate-500/60'
            : 'cursor-not-allowed opacity-60'
        }`}
        onClick={onStartBreak}
        disabled={!breakEnabled}
        type="button"
      >
        {breakEnabled ? 'Start a break now' : 'Break activity disabled'}
        <span className="block text-xs font-normal text-slate-500 dark:text-slate-400">
          {breakEnabled ? 'Start the configured break session' : 'Enable from Preferences'}
        </span>
      </button>
    </div>
  )
}
