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

export function Tools() {
  return (
    <Section surface="tools">
      <Container>
        <SectionHeading id="tools" label="Environment" title="Tools." />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {site.tools.map(({ group, items }, i) => (
            <Reveal key={group} delay={Math.min(i, 3) * 60}>
              <p className="text-label uppercase tracking-widest text-muted">{group}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {items.map((item) => {
                  const Icon = TOOL_ICONS[item]
                  return (
                    <li
                      key={item}
                      className="flex items-center gap-1.5 rounded-md border border-hairline bg-card px-2.5 py-1 text-label"
                    >
                      {Icon && <Icon aria-hidden className="h-3.5 w-3.5 shrink-0 opacity-70" />}
                      {item}
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
