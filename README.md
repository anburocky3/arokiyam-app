<div style="display:flex;align-items:center;">
<h1>Arokiyam</h1>
<h4 style="padding-left:20px;">Health companion app for techies</h4>
</div>

[![Stars](https://img.shields.io/github/stars/anburocky3/arokiyam-app)](https://github.com/anburocky3/arokiyam-app)
[![Forks](https://img.shields.io/github/forks/anburocky3/arokiyam-app)](https://github.com/anburocky3/arokiyam-app)
[![GitHub license](https://img.shields.io/github/license/anburocky3/arokiyam-app)](https://github.com/anburocky3/arokiyam-app)
![Anbuselvan Rocky Twitter](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fanburocky3%2Farokiyam-app)
[![Support Server](https://img.shields.io/discord/742347296091537448.svg?label=Discord&logo=Discord&colorB=7289da)](https://discord.gg/6ktMR65YMy)
[![Cyberdude youtube](https://img.shields.io/youtube/channel/subscribers/UCteUj8bL1ppZcS70UCWrVfw?style=social)](https://www.youtube.com/c/cyberdudenetworks)

Arokiyam is a cross-platform desktop wellness companion for developers and desk workers.
It tracks activity stress signals, prompts healthy breaks, and uses guided overlays to reduce eye strain and fatigue.

## Downloads

<!-- DOWNLOAD_LINKS_START -->

Latest stable release: **v1.0.1**

- Windows (Installer): [Download](https://github.com/anburocky3/arokiyam-app/releases/download/v1.0.1/arokiyam-1.0.1-setup.exe)
- macOS (DMG): [Download](https://github.com/anburocky3/arokiyam-app/releases/download/v1.0.1/arokiyam-1.0.1.dmg)
- Linux (AppImage): [Download](https://github.com/anburocky3/arokiyam-app/releases/download/v1.0.1/arokiyam-1.0.1.AppImage)
- Linux (DEB): [Download](https://github.com/anburocky3/arokiyam-app/releases/download/v1.0.1/arokiyam-1.0.1-amd64.deb)

<!-- DOWNLOAD_LINKS_END -->

## Screenshots

### Dashboard

![Arokiyam Dashboard](docs/screenshots/1.png)
![Activity #1: Rest your eyes](docs/screenshots/2.png)
![Activity #2: Reset your energy](docs/screenshots/3.png)
![Activity #3: Hydration](docs/screenshots/4.png)
![Activity #4: Drink juice/coffee](docs/screenshots/5.png)

### Preferences

![Arokiyam Preferences](docs/screenshots/6.png)

## Features

- Live stress monitoring based on keyboard and mouse activity.
- Health battery model that drains with sustained stress and recovers during breaks.
- Randomized break logic to avoid rigid reminder fatigue.
- Blink, hydration, and drink activity overlays.
- Health strictness modes (`Basic`, `Medium`, `Health conscious`) that control skip/snooze behavior.
- Manual quick actions for blink, break, hydration, and drink.
- Auto-start toggle and desktop notification controls.
- Cross-platform packaging and tag-based GitHub Release automation.

## Tech Stack

- Electron
- React
- TypeScript
- Tailwind CSS
- `uiohook-napi` for global keyboard/mouse activity monitoring
- `electron-builder` for installers

## Getting Started

### Prerequisites

- Bun `>=1.1`
- Node.js `>=20` (used by tooling and CI)
- Git

### Install Dependencies

```bash
bun install
```

### Run In Development

```bash
bun run dev
```

### Lint And Type Check

```bash
bun run lint
bun run typecheck
```

### Build Desktop Packages

```bash
# Windows
bun run build:win

# macOS
bun run build:mac

# Linux (AppImage + DEB)
bun run build:linux
```

Build output is generated under `dist/`.

## Release Workflow

The project uses GitHub Actions to build and publish release assets.

- Workflow file: `.github/workflows/release.yml`
- Triggered by tag push (`v*`) or manual dispatch.
- Publishes only user-facing assets:
  - `*-setup.exe`
  - `*.dmg`
  - `*.AppImage`
  - `*.deb`
- Automatically refreshes README download links after release.

### Version And Tag Commands

```bash
bun run release:patch
bun run release:minor
bun run release:major
```

These commands create a version bump commit (`vX.Y.Z`) and push tags.

## Project Structure

```text
src/
	main/        Electron main process
	preload/     Safe renderer bridge APIs
	renderer/    React UI
	shared/      Shared type contracts
```

## Contributing

### Branching

- Create a feature branch from `main`.
- Keep PRs scoped and small where possible.

### Commit Style

- Use clear conventional-style messages.
- Examples:
  - `feat(stress): add hydration streak indicator`
  - `fix(release): include linux artifact permissions`
  - `docs: update setup instructions`

### Pull Request Checklist

- Code builds locally.
- Lint and type checks pass.
- README/docs updated when behavior changes.
- Screenshots updated for major UI changes.

## Reporting Issues

When opening an issue, include:

- OS and version
- App version/tag
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots or logs (if relevant)

## License

Add your preferred license in `LICENSE` and update this section.
