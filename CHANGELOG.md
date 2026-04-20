# Changelog

All notable changes to this project will be documented in this file.

The format is inspired by Keep a Changelog, and this project follows Semantic Versioning.

## [1.5.0] - 2026-04-21

### Added

- Fixes auto-start when installed through Microsoft store

## [1.4.0] - 2026-04-04

### Added

- Offline bundled fonts for renderer and overlay, removing runtime dependence on Google Fonts CDNs.
- Global pause mode for all wellness activities, configurable from Preferences and tray menu.
- Tray quick actions to pause activities for 1 hour, 3 hours, 8 hours, or forever, with resume support.
- Windows-only auto-pause detection for recording and focus-heavy sessions:
  - Detects OBS-like recording/streaming apps by foreground process/title hints.
  - Detects fullscreen foreground apps (useful for many game sessions).

### Changed

- Notification and reminder gating now respects global activity pause state.
- Activity pause state now includes source metadata (manual, auto, combined) for clearer status in UI/tray.

### Notes

- Windows auto-detection is heuristic-based and best-effort. Borderless-windowed games may not always be detected as fullscreen.

## [1.3.0] - 2026-04-04

### Added

- Health strictness controls and broader activity pacing improvements across break/blink/hydration/drink flows.

### Changed

- UX and settings refinements for reminders, preferences, and update surface.

## [1.2.0] - 2026-03-xx

### Added

- Baseline cross-platform release packaging for Windows, macOS, and Linux AppImage.
- Core desktop wellness workflows and monitoring foundation.
