import { execFileSync } from 'node:child_process'
import { join } from 'node:path'

/**
 * Ensure the final macOS app bundle is consistently ad-hoc signed.
 * This avoids Team ID mismatches between the main binary and Electron frameworks
 * on newer macOS versions when no Apple Developer certificate is provided.
 * @param {{ appOutDir: string; packager: { appInfo: { productFilename: string } } }} context
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default async function afterSign(context) {
  if (context.electronPlatformName !== 'darwin') {
    return
  }

  const appName = context.packager.appInfo.productFilename
  const appPath = join(context.appOutDir, `${appName}.app`)

  execFileSync('codesign', ['--force', '--deep', '--sign', '-', appPath], {
    stdio: 'inherit'
  })
}
