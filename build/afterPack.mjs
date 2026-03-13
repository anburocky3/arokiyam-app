import { readdirSync, rmSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'

/**
 * Reduce package size by pruning native prebuilds that are not for the current target platform.
 * On macOS, also ad-hoc re-signs the entire app bundle so all components share the same
 * (empty) Team ID. Without this, the pre-signed Electron Framework has Electron's Team ID
 * while the main binary is unsigned, causing DYLD to abort on macOS 15+ / Apple Silicon.
 * @param {{ electronPlatformName: string; appOutDir: string; packager: object }} context
 * @returns {Promise<void>}
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default async function afterPack(context) {
  const platform = context.electronPlatformName
  const platformPrefix =
    platform === 'win32' ? 'win32-' : platform === 'darwin' ? 'darwin-' : 'linux-'

  const prebuildsDir = join(
    context.appOutDir,
    'resources',
    'app.asar.unpacked',
    'node_modules',
    'uiohook-napi',
    'prebuilds'
  )

  if (existsSync(prebuildsDir)) {
    const dirs = readdirSync(prebuildsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)

    for (const dirName of dirs) {
      if (dirName.startsWith(platformPrefix)) continue
      rmSync(join(prebuildsDir, dirName), { recursive: true, force: true })
    }
  }

  if (platform === 'darwin') {
    const appName = context.packager.appInfo.productFilename
    const appPath = join(context.appOutDir, `${appName}.app`)
    execFileSync('codesign', ['--force', '--deep', '--sign', '-', appPath], { stdio: 'inherit' })
  }
}
