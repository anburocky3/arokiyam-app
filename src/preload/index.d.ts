import { ElectronAPI } from '@electron-toolkit/preload'
import type {
  ActivityPacingConfig,
  BlinkConfig,
  BreakConfig,
  DrinkConfig,
  HydrationConfig,
  OverlayState,
  OverlayToast,
  StressSnapshot
} from '../shared/monitor'

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
      getAppBuildInfo: () => Promise<{ version: string; channel: 'development' | 'production' }>
      getAutoStart: () => Promise<boolean>
      setAutoStart: (enabled: boolean) => Promise<boolean>
      getNotificationsEnabled: () => Promise<boolean>
      setNotificationsEnabled: (enabled: boolean) => Promise<boolean>
      getQuietHoursEnabled: () => Promise<boolean>
      setQuietHoursEnabled: (enabled: boolean) => Promise<boolean>
      getDisplayName: () => Promise<string>
      setDisplayName: (name: string) => Promise<string>
      getUpdateState: () => Promise<{ packaged: boolean; updateReady: boolean }>
      checkForUpdates: () => Promise<{ updateReady: boolean; message: string }>
      installUpdateNow: () => Promise<{ started: boolean; message: string }>
      getStressSnapshot: () => Promise<StressSnapshot>
      setBreakConfig: (config: BreakConfig) => Promise<void>
      requestBreak: () => Promise<void>
      skipBreak: () => Promise<void>
      requestBlink: () => Promise<void>
      setBlinkConfig: (config: BlinkConfig) => Promise<void>
      skipBlink: () => Promise<void>
      snoozeBlink: () => Promise<void>
      requestHydration: () => Promise<void>
      setHydrationConfig: (config: HydrationConfig) => Promise<void>
      completeHydration: () => Promise<void>
      snoozeHydration: () => Promise<void>
      requestDrink: () => Promise<void>
      setDrinkConfig: (config: DrinkConfig) => Promise<void>
      completeDrink: () => Promise<void>
      snoozeDrink: () => Promise<void>
      setActivityPacingConfig: (config: ActivityPacingConfig) => Promise<void>
      onStressUpdate: (callback: (snapshot: StressSnapshot) => void) => () => void
      onOverlayState: (callback: (state: OverlayState) => void) => () => void
      onOverlayToast: (callback: (toast: OverlayToast) => void) => () => void
    }
  }
}
