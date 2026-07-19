/**
 * Regenerates the About portrait from the cutout master.
 *
 * Fails loudly rather than emitting a broken asset — a silently-wrong image on a
 * recruiter-facing page is worse than a failed build.
 *
 * The master is a background-removed PNG supplied by JC. The original studio photo
 * cannot be cut out programmatically: the subject is darker than the backdrop
 * (hair (0,0,1), suit (14,20,39), background corner (23,23,21)), so no colour or
 * luminance threshold separates them. Do not attempt a local re-cut.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const master = resolve(here, '..', 'assets', 'head-master.png')
const avif = resolve(here, '..', 'public', 'head.avif')
const jpg = resolve(here, '..', 'public', 'head.jpg')

const WIDTH = 480 // 2x the 240px desktop display size
const CARD_BG = '#FAFAFA' // spec §5 — lets the JPEG fallback skip an alpha channel
const AVIF_MAX = 40 * 1024
const JPEG_MAX = 60 * 1024

if (!existsSync(master)) {
  throw new Error(`missing cutout master: ${master}`)
}

// Primary: alpha preserved, sits on the card background at runtime.
execFileSync('convert', [master, '-resize', `${WIDTH}x`, '-strip', '-quality', '55', avif], {
  stdio: 'inherit',
})

// Fallback: the card background is a known flat colour, so it can be baked in.
// This is why the fallback costs 24K instead of PNG's 268K.
execFileSync(
  'convert',
  [master, '-resize', `${WIDTH}x`, '-background', CARD_BG, '-flatten', '-strip', '-quality', '78', jpg],
  { stdio: 'inherit' },
)

// If the AVIF lost its alpha it would render as a solid rectangle, which looks
// deliberate enough to ship unnoticed.
const minAlpha = execFileSync(
  'convert',
  [avif, '-alpha', 'extract', '-format', '%[fx:minima]', 'info:'],
  { encoding: 'utf8' },
).trim()

if (Number(minAlpha) !== 0) {
  throw new Error(`AVIF lost its alpha channel (min alpha ${minAlpha}); the portrait would render on a solid block`)
}

for (const [file, max] of [
  [avif, AVIF_MAX],
  [jpg, JPEG_MAX],
]) {
  const bytes = statSync(file).size
  if (bytes < 2048) throw new Error(`${file} is only ${bytes}B — almost certainly not a real image`)
  if (bytes > max) throw new Error(`${file} is ${bytes}B, over the ${max}B budget`)
  console.log(`wrote ${file} (${(bytes / 1024).toFixed(1)}K)`)
}
