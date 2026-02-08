import { ElectronAPI } from '@electron-toolkit/preload'
import type { BlinkConfig, OverlayState, OverlayToast, StressSnapshot } from '../shared/monitor'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getSystemInfo: () => Promise<{
        hostname: string
        platform: string
        release: string
        arch: string
        totalMem: number
        freeMem: number
        uptime: number
      }>
      getStressSnapshot: () => Promise<StressSnapshot>
      requestBreak: () => Promise<void>
      setBlinkConfig: (config: BlinkConfig) => Promise<void>
      skipBlink: () => Promise<void>
      snoozeBlink: () => Promise<void>
      onStressUpdate: (callback: (snapshot: StressSnapshot) => void) => () => void
      onOverlayState: (callback: (state: OverlayState) => void) => () => void
      onOverlayToast: (callback: (toast: OverlayToast) => void) => () => void
    }
  }
}
