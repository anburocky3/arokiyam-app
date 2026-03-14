import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
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

// Custom APIs for renderer
const api = {
  getSystemInfo: () => ipcRenderer.invoke('system:getInfo'),
  getAppBuildInfo: () =>
    ipcRenderer.invoke('app:getBuildInfo') as Promise<{
      version: string
      channel: 'development' | 'production'
    }>,
  getAutoStart: () => ipcRenderer.invoke('settings:getAutoStart') as Promise<boolean>,
  setAutoStart: (enabled: boolean) =>
    ipcRenderer.invoke('settings:setAutoStart', enabled) as Promise<boolean>,
  getNotificationsEnabled: () =>
    ipcRenderer.invoke('settings:getNotificationsEnabled') as Promise<boolean>,
  setNotificationsEnabled: (enabled: boolean) =>
    ipcRenderer.invoke('settings:setNotificationsEnabled', enabled) as Promise<boolean>,
  getQuietHoursEnabled: () =>
    ipcRenderer.invoke('settings:getQuietHoursEnabled') as Promise<boolean>,
  setQuietHoursEnabled: (enabled: boolean) =>
    ipcRenderer.invoke('settings:setQuietHoursEnabled', enabled) as Promise<boolean>,
  getDisplayName: () => ipcRenderer.invoke('settings:getDisplayName') as Promise<string>,
  setDisplayName: (name: string) =>
    ipcRenderer.invoke('settings:setDisplayName', name) as Promise<string>,
  getUpdateState: () =>
    ipcRenderer.invoke('update:state') as Promise<{ packaged: boolean; updateReady: boolean }>,
  checkForUpdates: () =>
    ipcRenderer.invoke('update:check') as Promise<{ updateReady: boolean; message: string }>,
  installUpdateNow: () =>
    ipcRenderer.invoke('update:install') as Promise<{ started: boolean; message: string }>,
  getStressSnapshot: () => ipcRenderer.invoke('stress:getSnapshot') as Promise<StressSnapshot>,
  setBreakConfig: (config: BreakConfig) => ipcRenderer.invoke('break:setConfig', config),
  requestBreak: () => ipcRenderer.invoke('break:request') as Promise<void>,
  skipBreak: () => ipcRenderer.invoke('break:skip') as Promise<void>,
  requestBlink: () => ipcRenderer.invoke('blink:request') as Promise<void>,
  setBlinkConfig: (config: BlinkConfig) => ipcRenderer.invoke('blink:setConfig', config),
  skipBlink: () => ipcRenderer.invoke('blink:skip') as Promise<void>,
  snoozeBlink: () => ipcRenderer.invoke('blink:snooze') as Promise<void>,
  requestHydration: () => ipcRenderer.invoke('hydration:request') as Promise<void>,
  setHydrationConfig: (config: HydrationConfig) =>
    ipcRenderer.invoke('hydration:setConfig', config),
  completeHydration: () => ipcRenderer.invoke('hydration:complete') as Promise<void>,
  snoozeHydration: () => ipcRenderer.invoke('hydration:snooze') as Promise<void>,
  requestDrink: () => ipcRenderer.invoke('drink:request') as Promise<void>,
  setDrinkConfig: (config: DrinkConfig) => ipcRenderer.invoke('drink:setConfig', config),
  completeDrink: () => ipcRenderer.invoke('drink:complete') as Promise<void>,
  snoozeDrink: () => ipcRenderer.invoke('drink:snooze') as Promise<void>,
  setActivityPacingConfig: (config: ActivityPacingConfig) =>
    ipcRenderer.invoke('activity:setPacingConfig', config),
  onStressUpdate: (callback: (snapshot: StressSnapshot) => void): (() => void) => {
    const listener = (_event: IpcRendererEvent, snapshot: StressSnapshot): void => {
      callback(snapshot)
    }
    ipcRenderer.on('stress:update', listener)
    return () => ipcRenderer.removeListener('stress:update', listener)
  },
  onOverlayState: (callback: (state: OverlayState) => void): (() => void) => {
    const listener = (_event: IpcRendererEvent, state: OverlayState): void => {
      callback(state)
    }
    ipcRenderer.on('overlay:state', listener)
    return () => ipcRenderer.removeListener('overlay:state', listener)
  },
  onOverlayToast: (callback: (toast: OverlayToast) => void): (() => void) => {
    const listener = (_event: IpcRendererEvent, toast: OverlayToast): void => {
      callback(toast)
    }
    ipcRenderer.on('overlay:toast', listener)
    return () => ipcRenderer.removeListener('overlay:toast', listener)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
