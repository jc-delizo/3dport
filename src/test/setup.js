import '@testing-library/jest-dom/vitest'

// jsdom implements neither of these; components under test use both.
global.IntersectionObserverInstances = []

global.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback
    global.IntersectionObserverInstances.push(this)
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
  })
}
