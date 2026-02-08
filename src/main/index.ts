import { app, shell, BrowserWindow, ipcMain, screen } from 'electron'
import os from 'os'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { createStressMonitor } from './stressMonitor'
import type { BlinkConfig, OverlayState, OverlayToast, StressSnapshot } from '../shared/monitor'

let mainWindow: BrowserWindow | null = null
let overlayWindow: BrowserWindow | null = null
let stressMonitor: ReturnType<typeof createStressMonitor> | null = null

const getEmptySnapshot = (): StressSnapshot => ({
  kpm: 0,
  mouseDistancePerMin: 0,
  totalMouseDistance: 0,
  energy: 100,
  stressLevel: 0,
  isBreakActive: false,
  breakEndsAt: null,
  isBlinkActive: false,
  blinkEndsAt: null,
  nextBreakAt: Date.now() + 45 * 60 * 1000,
  nextBlinkAt: Date.now() + 12 * 60 * 1000,
  lastBreakAt: null,
  scrollingStreakMs: 0
})

const loadRenderer = (window: BrowserWindow, html: string): void => {
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    const baseUrl = process.env['ELECTRON_RENDERER_URL']
    const url = new URL(html, baseUrl).toString()
    window.loadURL(url)
  } else {
    window.loadFile(join(__dirname, '../renderer', html))
  }
}

const applyOverlayMode = (state: OverlayState): void => {
  if (!overlayWindow) return
  if (state.mode === 'break' || state.mode === 'blink') {
    overlayWindow.setIgnoreMouseEvents(false)
    overlayWindow.setFocusable(true)
    overlayWindow.show()
    overlayWindow.focus()
  } else {
    overlayWindow.setIgnoreMouseEvents(true, { forward: true })
    overlayWindow.setFocusable(false)
    overlayWindow.showInactive()
  }
}

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: 'Arokiyam v0.1.0',
    width: 900,
    height: 670,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#0b0b0f',
    transparent: false,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  loadRenderer(mainWindow, 'index.html')
}

function createOverlayWindow(): void {
  const { width, height } = screen.getPrimaryDisplay().bounds
  overlayWindow = new BrowserWindow({
    title: 'Arokiyam Overlay',
    width,
    height,
    transparent: true,
    frame: false,
    show: false,
    resizable: false,
    movable: false,
    fullscreen: true,
    skipTaskbar: true,
    alwaysOnTop: true,
    hasShadow: false,
    focusable: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  overlayWindow.setAlwaysOnTop(true, 'screen-saver')
  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
  overlayWindow.setIgnoreMouseEvents(true, { forward: true })

  overlayWindow.on('ready-to-show', () => {
    overlayWindow?.showInactive()
  })

  overlayWindow.on('closed', () => {
    overlayWindow = null
  })

  loadRenderer(overlayWindow, 'overlay.html')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('cdn.arokiyam')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('system:getInfo', () => {
    return {
      hostname: os.hostname(),
      platform: os.platform(),
      release: os.release(),
      arch: os.arch(),
      totalMem: os.totalmem(),
      freeMem: os.freemem(),
      uptime: os.uptime()
    }
  })

  stressMonitor = createStressMonitor()

  const broadcast = <T>(channel: string, payload: T): void => {
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send(channel, payload)
    })
  }

  stressMonitor.onUpdate((snapshot: StressSnapshot) => {
    broadcast('stress:update', snapshot)
  })

  stressMonitor.onOverlayState((state: OverlayState) => {
    broadcast('overlay:state', state)
    applyOverlayMode(state)
  })

  stressMonitor.onOverlayToast((toast: OverlayToast) => {
    broadcast('overlay:toast', toast)
  })

  ipcMain.handle('stress:getSnapshot', () => stressMonitor?.getSnapshot() ?? getEmptySnapshot())
  ipcMain.handle('break:request', () => stressMonitor?.requestBreak())
  ipcMain.handle('blink:setConfig', (_event, config: BlinkConfig) =>
    stressMonitor?.setBlinkConfig(config)
  )
  ipcMain.handle('blink:skip', () => stressMonitor?.skipBlink())
  ipcMain.handle('blink:snooze', () => stressMonitor?.snoozeBlink())

  createWindow()
  createOverlayWindow()
  stressMonitor.start()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
      createOverlayWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  stressMonitor?.stop()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
