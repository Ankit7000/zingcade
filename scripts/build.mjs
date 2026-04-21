import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const nextCli = require.resolve('next/dist/bin/next')
const env = { ...process.env, NODE_ENV: 'production' }

const result = spawnSync(process.execPath, [nextCli, 'build'], {
  cwd: join(__dirname, '..'),
  env,
  stdio: 'inherit',
  shell: false,
})

if (result.error) {
  throw result.error
}

process.exit(result.status ?? 0)
