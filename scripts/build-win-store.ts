import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const envFile: string = resolve('.env')
const requiredKeys: string[] = [
  'WINDOWS_STORE_DISPLAY_NAME',
  'WINDOWS_STORE_PUBLISHER_DISPLAY_NAME',
  'WINDOWS_STORE_IDENTITY_NAME',
  'WINDOWS_STORE_PUBLISHER',
  'WINDOWS_STORE_APPLICATION_ID'
]

const stripQuotes = (value: string): string => {
  return value
    .trim()
    .replace(/^['"]+/, '')
    .replace(/['"]+$/, '')
}

const loadDotEnv = (): void => {
  if (!existsSync(envFile)) return

  const content = readFileSync(envFile, 'utf-8')
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (!match) continue

    const key = match[1]
    const rawValue = match[2]

    const normalizedValue = stripQuotes(rawValue)
    if (requiredKeys.includes(key)) {
      // Always prefer .env for Store identity fields to avoid stale shell values.
      process.env[key] = normalizedValue
      continue
    }

    if (process.env[key] === undefined) {
      process.env[key] = normalizedValue
    }
  }
}

const fail = (message: string): never => {
  console.error(message)
  process.exit(1)
}

const getEnv = (key: string): string => {
  const value = process.env[key]?.trim() ?? ''
  if (!value) {
    fail(`Missing required env var: ${key}`)
  }
  return value
}

const assertStoreEnv = (): void => {
  for (const key of requiredKeys) {
    getEnv(key)
  }

  const identityName = getEnv('WINDOWS_STORE_IDENTITY_NAME')
  if (!/^[A-Za-z0-9.-]+$/.test(identityName)) {
    fail('WINDOWS_STORE_IDENTITY_NAME can only contain letters, numbers, period, and dash.')
  }

  const applicationId = getEnv('WINDOWS_STORE_APPLICATION_ID')
  if (!/^[A-Za-z0-9.-]+$/.test(applicationId)) {
    fail('WINDOWS_STORE_APPLICATION_ID can only contain letters, numbers, period, and dash.')
  }
}

const logStoreEnvSummary = (): void => {
  const identityName = getEnv('WINDOWS_STORE_IDENTITY_NAME')
  const applicationId = getEnv('WINDOWS_STORE_APPLICATION_ID')
  console.log('[store] Loaded Store environment values')
  console.log(`[store] identityName: ${identityName}`)
  console.log(`[store] applicationId: ${applicationId}`)
}

const run = (command: string, args: string[]): void => {
  let executable = command
  if (command === 'bun') {
    executable = process.execPath
  } else if (process.platform === 'win32') {
    executable = `${command}.cmd`
  }

  const result = spawnSync(executable, args, {
    stdio: 'inherit',
    env: process.env
  })

  if (result.error) {
    console.error(`[store] Failed to start command: ${command} ${args.join(' ')}`)
    console.error(`[store] ${result.error.message}`)
    process.exit(1)
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

const isPublish = process.argv.slice(2).includes('publish')

loadDotEnv()
assertStoreEnv()
logStoreEnvSummary()

const publisherDisplayName = getEnv('WINDOWS_STORE_PUBLISHER_DISPLAY_NAME')
const displayName = getEnv('WINDOWS_STORE_DISPLAY_NAME')
const identityName = getEnv('WINDOWS_STORE_IDENTITY_NAME')
const publisher = getEnv('WINDOWS_STORE_PUBLISHER')
const applicationId = getEnv('WINDOWS_STORE_APPLICATION_ID')

console.log('[store] Building Electron app bundle...')
run('bun', ['x', 'electron-vite', 'build'])

const publishValue = isPublish ? 'always' : 'never'
console.log(`[store] Building AppX package (publish=${publishValue})...`)
run('bun', [
  'x',
  'electron-builder',
  '--win',
  'appx',
  '--x64',
  '--publish',
  publishValue,
  `--config.appx.displayName=${displayName}`,
  `--config.appx.publisherDisplayName=${publisherDisplayName}`,
  `--config.appx.identityName=${identityName}`,
  `--config.appx.publisher=${publisher}`,
  `--config.appx.applicationId=${applicationId}`
])
console.log('[store] AppX packaging completed.')
