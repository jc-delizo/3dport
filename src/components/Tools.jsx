import {
  SiJira,
  SiLinear,
  SiCoda,
  SiClickup,
  SiAsana,
  SiTrello,
  SiNotion,
  SiOdoo,
  SiGoogle,
  SiFigma,
  SiGit,
  SiGithub,
  SiVercel,
  SiClaude,
  SiCursor,
  SiGooglegemini,
  SiHubspot,
  SiElevenlabs,
  SiReact,
  SiVite,
  SiNodedotjs,
  SiMongodb,
  SiMysql,
  SiLaravel,
  SiDigitalocean,
  SiContabo,
  SiPosthog,
  SiSnowflake,
} from 'react-icons/si'
import { TbBrandMonday, TbBrandOpenai, TbBrandOffice, TbBrandAdobe, TbBrandAws } from 'react-icons/tb'
import { VscAzureDevops } from 'react-icons/vsc'
import {
  Bot,
  Clapperboard,
  Film,
  Megaphone,
  Palette,
  PencilRuler,
  Presentation,
  Share2,
  SquareCode,
  SquareTerminal,
  Workflow,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { site } from '../content/site'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

// Monochrome brand marks; a couple of tools have no public brand icon
// (Balsamiq, Codex) and use a neutral glyph instead.
const TOOL_ICONS = {
  Jira: SiJira,
  Linear: SiLinear,
  Coda: SiCoda,
  ClickUp: SiClickup,
  Monday: TbBrandMonday,
  Asana: SiAsana,
  Trello: SiTrello,
  Notion: SiNotion,
  'Azure DevOps': VscAzureDevops,
  'Odoo ERP': SiOdoo,
  'Google Workspace': SiGoogle,
  'Microsoft 365': TbBrandOffice,
  SharePoint: Share2,
  HubSpot: SiHubspot,
  GoHighLevel: Megaphone,
  'Power Automate': Workflow,
  Figma: SiFigma,
  Balsamiq: PencilRuler,
  Canva: Palette,
  'Adobe Creative Cloud': TbBrandAdobe,
  CapCut: Clapperboard,
  Git: SiGit,
  GitHub: SiGithub,
  Vercel: SiVercel,
  React: SiReact,
  Vite: SiVite,
  'Node.js': SiNodedotjs,
  Snowflake: SiSnowflake,
  Laravel: SiLaravel,
  MongoDB: SiMongodb,
  MySQL: SiMysql,
  AWS: TbBrandAws,
  DigitalOcean: SiDigitalocean,
  Contabo: SiContabo,
  PostHog: SiPosthog,
  Claude: SiClaude,
  Cursor: SiCursor,
  ChatGPT: TbBrandOpenai,
  Gemini: SiGooglegemini,
  Codex: SquareTerminal,
  OpenCode: SquareCode,
  Grok: Bot,
  ElevenLabs: SiElevenlabs,
  Higgsfield: Film,
  Gamma: Presentation,
}

// Official brand colors, shown only on hover (the resting state stays
// monochrome). Tools whose brand is essentially black keep near-black.
export const TOOL_BRANDS = {
  Jira: '#0052CC',
  Linear: '#5E6AD2',
  Coda: '#F46A54',
  ClickUp: '#7B68EE',
  Monday: '#FF3D57',
  Asana: '#F06A6A',
  Trello: '#0052CC',
  Notion: '#000000',
  'Azure DevOps': '#0078D4',
  'Odoo ERP': '#714B67',
  'Google Workspace': '#4285F4',
  'Microsoft 365': '#D83B01',
  SharePoint: '#038387',
  HubSpot: '#FF7A59',
  GoHighLevel: '#188BF6',
  'Power Automate': '#0066FF',
  Figma: '#F24E1E',
  Balsamiq: '#CC0100',
  Canva: '#00C4CC',
  'Adobe Creative Cloud': '#DA1F26',
  CapCut: '#000000',
  Git: '#F05032',
  GitHub: '#181717',
  Vercel: '#000000',
  React: '#61DAFB',
  Vite: '#646CFF',
  'Node.js': '#5FA04E',
  Snowflake: '#29B5E8',
  Laravel: '#FF2D20',
  MongoDB: '#47A248',
  MySQL: '#4479A1',
  AWS: '#FF9900',
  DigitalOcean: '#0080FF',
  Contabo: '#00AAEB',
  PostHog: '#F54E00',
  Claude: '#D97757',
  Cursor: '#000000',
  ChatGPT: '#10A37F',
  Gemini: '#8E75B2',
  Codex: '#000000',
  OpenCode: '#000000',
  Grok: '#000000',
  ElevenLabs: '#000000',
  Higgsfield: '#101010',
  Gamma: '#7C3AED',
}

// Readable label/icon color on the brand background (YIQ heuristic).
export const brandForeground = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return (299 * r + 587 * g + 114 * b) / 1000 >= 140 ? '#0D0D0D' : '#FFFFFF'
}

const ALL_TOOLS = site.tools.flatMap((g) => g.items)
const GLARE_EVERY_MS = 1100 // 900ms sweep + a short rest

export function Tools() {
  // One label glares at a time, in a shuffled queue — every tool gets a turn
  // before any repeats. Runs only while the section is on screen; skipped
  // entirely under prefers-reduced-motion.
  const [glare, setGlare] = useState(null)
  const [inView, setInView] = useState(false)
  const rootRef = useRef(null)
  const queueRef = useRef([])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const t = setInterval(() => {
      if (!queueRef.current.length) {
        queueRef.current = [...ALL_TOOLS].sort(() => Math.random() - 0.5)
      }
      setGlare(queueRef.current.pop())
    }, GLARE_EVERY_MS)
    return () => clearInterval(t)
  }, [inView])

  return (
    <Section surface="tools">
      <Container>
        <SectionHeading id="tools" label="Environment" title="Tools." />
        <div ref={rootRef} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {site.tools.map(({ group, items }, i) => (
            <Reveal key={group} delay={Math.min(i, 3) * 60}>
              <p className="text-label uppercase tracking-widest text-muted">{group}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {items.map((item) => {
                  const Icon = TOOL_ICONS[item]
                  const brand = TOOL_BRANDS[item]
                  return (
                    <li
                      key={item}
                      className="tool-chip flex items-center gap-1.5 rounded-md border border-hairline bg-card px-2.5 py-1 text-label"
                      style={
                        brand
                          ? { '--brand': brand, '--brand-fg': brandForeground(brand) }
                          : undefined
                      }
                    >
                      {Icon && <Icon aria-hidden className="h-3.5 w-3.5 shrink-0 opacity-70" />}
                      <span className={glare === item ? 'tool-glare' : undefined}>{item}</span>
                    </li>
                  )
                })}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
