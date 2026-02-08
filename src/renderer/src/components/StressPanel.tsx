import type { StressSnapshot } from '../../../shared/monitor'
import { BreakCard } from './BreakCard'
import { EnergyBar } from './EnergyBar'
import { StressStats } from './StressStats'

type StressPanelProps = {
  snapshot: StressSnapshot
  onStartBreak: () => void
}

export const StressPanel = ({ snapshot, onStartBreak }: StressPanelProps): React.JSX.Element => {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur-2xl dark:border-slate-700/60 dark:bg-slate-900/70">
        <EnergyBar value={snapshot.energy} />
      </div>
      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur-2xl dark:border-slate-700/60 dark:bg-slate-900/70">
        <BreakCard
          isBreakActive={snapshot.isBreakActive}
          breakEndsAt={snapshot.breakEndsAt}
          onStartBreak={onStartBreak}
        />
      </div>
      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur-2xl dark:border-slate-700/60 dark:bg-slate-900/70 lg:col-span-2">
        <StressStats snapshot={snapshot} />
      </div>
    </div>
  )
}
