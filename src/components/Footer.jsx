import { site } from '../content/site'
import { Container } from './ui/Container'

export function Footer() {
  return (
    <footer className="border-t border-hairline py-10">
      <Container>
        <p className="text-label text-muted">{site.footer}</p>
      </Container>
    </footer>
  )
}
