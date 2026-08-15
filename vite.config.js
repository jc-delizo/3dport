import { execSync } from 'node:child_process'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Real build facts for the footer's build-stats line. Computed once at config
// load; never guessed. Falls back cleanly outside a git checkout.
function buildInfo() {
  let sha = '0000000'
  try {
    sha = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim()
  } catch {
    /* not a git checkout */
  }

  let tests = 0
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) walk(full)
      else if (/\.test\.jsx?$/.test(entry) || /\.test\.js$/.test(entry)) {
        tests += (readFileSync(full, 'utf-8').match(/\bit(\.each)?\(/g) || []).length
      }
    }
  }
  try {
    walk(join(process.cwd(), 'src'))
  } catch {
    /* keep 0 */
  }

  return { sha, tests, date: new Date().toISOString().slice(0, 10) }
}

export default defineConfig({
  base: '/3dport/',
  plugins: [react()],
  define: {
    __BUILD_INFO__: JSON.stringify(buildInfo()),
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
