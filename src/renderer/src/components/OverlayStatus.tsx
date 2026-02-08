import type { StressSnapshot } from '../../../shared/monitor'

type OverlayStatusProps = {
  snapshot: StressSnapshot
}

export const OverlayStatus = ({ snapshot }: OverlayStatusProps): React.JSX.Element => {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur-2xl dark:border-slate-700/60 dark:bg-slate-900/70">
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Ghost overlay</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        {snapshot.isBreakActive
          ? 'Break mode: screen is locked with exercises.'
          : 'Normal mode: invisible and click-through.'}
      </p>
    </div>
  )
}
