// Tracks layered modals (reader overlay → playbook → diagram lightbox) so:
//  - Escape closes only the TOP layer, one press per layer, and
//  - the body scroll lock survives until the LAST layer closes.
const stack = []

export function pushModal(id) {
  stack.push(id)
  document.body.style.overflow = 'hidden'
}

export function popModal(id) {
  const i = stack.lastIndexOf(id)
  if (i >= 0) stack.splice(i, 1)
  if (stack.length === 0) document.body.style.overflow = ''
}

export function isTopModal(id) {
  return stack[stack.length - 1] === id
}
