import puppeteer from 'puppeteer-core'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const template = `file://${resolve(here, 'og-template.html')}`
const output = resolve(here, '..', 'public', 'og.png')

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
  headless: 'new',
  args: ['--no-sandbox'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
await page.goto(template, { waitUntil: 'networkidle0' })
await page.screenshot({ path: output })
await browser.close()

console.log(`wrote ${output}`)
