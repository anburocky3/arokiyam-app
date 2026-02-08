type EnergyBarProps = {
  value: number
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const getBarColor = (value: number): string => {
  if (value >= 70) return 'from-emerald-400 via-emerald-300 to-emerald-500'
  if (value >= 40) return 'from-amber-400 via-amber-300 to-amber-500'
  return 'from-rose-400 via-rose-300 to-rose-500'
}

export const EnergyBar = ({ value }: EnergyBarProps): React.JSX.Element => {
  const safeValue = clamp(value, 0, 100)
  const barColor = getBarColor(safeValue)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Health battery</p>
        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {safeValue.toFixed(0)}%
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-slate-200/70 dark:bg-slate-800/70">
        <div
          className={`h-3 rounded-full bg-gradient-to-r ${barColor} transition-[width] duration-500`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Recharges after a completed break.
      </p>
    </div>
  )
}
