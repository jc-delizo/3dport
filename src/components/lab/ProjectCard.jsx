import { useState } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { SiGithub } from 'react-icons/si'

export function ProjectCard({ project, compact = false, headingLevel = 2 }) {
  const Heading = `h${headingLevel}`
  const visibleStack = compact ? project.stack.slice(0, 3) : project.stack
  const images = project.images ?? (project.image ? [project.image] : [])
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const activeImage = images[activeImageIndex]
  const visitUrl = project.liveUrl ?? project.projectUrl
  const visitLabel = project.projectLabel ?? 'Visit project'

  const showImage = (index) => {
    const next = (index + images.length) % images.length
    setActiveImageIndex(next)
  }

  return (
    <article className="card-lift flex h-full flex-col overflow-hidden rounded-card border border-hairline bg-card">
      <div className="border-b border-hairline bg-canvas">
        <figure className="relative aspect-[8/5] overflow-hidden">
          <img
            key={activeImage.src}
            src={activeImage.src}
            alt={activeImage.alt}
            width="1440"
            height="900"
            loading="lazy"
            decoding="async"
            className="lab-shot-enter h-full w-full object-cover"
          />
          <figcaption className="absolute bottom-3 left-3 max-w-[70%] rounded-button bg-black/75 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white backdrop-blur-sm sm:text-[11px]">
            {activeImage.label}
          </figcaption>

          {!compact && images.length > 1 ? (
            <div className="absolute right-3 top-3 flex items-center rounded-button border border-white/15 bg-black/70 p-1 text-white shadow-lg backdrop-blur-sm">
              <button
                type="button"
                aria-label={`Previous ${project.title} screenshot`}
                onClick={() => showImage(activeImageIndex - 1)}
                className="rounded p-1.5 hover:bg-white/15"
              >
                <ChevronLeft aria-hidden="true" className="h-4 w-4" />
              </button>
              <span className="min-w-12 text-center font-mono text-[10px] tracking-wider">
                {String(activeImageIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                aria-label={`Next ${project.title} screenshot`}
                onClick={() => showImage(activeImageIndex + 1)}
                className="rounded p-1.5 hover:bg-white/15"
              >
                <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </figure>

      </div>

      <div className={`flex flex-1 flex-col ${compact ? 'p-5 md:p-6' : 'p-6 md:p-8'}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-label uppercase tracking-widest text-muted">
            {project.category}
          </p>
          <span className="rounded-button border border-hairline bg-canvas px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-muted">
            {project.status}
          </span>
        </div>

        <Heading className="font-display mt-4 text-card-title font-semibold tracking-display">
          {project.title}
        </Heading>
        <p className="mt-1 text-label text-accent">{project.role}</p>
        <p className="mt-4 text-body text-muted">{project.description}</p>

        {!compact ? (
          <p className="mt-4 border-l-2 border-accent pl-4 text-label leading-6 text-muted">
            {project.buildNote}
          </p>
        ) : null}

        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={`${project.title} technologies`}>
          {visibleStack.map((technology) => (
            <li
              key={technology}
              className="rounded-button border border-hairline bg-canvas px-2.5 py-1 font-mono text-[11px] text-muted"
            >
              {technology}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-5 pt-6">
          {visitUrl ? (
            <a
              href={visitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline inline-flex items-center gap-1.5 text-label font-medium text-ink"
            >
              {visitLabel} <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          ) : null}
          {project.sourceUrl ? (
            <a
              href={project.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline inline-flex items-center gap-1.5 text-label text-muted hover:text-ink"
            >
              <SiGithub aria-hidden="true" className="h-3.5 w-3.5" /> Source
            </a>
          ) : project.sourceNote ? (
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted">
              <SiGithub aria-hidden="true" className="h-3.5 w-3.5" /> {project.sourceNote}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}
