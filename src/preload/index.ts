import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { BlinkConfig, OverlayState, OverlayToast, StressSnapshot } from '../shared/monitor'

// Custom APIs for renderer
const api = {
  getSystemInfo: () => ipcRenderer.invoke('system:getInfo'),
  getStressSnapshot: () => ipcRenderer.invoke('stress:getSnapshot') as Promise<StressSnapshot>,
  requestBreak: () => ipcRenderer.invoke('break:request') as Promise<void>,
  setBlinkConfig: (config: BlinkConfig) => ipcRenderer.invoke('blink:setConfig', config),
  skipBlink: () => ipcRenderer.invoke('blink:skip') as Promise<void>,
  snoozeBlink: () => ipcRenderer.invoke('blink:snooze') as Promise<void>,
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
