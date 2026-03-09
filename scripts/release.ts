import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

type VersionBump = 'patch' | 'minor' | 'major'

const allowedBumps = new Set<VersionBump>(['patch', 'minor', 'major'])

const isVersionBump = (value: string): value is VersionBump => {
  return allowedBumps.has(value as VersionBump)
}

const args = process.argv.slice(2)
const bump = args[0] ?? 'patch'

if (!isVersionBump(bump)) {
  console.error(`Invalid version bump: ${bump}. Use patch, minor, or major.`)
  process.exit(1)
}

const extraArgs = args.slice(1)
let description = ''

const descFlagIndex = extraArgs.findIndex((item) => item === '--desc')
if (descFlagIndex >= 0) {
  description = (extraArgs[descFlagIndex + 1] ?? '').trim()
} else if (extraArgs.length > 0) {
  description = extraArgs.join(' ').trim()
}

const run = (command: string, commandArgs: string[]): void => {
  const executable = process.platform === 'win32' && command === 'npm' ? 'npm.cmd' : command

  const result = spawnSync(executable, commandArgs, {
    stdio: 'inherit'
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

const runGit = (commandArgs: string[]): void => {
  const result = spawnSync('git', commandArgs, {
    encoding: 'utf-8',
    stdio: 'pipe'
  })

  const stdout = result.stdout ?? ''
  const stderr = result.stderr ?? ''

  if (stdout) process.stdout.write(stdout)
  if (stderr) process.stderr.write(stderr)

  const gitFatalOrError = /(^|\n)fatal:|(^|\n)error:/i.test(`${stdout}\n${stderr}`)
  if (result.status !== 0 || gitFatalOrError) {
    console.error(
      'Aborting release: git reported a fatal/error condition. No commit will be created.'
    )
    process.exit(result.status ?? 1)
  }
}

const assertGitHealthy = (): void => {
  runGit(['--version'])
  runGit(['rev-parse', '--is-inside-work-tree'])
  runGit(['status', '--porcelain'])
}

const readCurrentVersion = (): string => {
  const packageJsonRaw = readFileSync('package.json', 'utf-8')
  const packageJson = JSON.parse(packageJsonRaw) as { version?: string }
  if (!packageJson.version) {
    console.error('Unable to determine version from package.json')
    process.exit(1)
  }
  return packageJson.version
}

const addVersionFiles = (): void => {
  const files = ['package.json']

  if (existsSync('package-lock.json')) {
    files.push('package-lock.json')
  }
  if (existsSync('npm-shrinkwrap.json')) {
    files.push('npm-shrinkwrap.json')
  }

  runGit(['add', ...files])
}

assertGitHealthy()
run('npm', ['version', bump, '--no-git-tag-version'])

const version = readCurrentVersion()
const tag = `v${version}`
const commitMessage = description ? `${tag} - ${description}` : tag

addVersionFiles()
runGit(['commit', '-m', commitMessage])
runGit(['tag', tag])
runGit(['push'])
runGit(['push', '--tags'])
