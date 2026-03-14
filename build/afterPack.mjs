import { readdirSync, rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Reduce package size by pruning native prebuilds that are not for the current target platform.
 * @param {{ electronPlatformName: string; appOutDir: string }} context
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
}
