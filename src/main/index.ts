import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  screen,
  Menu,
  Tray,
  nativeImage,
  Notification
} from 'electron'
import os from 'os'
import { join } from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { createStressMonitor } from './stressMonitor'
import type {
  BlinkConfig,
  DrinkConfig,
  HydrationConfig,
  OverlayState,
  OverlayToast,
  StressSnapshot
} from '../shared/monitor'

let mainWindow: BrowserWindow | null = null
let overlayWindow: BrowserWindow | null = null
let stressMonitor: ReturnType<typeof createStressMonitor> | null = null
let tray: Tray | null = null
let isQuitting = false

const getAutoStartStatus = (): boolean => {
  if (!app.isPackaged) return false
  return app.getLoginItemSettings().openAtLogin
}

const setAutoStartStatus = (enabled: boolean): boolean => {
  if (!app.isPackaged) {
    // Prevent bad startup entries that can launch raw Electron in dev mode.
    app.setLoginItemSettings({ openAtLogin: false })
    return false
  }

  if (process.platform === 'win32') {
    app.setLoginItemSettings({
      openAtLogin: enabled,
      path: process.execPath
    })
  } else {
    app.setLoginItemSettings({ openAtLogin: enabled })
  }

  return app.getLoginItemSettings().openAtLogin
}

type AppPreferences = {
  notificationsEnabled: boolean
}

const defaultAppPreferences: AppPreferences = {
  notificationsEnabled: true
}

const preferencesPath = join(app.getPath('userData'), 'preferences.json')

const readPreferences = (): AppPreferences => {
  try {
    if (!existsSync(preferencesPath)) return defaultAppPreferences
    const raw = readFileSync(preferencesPath, 'utf-8')
    const parsed = JSON.parse(raw) as Partial<AppPreferences>
    return {
      ...defaultAppPreferences,
      ...parsed
    }
  } catch {
    return defaultAppPreferences
  }
}

const writePreferences = (preferences: AppPreferences): void => {
  try {
    writeFileSync(preferencesPath, JSON.stringify(preferences, null, 2), 'utf-8')
  } catch {
    // Ignore write failures and continue with in-memory state.
  }
}

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
  isHydrationActive: false,
  hydrationEndsAt: null,
  isDrinkActive: false,
  drinkEndsAt: null,
  nextBreakAt: Date.now() + 45 * 60 * 1000,
  nextBlinkAt: Date.now() + 12 * 60 * 1000,
  nextHydrationAt: Date.now() + 45 * 60 * 1000,
  nextDrinkAt: Date.now() + 120 * 60 * 1000,
  lastBreakAt: null,
  lastHydrationAt: null,
  lastDrinkAt: null,
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

const getIconPath = (filename: string): string => {
  if (app.isPackaged) {
    return join(process.resourcesPath, 'icons', filename)
  }
  return join(app.getAppPath(), 'build', 'icons', filename)
}

const getTrayIconPath = (): string => getIconPath('32x32.png')

const getWindowIconPath = (): string =>
  process.platform === 'win32' ? getIconPath('icon.ico') : getIconPath('256x256.png')

const showMainWindow = (): void => {
  if (!mainWindow) return
  mainWindow.setSkipTaskbar(false)
  if (mainWindow.isMinimized()) {
    mainWindow.restore()
  }
  mainWindow.show()
  mainWindow.focus()
}

const hideMainWindowToTray = (): void => {
  if (!mainWindow) return
  mainWindow.hide()
  mainWindow.setSkipTaskbar(true)
}

const createTray = (): void => {
  if (tray) return
  const iconPath = getTrayIconPath()
  const iconImage = nativeImage.createFromPath(iconPath)
  const trayIcon = iconImage.isEmpty() ? nativeImage.createFromPath(getWindowIconPath()) : iconImage
  tray = new Tray(trayIcon)
  tray.setToolTip('Arokiyam')

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Arokiyam', click: () => showMainWindow() },
    { label: 'Hide', click: () => hideMainWindowToTray() },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true
        overlayWindow?.destroy()
        mainWindow?.close()
        app.quit()
      }
    }
  ])

  tray.setContextMenu(contextMenu)
  tray.on('double-click', () => showMainWindow())
}

const applyOverlayMode = (state: OverlayState): void => {
  if (!overlayWindow) return
  if (
    state.mode === 'break' ||
    state.mode === 'blink' ||
    state.mode === 'hydration' ||
    state.mode === 'drink'
  ) {
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
    icon: getWindowIconPath(),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  if (mainWindow) {
    mainWindow.on('ready-to-show', () => {
      mainWindow?.setSkipTaskbar(false)
      mainWindow?.show()
    })

    mainWindow.on('minimize' as 'close', (event) => {
      if (isQuitting) return
      event.preventDefault()
      hideMainWindowToTray()
    })

    mainWindow.on('close', (event) => {
      if (isQuitting) return
      event.preventDefault()
      hideMainWindowToTray()
    })

    mainWindow.on('closed', () => {
      mainWindow = null
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    loadRenderer(mainWindow, 'index.html')
  }
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
  // Ensure dev runs never register invalid startup entries.
  if (!app.isPackaged && app.getLoginItemSettings().openAtLogin) {
    app.setLoginItemSettings({ openAtLogin: false })
  }

  app.setName('Arokiyam')
  let appPreferences = readPreferences()

  if (Notification.isSupported() && appPreferences.notificationsEnabled) {
    const readyNotice = new Notification({
      title: app.getName(),
      body: 'Notifications are enabled.'
    })
    readyNotice.show()
  }

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
  let previousActivityMode: OverlayState['mode'] = 'normal'

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

    const activityStarted = previousActivityMode === 'normal' && state.mode !== 'normal'
    if (activityStarted && Notification.isSupported() && appPreferences.notificationsEnabled) {
      const activityLabel =
        state.mode === 'break'
          ? 'Break'
          : state.mode === 'blink'
            ? 'Blink'
            : state.mode === 'hydration'
              ? 'Hydration'
              : 'Drink'
      const notification = new Notification({
        title: `${app.getName()} reminder`,
        body: `${activityLabel} activity started.`
      })
      notification.show()
    }
    previousActivityMode = state.mode
  })

  stressMonitor.onOverlayToast((toast: OverlayToast) => {
    broadcast('overlay:toast', toast)
  })

  ipcMain.handle('stress:getSnapshot', () => stressMonitor?.getSnapshot() ?? getEmptySnapshot())
  ipcMain.handle('break:request', () => stressMonitor?.requestBreak())
  ipcMain.handle('break:skip', () => stressMonitor?.skipBreak())
  ipcMain.handle('blink:request', () => stressMonitor?.requestBlink())
  ipcMain.handle('blink:setConfig', (_event, config: BlinkConfig) =>
    stressMonitor?.setBlinkConfig(config)
  )
  ipcMain.handle('blink:skip', () => stressMonitor?.skipBlink())
  ipcMain.handle('blink:snooze', () => stressMonitor?.snoozeBlink())
  ipcMain.handle('hydration:request', () => stressMonitor?.requestHydration())
  ipcMain.handle('hydration:setConfig', (_event, config: HydrationConfig) =>
    stressMonitor?.setHydrationConfig(config)
  )
  ipcMain.handle('hydration:complete', () => stressMonitor?.completeHydration())
  ipcMain.handle('hydration:snooze', () => stressMonitor?.snoozeHydration())
  ipcMain.handle('drink:request', () => stressMonitor?.requestDrink())
  ipcMain.handle('drink:setConfig', (_event, config: DrinkConfig) =>
    stressMonitor?.setDrinkConfig(config)
  )
  ipcMain.handle('drink:complete', () => stressMonitor?.completeDrink())
  ipcMain.handle('drink:snooze', () => stressMonitor?.snoozeDrink())

  ipcMain.handle('settings:getAutoStart', () => getAutoStartStatus())
  ipcMain.handle('settings:setAutoStart', (_event, enabled: boolean) => setAutoStartStatus(enabled))
  ipcMain.handle('settings:getNotificationsEnabled', () => appPreferences.notificationsEnabled)
  ipcMain.handle('settings:setNotificationsEnabled', (_event, enabled: boolean) => {
    appPreferences = { ...appPreferences, notificationsEnabled: enabled }
    writePreferences(appPreferences)
    if (enabled && Notification.isSupported()) {
      const notification = new Notification({
        title: app.getName(),
        body: 'Notifications enabled.'
      })
      notification.show()
    }
    return appPreferences.notificationsEnabled
  })

  createWindow()
  createOverlayWindow()
  createTray()
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
  isQuitting = true
  stressMonitor?.stop()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
