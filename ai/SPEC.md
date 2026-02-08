# PROJECT SPECIFICATION: "Arokiyam" - Developer Health App

## Tech Stack

- **Core:** Electron (Main Process)
- **UI:** React (Renderer Process)
- **Input Monitoring:** `uiohook-napi` (Node.js global hooks)
- **State Management:** React Context or Zustand
- **Styling:** Tailwind CSS (recommended) or CSS Modules

## Core Features

1.  **Ghost Overlay:** A transparent, full-screen window that sits on top of Windows (AlwaysOnTop).
    - _Normal Mode:_ Invisible, click-through (allows user to work).
    - _Break Mode:_ Black background (opacity 0.95), blocks clicks, shows exercises.
2.  **Stress Monitor:** Tracks global keyboard (KPM) and mouse distance in the Main Process.
3.  **Health Battery:** A gamified "Energy Bar" (0-100%).
    - Drains based on high KPM/Mouse usage.
    - Recharges only when a "Break" is completed.
4.  **Randomized Breaks:** Timer triggers randomly between 45-75 minutes (based on stress level).

## Unique Modules

- **Wrist Odometer:** Tracks total pixels mouse moved.
- **Blinking Coach:** Reminder to blink if scrolling > 15 mins.
- **Deep Breath Sync:** A breathing circle animation (4s in, 4s hold, 4s out).
