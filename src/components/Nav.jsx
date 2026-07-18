import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { site } from '../content/site'
import { Container } from './ui/Container'
import { Button } from './ui/Button'

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" className="text-body font-semibold tracking-tight">
          JC Delizo
        </a>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {site.nav.map(({ id, label }) => (
            <a key={id} href={`#${id}`} className="text-label text-muted hover:text-ink">
              {label}
            </a>
          ))}
          <Button href={site.contact.resume} variant="ghost" external className="px-4 py-1.5 text-label">
            Résumé
          </Button>
        </nav>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </Container>

      {open ? (
        <nav aria-label="Mobile" className="border-t border-hairline md:hidden">
          <Container className="flex flex-col gap-4 py-6">
            {site.nav.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="text-body text-muted hover:text-ink"
              >
                {label}
              </a>
            ))}
            <Button href={site.contact.resume} variant="ghost" external className="self-start">
              Résumé
            </Button>
          </Container>
        </nav>
      ) : null}
    </header>
  )
}
