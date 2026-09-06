const BASE_URL = import.meta.env.BASE_URL

const asset = (file) => `${BASE_URL}lab/${file}`

export const labPage = {
  meta: {
    title: 'JC Delizo | Personal Lab',
    description:
      'Products, experiments, and interactive stories designed and built by JC Delizo, with honest notes on scope, status, and AI-assisted development.',
  },
  url: `${BASE_URL}lab/`,
  homeUrl: BASE_URL,
  hero: {
    label: 'Personal Lab · 05 builds',
    title: 'Make. Ship. Learn.',
    body:
      'Five independent products and experiments—designed, coded, tested, and shipped close to the craft.',
  },
}

export const labProjects = [
  {
    id: 'ako-may-lesson-plan-na',
    featured: true,
    category: 'Teacher marketplace',
    title: 'Ako may lesson plan na!',
    status: 'Pre-launch',
    role: 'Product design & engineering',
    description:
      'A teacher-first marketplace for practical Filipino K–12 lesson plans and classroom resources, designed around discovery, clear product context, and simple seller onboarding.',
    buildNote:
      'The marketplace experience is live. Checkout, payouts, and refunds remain deliberately gated until the payment workflow is ready for real transactions.',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    images: [
      {
        src: asset('ako-may-lesson-plan-na.webp'),
        alt: 'Ako may lesson plan na marketplace with lesson-plan categories and teacher-made resources.',
        label: 'Marketplace overview',
      },
      {
        src: asset('ako-may-lesson-plan-na-browse.webp'),
        alt: 'Ako may lesson plan na searchable catalog with curriculum, grade, subject, quarter, and modality filters.',
        label: 'Catalog discovery',
      },
      {
        src: asset('ako-may-lesson-plan-na-detail.webp'),
        alt: 'Ako may lesson plan na product page for a kindergarten mathematics assessment resource.',
        label: 'Resource detail',
      },
      {
        src: asset('ako-how-it-works.webp'),
        alt: 'Ako may lesson plan na guide explaining how teachers can find resources and how creators can sell them.',
        label: 'How it works',
      },
      {
        src: asset('ako-for-teachers.webp'),
        alt: 'Ako may lesson plan na page describing the marketplace benefits for Filipino teachers.',
        label: 'For teachers',
      },
    ],
    liveUrl: 'https://akomaylessonplanna.vercel.app/marketplace',
    sourceUrl: 'https://github.com/jc-delizo/akomaylessonplanna',
  },
  {
    id: 'the-way',
    featured: true,
    category: 'Interactive storytelling',
    title: 'The Way',
    status: 'Live',
    role: 'Creative direction & engineering',
    description:
      'A cinematic, scroll-led telling of the story of Jesus — from promise to return — built as a quiet digital experience rather than a conventional reading page.',
    buildNote:
      'Scroll choreography, layered imagery, and restrained motion carry the story, with a reduced-motion path for visitors who need it.',
    stack: ['Next.js', 'TypeScript', 'GSAP', 'ScrollTrigger'],
    images: [
      {
        src: asset('the-way.webp'),
        alt: 'The Way opening scene, presenting Jesus the Christ against a dark cinematic background.',
        label: 'Opening scene',
      },
      {
        src: asset('the-way-promise.webp'),
        alt: 'The Way promise chapter with scripture set against a cinematic star-filled sky.',
        label: 'The Promise',
      },
      {
        src: asset('the-way-arrival.webp'),
        alt: 'The Way arrival chapter showing the nativity beneath a luminous night sky.',
        label: 'The Arrival',
      },
      {
        src: asset('the-way-kingdom.webp'),
        alt: 'The Way kingdom chapter showing Jesus teaching a gathered crowd in warm light.',
        label: 'The Kingdom',
      },
      {
        src: asset('the-way-return.webp'),
        alt: 'The Way final chapter looking toward the promised return through bright clouds.',
        label: 'The Return',
      },
    ],
    liveUrl: 'https://jc-delizo.github.io/To-my-Lord-Jesus-Christ/',
    sourceUrl: 'https://github.com/jc-delizo/To-my-Lord-Jesus-Christ',
  },
  {
    id: 'onedayos',
    category: 'Business platform',
    title: 'OneDayOS',
    status: 'Active build',
    role: 'Platform architecture & engineering',
    description:
      'An opinionated multi-tenant business platform proving one complete Inventory flow on top of shared records, organization context, and server-enforced permissions.',
    buildNote:
      'Inventory is the first and only business module: receipts, issues, transfers, adjustments, balances, an append-only movement ledger, and controlled reversal. No additional modules are claimed.',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Supabase'],
    images: [
      {
        src: asset('onedayos-inventory.svg'),
        alt: 'Illustrative OneDayOS Inventory dashboard with synthetic products, stock positions, and posted transactions.',
        label: 'Overview · Synthetic data',
      },
      {
        src: asset('onedayos-receipt.svg'),
        alt: 'Illustrative OneDayOS receipt form with a destination warehouse and synthetic product lines.',
        label: 'Receipt workflow · Synthetic data',
      },
      {
        src: asset('onedayos-ledger.svg'),
        alt: 'Illustrative OneDayOS append-only movement ledger with synthetic inventory movements.',
        label: 'Movement ledger · Synthetic data',
      },
      {
        src: asset('onedayos-transfer.svg'),
        alt: 'Illustrative OneDayOS warehouse transfer form with synthetic source, destination, and product data.',
        label: 'Transfer workflow · Synthetic data',
      },
      {
        src: asset('onedayos-reversal.svg'),
        alt: 'Illustrative OneDayOS posted transaction detail showing a controlled reversal with synthetic data.',
        label: 'Controlled reversal · Synthetic data',
      },
    ],
    projectUrl: 'https://github.com/jc-delizo/onedayos#inventory-workflow',
    projectLabel: 'Visit build',
    sourceUrl: 'https://github.com/jc-delizo/onedayos/tree/main/src/modules/inventory',
  },
  {
    id: 'readwell',
    category: 'Full-stack commerce',
    title: 'ReadWell',
    status: 'Live demo',
    role: 'Product redesign & full-stack engineering',
    description:
      'A rebuilt MERN bookstore with catalog discovery, search, cart, cash-on-delivery checkout, order history, and administrative workflows.',
    buildNote:
      'I revisited an older bootcamp build and turned the separate exercises into one cohesive, tested product with a clearer visual system and safer application boundaries.',
    stack: ['React', 'Express', 'MongoDB', 'Node.js'],
    images: [
      {
        src: asset('readwell-home.webp'),
        alt: 'ReadWell home page with a books worth getting lost in message and a curated cover composition.',
        label: 'Storefront',
      },
      {
        src: asset('readwell-browse.webp'),
        alt: 'ReadWell catalog with search, genre filters, sorting, and a grid of book covers.',
        label: 'Catalog discovery',
      },
      {
        src: asset('readwell-detail.webp'),
        alt: 'ReadWell product page for The Last Colony with rating, price, synopsis, and add-to-cart action.',
        label: 'Book detail',
      },
      {
        src: asset('readwell-login.webp'),
        alt: 'ReadWell sign-in page pairing a book-cover wall with a focused account form.',
        label: 'Sign in',
      },
      {
        src: asset('readwell-register.webp'),
        alt: 'ReadWell registration page pairing a book-cover wall with a new-account form.',
        label: 'Create account',
      },
    ],
    liveUrl: 'https://readwell-nodj.onrender.com/',
    sourceUrl: 'https://github.com/jc-delizo/readwell',
  },
  {
    id: 'stopcounter',
    category: 'Interaction experiment',
    title: 'Stopcounter',
    status: 'Live',
    role: 'Interaction design & engineering',
    description:
      'An accessible stopwatch and countdown timer reimagined as a tactile physical instrument, complete with keyboard control and deliberately playful atmosphere.',
    buildNote:
      'Timestamp-based timing keeps it accurate while Canvas rain, lightning, and Web Audio make a tiny utility feel unusually alive.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Canvas', 'Web Audio'],
    images: [
      {
        src: asset('stopcounter.webp'),
        alt: 'A physical-style silver stopwatch on wood with animated rain and a bright digital display.',
        label: 'Ready state',
      },
      {
        src: asset('stopcounter-running.webp'),
        alt: 'Stopcounter running as a stopwatch beneath animated rain.',
        label: 'Stopwatch running',
      },
    ],
    liveUrl: 'https://jc-delizo.github.io/stopcounter/',
    sourceUrl: 'https://github.com/jc-delizo/stopcounter',
  },
]

export const featuredLabProjects = labProjects.filter((project) => project.featured)

export const professionalWork = {
  label: 'Professional work · Confidential',
  title: 'AI Delivery Platform',
  body:
    'I led the design and implementation of an internal AI-assisted delivery platform for my current team. It is shown only as an anonymized systems case study — never as an independently owned Lab project.',
  note:
    'Proprietary name, source code, production data, internal URLs, and operational details are intentionally omitted.',
  flow: ['Conversation', 'Structured work', 'Human approval', 'Delivery'],
  href: `${BASE_URL}#case-studies`,
}
