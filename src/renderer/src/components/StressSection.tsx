import type { StressSnapshot } from '../../../shared/monitor'
import { OverlayStatus } from './OverlayStatus'
import { StressPanel } from './StressPanel'
import { StressPanelError } from './StressPanelError'
import { StressPanelSkeleton } from './StressPanelSkeleton'

type StressSectionProps = {
  snapshot: StressSnapshot | null | undefined
  onStartBreak: () => void
  onStartBlink: () => void
  onStartHydration: () => void
  onStartDrink: () => void
}

export const StressSection = ({
  snapshot,
  onStartBreak,
  onStartBlink,
  onStartHydration,
  onStartDrink
}: StressSectionProps): React.JSX.Element => {
  if (snapshot === null) return <StressPanelError />
  if (!snapshot) return <StressPanelSkeleton />

  return (
    <div className="space-y-6">
      <StressPanel
        snapshot={snapshot}
        onStartBreak={onStartBreak}
        onStartBlink={onStartBlink}
        onStartHydration={onStartHydration}
        onStartDrink={onStartDrink}
      />
      <OverlayStatus snapshot={snapshot} />
    </div>
  )
}
