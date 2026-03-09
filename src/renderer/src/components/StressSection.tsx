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
  blinkEnabled: boolean
  hydrationEnabled: boolean
  drinkEnabled: boolean
}

export const StressSection = ({
  snapshot,
  onStartBreak,
  onStartBlink,
  onStartHydration,
  onStartDrink,
  blinkEnabled,
  hydrationEnabled,
  drinkEnabled
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
        blinkEnabled={blinkEnabled}
        hydrationEnabled={hydrationEnabled}
        drinkEnabled={drinkEnabled}
      />
      <OverlayStatus snapshot={snapshot} />
    </div>
  )
}
