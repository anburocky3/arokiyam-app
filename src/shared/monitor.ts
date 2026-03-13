export type StressSnapshot = {
  kpm: number
  mouseDistancePerMin: number
  totalMouseDistance: number
  energy: number
  stressLevel: number
  isBreakActive: boolean
  breakEndsAt: number | null
  isBlinkActive: boolean
  blinkEndsAt: number | null
  isHydrationActive: boolean
  hydrationEndsAt: number | null
  isDrinkActive: boolean
  drinkEndsAt: number | null
  nextBreakAt: number
  nextBlinkAt: number
  nextHydrationAt: number
  nextDrinkAt: number
  lastBreakAt: number | null
  lastHydrationAt: number | null
  lastDrinkAt: number | null
  scrollingStreakMs: number
}

export type OverlayState = {
  mode: 'normal' | 'break' | 'blink' | 'hydration' | 'drink'
  breakEndsAt: number | null
  blinkEndsAt: number | null
  hydrationEndsAt: number | null
  drinkEndsAt: number | null
  breathingActive: boolean
}

export type BlinkConfig = {
  enabled: boolean
  minMinutes: number
  maxMinutes: number
  durationSeconds: number
  snoozeMinutes: number
}

export type BreakConfig = {
  enabled: boolean
  minMinutes: number
  maxMinutes: number
  durationSeconds: number
}

export type HydrationConfig = {
  enabled: boolean
  intervalMinutes: number
  durationSeconds: number
  snoozeMinutes: number
}

export type DrinkConfig = {
  enabled: boolean
  intervalMinutes: number
  durationSeconds: number
  snoozeMinutes: number
}

export type ActivityPacingConfig = {
  minimumGapMinutes: number
}

export type OverlayToast = {
  message: string
  expiresAt: number
}
