import { uIOhook } from 'uiohook-napi'
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

type Listener<T> = (payload: T) => void

type StressMonitor = {
  start: () => void
  stop: () => void
  setBreakConfig: (config: BreakConfig) => void
  requestBreak: () => void
  skipBreak: () => void
  requestBlink: () => void
  requestHydration: () => void
  requestDrink: () => void
  setBlinkConfig: (config: BlinkConfig) => void
  skipBlink: () => void
  snoozeBlink: () => void
  setHydrationConfig: (config: HydrationConfig) => void
  completeHydration: () => void
  snoozeHydration: () => void
  setDrinkConfig: (config: DrinkConfig) => void
  completeDrink: () => void
  snoozeDrink: () => void
  setActivityPacingConfig: (config: ActivityPacingConfig) => void
  getSnapshot: () => StressSnapshot
  onUpdate: (listener: Listener<StressSnapshot>) => () => void
  onOverlayState: (listener: Listener<OverlayState>) => () => void
  onOverlayToast: (listener: Listener<OverlayToast>) => () => void
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const randomInRange = (min: number, max: number): number =>
  Math.floor(min + Math.random() * (max - min))

const computeNextBreakMs = (config: BreakConfig, stressLevel: number): number => {
  const baseMin = config.minMinutes * 60 * 1000
  const baseMax = config.maxMinutes * 60 * 1000
  const adjustedMin = clamp(baseMin - stressLevel * 10 * 60 * 1000, 20 * 60 * 1000, baseMin)
  const adjustedMax = clamp(baseMax - stressLevel * 20 * 60 * 1000, adjustedMin, baseMax)
  return randomInRange(adjustedMin, adjustedMax)
}

const defaultBreakConfig: BreakConfig = {
  enabled: true,
  minMinutes: 45,
  maxMinutes: 75,
  durationSeconds: 60
}

const defaultBlinkConfig: BlinkConfig = {
  enabled: true,
  minMinutes: 15,
  maxMinutes: 22,
  durationSeconds: 8,
  snoozeMinutes: 5
}

const defaultHydrationConfig: HydrationConfig = {
  enabled: true,
  intervalMinutes: 60,
  durationSeconds: 30,
  snoozeMinutes: 15
}

const defaultDrinkConfig: DrinkConfig = {
  enabled: true,
  intervalMinutes: 180,
  durationSeconds: 30,
  snoozeMinutes: 30
}

const defaultActivityPacingConfig: ActivityPacingConfig = {
  minimumGapMinutes: 5
}

const clampBreakConfig = (config: BreakConfig): BreakConfig => {
  const minMinutes = clamp(Math.round(config.minMinutes), 20, 180)
  const maxMinutes = clamp(Math.round(config.maxMinutes), minMinutes, 240)
  const durationSeconds = clamp(Math.round(config.durationSeconds), 20, 300)

  return {
    enabled: config.enabled,
    minMinutes,
    maxMinutes,
    durationSeconds
  }
}

const clampConfig = (config: BlinkConfig): BlinkConfig => {
  const minMinutes = clamp(Math.round(config.minMinutes), 2, 60)
  const maxMinutes = clamp(Math.round(config.maxMinutes), minMinutes, 120)
  const durationSeconds = clamp(Math.round(config.durationSeconds), 3, 20)
  const snoozeMinutes = clamp(Math.round(config.snoozeMinutes), 1, 20)

  return {
    enabled: config.enabled,
    minMinutes,
    maxMinutes,
    durationSeconds,
    snoozeMinutes
  }
}

const clampHydrationConfig = (config: HydrationConfig): HydrationConfig => {
  const intervalMinutes = clamp(Math.round(config.intervalMinutes), 15, 180)
  const durationSeconds = clamp(Math.round(config.durationSeconds), 10, 120)
  const snoozeMinutes = clamp(Math.round(config.snoozeMinutes), 5, 60)

  return {
    enabled: config.enabled,
    intervalMinutes,
    durationSeconds,
    snoozeMinutes
  }
}

const clampDrinkConfig = (config: DrinkConfig): DrinkConfig => {
  const intervalMinutes = clamp(Math.round(config.intervalMinutes), 60, 240)
  const durationSeconds = clamp(Math.round(config.durationSeconds), 15, 180)
  const snoozeMinutes = clamp(Math.round(config.snoozeMinutes), 10, 120)

  return {
    enabled: config.enabled,
    intervalMinutes,
    durationSeconds,
    snoozeMinutes
  }
}

const clampActivityPacingConfig = (config: ActivityPacingConfig): ActivityPacingConfig => {
  const minimumGapMinutes = clamp(Math.round(config.minimumGapMinutes), 1, 60)
  return { minimumGapMinutes }
}

export const createStressMonitor = (): StressMonitor => {
  const updateListeners = new Set<Listener<StressSnapshot>>()
  const overlayListeners = new Set<Listener<OverlayState>>()
  const toastListeners = new Set<Listener<OverlayToast>>()

  const keyEvents: number[] = []
  const mouseEvents: Array<{ t: number; d: number }> = []
  let lastMousePosition: { x: number; y: number } | null = null
  let totalMouseDistance = 0
  let energy = 100
  let lastBreakAt: number | null = null
  let breakConfig = defaultBreakConfig
  let nextBreakAt = Date.now() + computeNextBreakMs(defaultBreakConfig, 0)
  let breakEndsAt: number | null = null
  let isBreakActive = false
  let lastStressLevel = 0
  let blinkConfig = defaultBlinkConfig
  let nextBlinkAt =
    Date.now() +
    randomInRange(
      defaultBlinkConfig.minMinutes * 60 * 1000,
      defaultBlinkConfig.maxMinutes * 60 * 1000
    )
  let blinkEndsAt: number | null = null
  let isBlinkActive = false
  let hydrationConfig = defaultHydrationConfig
  let nextHydrationAt = Date.now() + hydrationConfig.intervalMinutes * 60 * 1000
  let hydrationEndsAt: number | null = null
  let isHydrationActive = false
  let lastHydrationAt: number | null = null
  let drinkConfig = defaultDrinkConfig
  let nextDrinkAt = Date.now() + drinkConfig.intervalMinutes * 60 * 1000
  let drinkEndsAt: number | null = null
  let isDrinkActive = false
  let lastDrinkAt: number | null = null
  let activityPacingConfig = defaultActivityPacingConfig
  let nextActivityAllowedAt = Date.now()

  let lastScrollAt: number | null = null
  let scrollStreakStart: number | null = null
  let lastBlinkReminderAt: number | null = null

  let statsInterval: NodeJS.Timeout | null = null
  let breakInterval: NodeJS.Timeout | null = null
  let inputHookStarted = false

  const pruneEvents = (cutoff: number): void => {
    while (keyEvents.length && keyEvents[0] < cutoff) keyEvents.shift()
    while (mouseEvents.length && mouseEvents[0].t < cutoff) mouseEvents.shift()
  }

  const getKpm = (now: number): number => {
    const cutoff = now - 60_000
    pruneEvents(cutoff)
    return keyEvents.length
  }

  const getMouseDistancePerMin = (now: number): number => {
    const cutoff = now - 60_000
    pruneEvents(cutoff)
    return mouseEvents.reduce((total, event) => total + event.d, 0)
  }

  const getScrollingStreakMs = (now: number): number => {
    if (!scrollStreakStart || !lastScrollAt) return 0
    const isActive = now - lastScrollAt < 20_000
    return isActive ? now - scrollStreakStart : 0
  }

  const computeStressLevel = (kpm: number, mouseDistancePerMin: number): number => {
    const kpmScore = clamp(kpm / 220, 0, 1)
    const mouseScore = clamp(mouseDistancePerMin / 40_000, 0, 1)
    return clamp(kpmScore * 0.6 + mouseScore * 0.4, 0, 1)
  }

  const emitOverlayState = (): void => {
    let mode: OverlayState['mode'] = 'normal'
    if (isBreakActive) {
      mode = 'break'
    } else if (isBlinkActive) {
      mode = 'blink'
    } else if (isHydrationActive) {
      mode = 'hydration'
    } else if (isDrinkActive) {
      mode = 'drink'
    }

    const state: OverlayState = {
      mode,
      breakEndsAt,
      blinkEndsAt,
      hydrationEndsAt,
      drinkEndsAt,
      breathingActive: isBreakActive
    }
    overlayListeners.forEach((listener) => listener(state))
  }

  const scheduleNextBlink = (baseTime = Date.now()): void => {
    if (!blinkConfig.enabled) {
      nextBlinkAt = baseTime + 24 * 60 * 60 * 1000
      return
    }
    const minMs = blinkConfig.minMinutes * 60 * 1000
    const maxMs = blinkConfig.maxMinutes * 60 * 1000
    nextBlinkAt = baseTime + randomInRange(minMs, maxMs)
  }

  const scheduleNextHydration = (baseTime = Date.now()): void => {
    if (!hydrationConfig.enabled) {
      nextHydrationAt = baseTime + 24 * 60 * 60 * 1000
      return
    }
    nextHydrationAt = baseTime + hydrationConfig.intervalMinutes * 60 * 1000
  }

  const scheduleNextDrink = (baseTime = Date.now()): void => {
    if (!drinkConfig.enabled) {
      nextDrinkAt = baseTime + 24 * 60 * 60 * 1000
      return
    }
    nextDrinkAt = baseTime + drinkConfig.intervalMinutes * 60 * 1000
  }

  const emitToast = (message: string, durationMs = 10_000): void => {
    const toast: OverlayToast = {
      message,
      expiresAt: Date.now() + durationMs
    }
    toastListeners.forEach((listener) => listener(toast))
  }

  const markActivityStarted = (): void => {
    nextActivityAllowedAt = Date.now() + activityPacingConfig.minimumGapMinutes * 60 * 1000
  }

  const canStartAnotherActivity = (now = Date.now()): boolean => now >= nextActivityAllowedAt

  const startBreak = (
    durationMs = breakConfig.durationSeconds * 1000,
    ignorePacing = false
  ): void => {
    if (isBreakActive || (!ignorePacing && !canStartAnotherActivity())) return
    if (isBlinkActive) {
      isBlinkActive = false
      blinkEndsAt = null
    }
    if (isHydrationActive) {
      isHydrationActive = false
      hydrationEndsAt = null
      scheduleNextHydration(Date.now())
    }
    if (isDrinkActive) {
      isDrinkActive = false
      drinkEndsAt = null
      scheduleNextDrink(Date.now())
    }
    isBreakActive = true
    breakEndsAt = Date.now() + durationMs
    markActivityStarted()
    emitOverlayState()
  }

  const finishBreak = (): void => {
    isBreakActive = false
    lastBreakAt = Date.now()
    breakEndsAt = null
    energy = 100
    nextBreakAt = Date.now() + computeNextBreakMs(breakConfig, lastStressLevel)
    scheduleNextBlink(Date.now())
    scheduleNextHydration(Date.now())
    scheduleNextDrink(Date.now())
    emitOverlayState()
  }

  const startBlink = (ignorePacing = false): void => {
    if (
      isBlinkActive ||
      isBreakActive ||
      isHydrationActive ||
      isDrinkActive ||
      !blinkConfig.enabled ||
      (!ignorePacing && !canStartAnotherActivity())
    )
      return
    isBlinkActive = true
    blinkEndsAt = Date.now() + blinkConfig.durationSeconds * 1000
    markActivityStarted()
    emitOverlayState()
  }

  const startHydration = (ignorePacing = false): void => {
    if (
      isHydrationActive ||
      isBreakActive ||
      isBlinkActive ||
      isDrinkActive ||
      !hydrationConfig.enabled ||
      (!ignorePacing && !canStartAnotherActivity())
    )
      return
    isHydrationActive = true
    hydrationEndsAt = Date.now() + hydrationConfig.durationSeconds * 1000
    markActivityStarted()
    emitOverlayState()
  }

  const startDrink = (ignorePacing = false): void => {
    if (
      isDrinkActive ||
      isBreakActive ||
      isBlinkActive ||
      isHydrationActive ||
      !drinkConfig.enabled ||
      (!ignorePacing && !canStartAnotherActivity())
    )
      return
    isDrinkActive = true
    drinkEndsAt = Date.now() + drinkConfig.durationSeconds * 1000
    markActivityStarted()
    emitOverlayState()
  }

  const finishBlink = (scheduleFromNow = true): void => {
    isBlinkActive = false
    blinkEndsAt = null
    if (scheduleFromNow) scheduleNextBlink(Date.now())
    emitOverlayState()
  }

  const finishHydration = (scheduleFromNow = true, markCompleted = true): void => {
    isHydrationActive = false
    hydrationEndsAt = null
    if (markCompleted) lastHydrationAt = Date.now()
    if (scheduleFromNow) scheduleNextHydration(Date.now())
    emitOverlayState()
  }

  const finishDrink = (scheduleFromNow = true, markCompleted = true): void => {
    isDrinkActive = false
    drinkEndsAt = null
    if (markCompleted) lastDrinkAt = Date.now()
    if (scheduleFromNow) scheduleNextDrink(Date.now())
    emitOverlayState()
  }

  const tickEnergy = (stressLevel: number): void => {
    if (isBreakActive) return
    const baseDrainPerMinute = 0.4
    const stressDrainPerMinute = 3.2 * stressLevel
    const drainPerMinute = baseDrainPerMinute + stressDrainPerMinute
    const drainPerTick = drainPerMinute / 6
    energy = clamp(energy - drainPerTick, 0, 100)
  }

  const emitSnapshot = (): void => {
    const now = Date.now()
    const kpm = getKpm(now)
    const mouseDistancePerMin = getMouseDistancePerMin(now)
    const stressLevel = computeStressLevel(kpm, mouseDistancePerMin)
    const scrollingStreakMs = getScrollingStreakMs(now)

    lastStressLevel = stressLevel

    tickEnergy(stressLevel)

    const snapshot: StressSnapshot = {
      kpm,
      mouseDistancePerMin,
      totalMouseDistance,
      energy,
      stressLevel,
      isBreakActive,
      breakEndsAt,
      isBlinkActive,
      blinkEndsAt,
      isHydrationActive,
      hydrationEndsAt,
      isDrinkActive,
      drinkEndsAt,
      nextBreakAt,
      nextBlinkAt,
      nextHydrationAt,
      nextDrinkAt,
      lastBreakAt,
      lastHydrationAt,
      lastDrinkAt,
      scrollingStreakMs
    }

    updateListeners.forEach((listener) => listener(snapshot))

    if (scrollingStreakMs >= 15 * 60 * 1000) {
      const cooldownPassed = !lastBlinkReminderAt || now - lastBlinkReminderAt > 15 * 60 * 1000
      if (cooldownPassed) {
        lastBlinkReminderAt = now
        emitToast('Blink check! Take a moment to blink and relax your eyes.')
      }
    }
  }

  const start = (): void => {
    try {
      uIOhook.on('keydown', () => {
        keyEvents.push(Date.now())
      })

      uIOhook.on('mousemove', (event) => {
        if (!('x' in event) || !('y' in event)) return
        const position = event as { x: number; y: number }
        if (lastMousePosition) {
          const distance = Math.hypot(
            position.x - lastMousePosition.x,
            position.y - lastMousePosition.y
          )
          if (Number.isFinite(distance)) {
            totalMouseDistance += distance
            mouseEvents.push({ t: Date.now(), d: distance })
          }
        }
        lastMousePosition = { x: position.x, y: position.y }
      })

      uIOhook.on('mousewheel', () => {
        const now = Date.now()
        if (!scrollStreakStart || !lastScrollAt || now - lastScrollAt > 20_000) {
          scrollStreakStart = now
        }
        lastScrollAt = now
      })

      uIOhook.start()
      inputHookStarted = true
    } catch (error) {
      inputHookStarted = false
      console.error('Global input hook unavailable; continuing without activity tracking.', error)
    }

    statsInterval = setInterval(emitSnapshot, 10_000)
    breakInterval = setInterval(() => {
      const now = Date.now()
      if (isBreakActive && breakEndsAt && now >= breakEndsAt) {
        finishBreak()
      }
      if (isHydrationActive && hydrationEndsAt && now >= hydrationEndsAt) {
        finishHydration(true)
      }
      if (isDrinkActive && drinkEndsAt && now >= drinkEndsAt) {
        finishDrink(true)
      }
      if (!isBreakActive && !isBlinkActive && breakConfig.enabled && now >= nextBreakAt) {
        startBreak(breakConfig.durationSeconds * 1000)
      }
      if (isBlinkActive && blinkEndsAt && now >= blinkEndsAt) {
        finishBlink()
      }
      if (
        !isBreakActive &&
        !isBlinkActive &&
        !isHydrationActive &&
        blinkConfig.enabled &&
        now >= nextBlinkAt
      ) {
        startBlink()
      }
      if (
        !isBreakActive &&
        !isBlinkActive &&
        !isHydrationActive &&
        !isDrinkActive &&
        hydrationConfig.enabled &&
        now >= nextHydrationAt
      ) {
        startHydration()
      }
      if (
        !isBreakActive &&
        !isBlinkActive &&
        !isHydrationActive &&
        !isDrinkActive &&
        drinkConfig.enabled &&
        now >= nextDrinkAt
      ) {
        startDrink()
      }
    }, 1_000)

    emitOverlayState()
    emitSnapshot()
  }

  const stop = (): void => {
    if (inputHookStarted) {
      try {
        uIOhook.stop()
      } catch (error) {
        console.error('Failed to stop global input hook cleanly.', error)
      }
    }
    if (statsInterval) clearInterval(statsInterval)
    if (breakInterval) clearInterval(breakInterval)
  }

  const requestBreak = (): void => {
    startBreak(breakConfig.durationSeconds * 1000, true)
    emitSnapshot()
  }

  const skipBreak = (): void => {
    if (!isBreakActive) return
    finishBreak()
    emitSnapshot()
  }

  const requestBlink = (): void => {
    startBlink(true)
    emitSnapshot()
  }

  const requestHydration = (): void => {
    startHydration(true)
    emitSnapshot()
  }

  const requestDrink = (): void => {
    startDrink(true)
    emitSnapshot()
  }

  const setBreakConfig = (config: BreakConfig): void => {
    breakConfig = clampBreakConfig(config)
    if (!breakConfig.enabled) {
      if (isBreakActive) {
        isBreakActive = false
        breakEndsAt = null
        emitOverlayState()
      }
      nextBreakAt = Date.now() + 24 * 60 * 60 * 1000
      return
    }
    nextBreakAt = Date.now() + computeNextBreakMs(breakConfig, lastStressLevel)
  }

  const setBlinkConfig = (config: BlinkConfig): void => {
    blinkConfig = clampConfig(config)
    if (!blinkConfig.enabled) {
      finishBlink(false)
      scheduleNextBlink(Date.now())
      return
    }
    scheduleNextBlink(Date.now())
  }

  const setHydrationConfig = (config: HydrationConfig): void => {
    hydrationConfig = clampHydrationConfig(config)
    if (!hydrationConfig.enabled) {
      if (isHydrationActive) {
        isHydrationActive = false
        hydrationEndsAt = null
        emitOverlayState()
      }
      scheduleNextHydration(Date.now())
      return
    }
    scheduleNextHydration(Date.now())
  }

  const setDrinkConfig = (config: DrinkConfig): void => {
    drinkConfig = clampDrinkConfig(config)
    if (!drinkConfig.enabled) {
      if (isDrinkActive) {
        isDrinkActive = false
        drinkEndsAt = null
        emitOverlayState()
      }
      scheduleNextDrink(Date.now())
      return
    }
    scheduleNextDrink(Date.now())
  }

  const setActivityPacingConfig = (config: ActivityPacingConfig): void => {
    activityPacingConfig = clampActivityPacingConfig(config)
  }

  const skipBlink = (): void => {
    if (!isBlinkActive) return
    finishBlink(true)
  }

  const snoozeBlink = (): void => {
    if (!isBlinkActive) return
    finishBlink(false)
    nextBlinkAt = Date.now() + blinkConfig.snoozeMinutes * 60 * 1000
  }

  const completeHydration = (): void => {
    if (!isHydrationActive) return
    finishHydration(true)
  }

  const snoozeHydration = (): void => {
    if (!isHydrationActive) return
    finishHydration(false, false)
    nextHydrationAt = Date.now() + hydrationConfig.snoozeMinutes * 60 * 1000
  }

  const completeDrink = (): void => {
    if (!isDrinkActive) return
    finishDrink(true)
  }

  const snoozeDrink = (): void => {
    if (!isDrinkActive) return
    finishDrink(false, false)
    nextDrinkAt = Date.now() + drinkConfig.snoozeMinutes * 60 * 1000
  }

  const getSnapshot = (): StressSnapshot => {
    const now = Date.now()
    const kpm = getKpm(now)
    const mouseDistancePerMin = getMouseDistancePerMin(now)
    const stressLevel = computeStressLevel(kpm, mouseDistancePerMin)
    const scrollingStreakMs = getScrollingStreakMs(now)

    return {
      kpm,
      mouseDistancePerMin,
      totalMouseDistance,
      energy,
      stressLevel,
      isBreakActive,
      breakEndsAt,
      isBlinkActive,
      blinkEndsAt,
      isHydrationActive,
      hydrationEndsAt,
      isDrinkActive,
      drinkEndsAt,
      nextBreakAt,
      nextBlinkAt,
      nextHydrationAt,
      nextDrinkAt,
      lastBreakAt,
      lastHydrationAt,
      lastDrinkAt,
      scrollingStreakMs
    }
  }

  const onUpdate = (listener: Listener<StressSnapshot>): (() => void) => {
    updateListeners.add(listener)
    return () => updateListeners.delete(listener)
  }

  const onOverlayState = (listener: Listener<OverlayState>): (() => void) => {
    overlayListeners.add(listener)
    return () => overlayListeners.delete(listener)
  }

  const onOverlayToast = (listener: Listener<OverlayToast>): (() => void) => {
    toastListeners.add(listener)
    return () => toastListeners.delete(listener)
  }

  return {
    start,
    stop,
    setBreakConfig,
    requestBreak,
    skipBreak,
    requestBlink,
    requestHydration,
    requestDrink,
    setBlinkConfig,
    skipBlink,
    snoozeBlink,
    setHydrationConfig,
    completeHydration,
    snoozeHydration,
    setDrinkConfig,
    completeDrink,
    snoozeDrink,
    setActivityPacingConfig,
    getSnapshot,
    onUpdate,
    onOverlayState,
    onOverlayToast
  }
}
