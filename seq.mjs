import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'], timeout: 150000, protocolTimeout: 180000 })
const p = await b.newPage()
await p.setViewport({ width: 1536, height: 900 })
await p.goto('http://127.0.0.1:5184/', { waitUntil: 'networkidle2', timeout: 90000 })
await new Promise(r => setTimeout(r, 4500))
const probe = await p.evaluate(() => new Promise((res) => {
  const out = {}
  const sample = (tag) => {
    const enter = document.querySelector('.view-enter')
    const leave = document.querySelector('.view-layer-leaving')
    const tx = (el) => {
      if (!el) return null
      const m = getComputedStyle(el).transform
      return m === 'none' ? 0 : Math.round(Number.parseFloat(m.split(',')[4]))
    }
    out[tag] = { enterTx: tx(enter), leaveTx: tx(leave) }
  }
  ;[...document.querySelectorAll('header a')].find((a) => a.textContent.includes('Lab') && a.getClientRects().length).click()
  setTimeout(() => sample('t150'), 150)
  setTimeout(() => sample('t320'), 320)
  setTimeout(() => sample('t500'), 500)
  setTimeout(() => sample('t800'), 800)
  setTimeout(() => res(out), 1100)
}))
console.log('sequence (enterTx should stay ~1536 until leaveTx reaches ~-1536):')
console.log(probe)
await b.close()
