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
  nextBreakAt: number
  nextBlinkAt: number
  lastBreakAt: number | null
  scrollingStreakMs: number
}

export type OverlayState = {
  mode: 'normal' | 'break' | 'blink'
  breakEndsAt: number | null
  blinkEndsAt: number | null
  breathingActive: boolean
}

export type BlinkConfig = {
  enabled: boolean
  minMinutes: number
  maxMinutes: number
  durationSeconds: number
  snoozeMinutes: number
}

export type OverlayToast = {
  message: string
  expiresAt: number
}
