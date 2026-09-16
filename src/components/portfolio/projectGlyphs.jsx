import { Mark } from './domainGlyphs'

// One unique mark per delivered project (2026-09-17, JC) — same line-art
// language as the domain and backdrop libraries: 64×64, stroke-only,
// currentColor. Keys are the exact entry titles from site.portfolio; the
// coverage test fails in both directions, so a renamed or added project
// forces its mark to move with it. Category marks stay on the group headers.
export const PROJECT_GLYPHS = {
  // ── ERP & HR Platforms ──────────────────────────────────────────────
  'Enterprise ERP Transformation Program': () => (
    <Mark>
      <circle cx="32" cy="32" r="10" />
      <rect x="26" y="4" width="12" height="10" rx="2" /><rect x="26" y="50" width="12" height="10" rx="2" />
      <rect x="4" y="26" width="10" height="12" rx="2" /><rect x="50" y="26" width="10" height="12" rx="2" />
      <path d="M32 14v8M32 42v8M14 32h8M42 32h8" />
    </Mark>
  ),
  'Payroll Implementation — 1,600 Employees': () => (
    <Mark>
      <rect x="6" y="16" width="52" height="32" rx="4" />
      <circle cx="32" cy="32" r="9" />
      <path d="M14 24v16M50 24v16" />
    </Mark>
  ),
  'Central Employee Information System': () => (
    <Mark>
      <ellipse cx="32" cy="14" rx="22" ry="7" />
      <path d="M10 14v36c0 4 10 7 22 7s22-3 22-7V14" />
      <circle cx="32" cy="32" r="6" /><path d="M22 50c1-6 5-9 10-9s9 3 10 9" />
    </Mark>
  ),
  'Performance Management System': () => (
    <Mark>
      <path d="M8 44a24 24 0 0 1 48 0" />
      <path d="M32 44 46 26" /><circle cx="32" cy="44" r="4" />
      <path d="M12 44h-4M56 44h4M32 16v-4" />
    </Mark>
  ),
  'ERP Accounting Module': () => (
    <Mark>
      <path d="M32 10v44M14 18h36" />
      <path d="M14 18 8 34h12L14 18ZM50 18l-6 16h12l-6-16Z" />
      <path d="M24 54h16" />
    </Mark>
  ),
  'Employment Agreements Module': () => (
    <Mark>
      <rect x="14" y="6" width="36" height="52" rx="4" />
      <path d="M22 18h20M22 26h20M22 34h12" />
      <path d="M22 48c3-4 6 2 9-2s6 2 11-2" />
    </Mark>
  ),
  'HR & Internal Helpdesk': () => (
    <Mark>
      <path d="M12 36v-6a20 20 0 0 1 40 0v6" />
      <rect x="8" y="34" width="10" height="14" rx="4" /><rect x="46" y="34" width="10" height="14" rx="4" />
      <path d="M52 48c0 6-8 8-14 8" />
    </Mark>
  ),
  'Performance Evaluation Form Automation': () => (
    <Mark>
      <rect x="12" y="8" width="40" height="48" rx="4" />
      <path d="M19 20l3 3 6-6M32 21h13M19 34l3 3 6-6M32 35h13" />
      <path d="M19 48h10" />
    </Mark>
  ),
  'ERP eLearning Evaluation': () => (
    <Mark>
      <path d="M32 12 6 24l26 12 26-12L32 12Z" />
      <path d="M16 30v12c0 4 7 8 16 8s16-4 16-8V30" />
      <path d="M58 26v14" />
    </Mark>
  ),

  // ── Recruitment & Onboarding ────────────────────────────────────────
  'Multi-Company Recruitment Platform': () => (
    <Mark>
      <rect x="6" y="24" width="14" height="32" rx="2" /><rect x="25" y="12" width="14" height="44" rx="2" />
      <rect x="44" y="30" width="14" height="26" rx="2" />
      <path d="M12 56v-6M31 56v-6M50 56v-6" />
    </Mark>
  ),
  'Recruitment Automation with Executive Email Approvals': () => (
    <Mark>
      <rect x="6" y="14" width="40" height="30" rx="4" />
      <path d="M6 18l20 16 20-16" />
      <circle cx="50" cy="46" r="10" /><path d="M45 46l4 4 7-7" />
    </Mark>
  ),
  'ERP Recruitment Module': () => (
    <Mark>
      <circle cx="26" cy="22" r="9" />
      <path d="M10 52c1-9 7-14 16-14 4 0 7 1 10 3" />
      <circle cx="46" cy="46" r="8" /><path d="M46 34v-3M46 61v-3M34 46h-3M61 46h-3" />
    </Mark>
  ),
  'Async Interview Platform': () => (
    <Mark>
      <path d="M8 12h48v30H26l-12 10V42H8V12Z" />
      <path d="M28 20v14l11-7-11-7Z" />
    </Mark>
  ),

  // ── Lending & Credit ────────────────────────────────────────────────
  'Loan Origination System': () => (
    <Mark>
      <rect x="10" y="6" width="34" height="46" rx="4" />
      <path d="M18 18h18M18 26h18M18 34h10" />
      <circle cx="47" cy="47" r="11" /><path d="M47 41v12M42 49l5 4 5-4" />
    </Mark>
  ),
  'Universal Finance System': () => (
    <Mark>
      <circle cx="32" cy="32" r="24" />
      <ellipse cx="32" cy="32" rx="11" ry="24" />
      <path d="M8 32h48M12 20h40M12 44h40" />
    </Mark>
  ),
  'Credit Approval Queuing': () => (
    <Mark>
      <rect x="20" y="6" width="30" height="38" rx="3" />
      <rect x="14" y="12" width="30" height="38" rx="3" />
      <rect x="8" y="18" width="30" height="38" rx="3" />
      <path d="M16 40l5 5 10-10" />
    </Mark>
  ),
  'Nextbank Companion App — Microloan Operations': () => (
    <Mark>
      <rect x="18" y="4" width="28" height="56" rx="6" />
      <circle cx="32" cy="30" r="9" /><path d="M32 25v10M29 28h6" />
      <path d="M28 52h8" />
    </Mark>
  ),
  'Nextbank Companion App — Sister Lending Company': () => (
    <Mark>
      <rect x="8" y="12" width="24" height="40" rx="5" />
      <rect x="32" y="12" width="24" height="40" rx="5" />
      <path d="M26 32h12" />
    </Mark>
  ),
  'Nextbank Core Implementation — Sister Lending Company': () => (
    <Mark>
      <path d="M8 24 32 8l24 16" />
      <path d="M14 28v20M26 28v20M38 28v20M50 28v20" />
      <path d="M8 54h48" />
    </Mark>
  ),
  'MSME Credit Risk Framework': () => (
    <Mark>
      <path d="M32 6 54 14v16c0 14-9 22-22 28C19 52 10 44 10 30V14l22-8Z" />
      <path d="M32 20v14" /><circle cx="32" cy="42" r="1.5" />
    </Mark>
  ),

  // ── Collections & Recovery ──────────────────────────────────────────
  'Unified Collection Tool': () => (
    <Mark>
      <path d="M8 10h48L38 32v16l-12 8V32L8 10Z" />
      <circle cx="32" cy="20" r="3" />
    </Mark>
  ),
  'Collection Queuing System': () => (
    <Mark>
      <circle cx="14" cy="26" r="8" /><circle cx="32" cy="26" r="8" /><circle cx="50" cy="26" r="8" />
      <path d="M14 48h30M38 42l6 6-6 6" />
    </Mark>
  ),
  'Collection Automation Platform': () => (
    <Mark>
      <circle cx="24" cy="30" r="14" /><path d="M24 22v16M19 26h10" />
      <circle cx="48" cy="46" r="9" /><path d="M48 34v-3M48 61v-3M36 46h-3M63 46h-3" />
    </Mark>
  ),
  'Field Collection Tool': () => (
    <Mark>
      <path d="M20 22c0-8 24-8 24 0l4 26c1 6-33 6-32 0l4-26Z" />
      <path d="M24 22v-6c0-6 16-6 16 0v6" />
      <path d="M28 38h8" />
    </Mark>
  ),
  'Tele Collection Tool': () => (
    <Mark>
      <path d="M14 8c22 0 36 14 36 36l-10 4-6-12 6-6c-4-8-8-12-16-16l-6 6-12-6 8-6Z" />
      <path d="M40 14c6 3 9 6 12 12" />
    </Mark>
  ),
  'Legal & Remedial Case Management': () => (
    <Mark>
      <rect x="8" y="46" width="24" height="8" rx="2" />
      <path d="M22 42l16-16" /><rect x="34" y="12" width="12" height="12" rx="2" transform="rotate(45 40 18)" />
      <path d="M46 30l10 10" />
    </Mark>
  ),

  // ── Field & Branch Operations ───────────────────────────────────────
  'Field Itinerary Management — Uniformed Personnel': () => (
    <Mark>
      <rect x="10" y="10" width="36" height="46" rx="4" />
      <path d="M18 22h20M18 30h20" />
      <path d="M18 40c6 0 6 8 12 8s6-8 12-8" />
      <circle cx="50" cy="14" r="6" />
    </Mark>
  ),
  'Field Itinerary Management — Civilian Personnel': () => (
    <Mark>
      <rect x="8" y="12" width="48" height="42" rx="4" />
      <path d="M8 24h48M20 6v10M44 6v10" />
      <path d="M18 36c8 0 8 10 14 10s7-8 14-10" />
    </Mark>
  ),
  'ATM Inventory & Movement Tracking': () => (
    <Mark>
      <rect x="16" y="6" width="32" height="52" rx="4" />
      <rect x="22" y="12" width="20" height="12" rx="2" />
      <path d="M22 32h20M22 40h12M26 52h12" />
    </Mark>
  ),
  'Local Bank & Passbook Inventory System': () => (
    <Mark>
      <path d="M32 14c-6-5-14-5-22-3v38c8-2 16-2 22 3 6-5 14-5 22-3V11c-8-2-16-2-22 3Z" />
      <path d="M32 14v38" />
      <path d="M16 22h8M40 22h8M16 30h8M40 30h8" />
    </Mark>
  ),
  'Pouch Receiving System': () => (
    <Mark>
      <path d="M24 16c-8 6-14 14-14 24 0 10 10 16 22 16s22-6 22-16c0-10-6-18-14-24" />
      <path d="M24 16c0-6 16-6 16 0s-16 6-16 0Z" />
      <path d="M26 40l5 5 8-9" />
    </Mark>
  ),
  'Client Updater': () => (
    <Mark>
      <circle cx="26" cy="22" r="9" />
      <path d="M10 52c1-9 7-14 16-14" />
      <path d="M40 42a10 10 0 1 1-2 12" /><path d="M38 40v6h6" />
    </Mark>
  ),
  'Online Marketing Representative Automation': () => (
    <Mark>
      <path d="M8 30 44 14v32L8 34v-4Z" />
      <path d="M16 36v10c0 4 8 4 8 0v-8" />
      <path d="M50 22c4 2 4 8 0 10M54 16c8 4 8 18 0 22" />
    </Mark>
  ),

  // ── Finance Automation ──────────────────────────────────────────────
  'Request-for-Payment Automation': () => (
    <Mark>
      <rect x="8" y="10" width="32" height="44" rx="4" />
      <path d="M16 22h16M16 30h16M16 38h10" />
      <path d="M44 32h14M52 26l6 6-6 6" />
    </Mark>
  ),
  'Budget Automation Tool': () => (
    <Mark>
      <circle cx="30" cy="34" r="22" />
      <path d="M30 12v22h22" />
      <path d="M46 18 30 34" />
    </Mark>
  ),

  // ── AI & Automation ─────────────────────────────────────────────────
  'AI Delivery Platform': () => (
    <Mark>
      <path d="M32 10 54 22v20L32 54 10 42V22l22-12Z" />
      <path d="M10 22l22 12 22-12M32 34v20" />
      <path d="M32 4v6" />
    </Mark>
  ),
  'Smart Improvement Recommendations': () => (
    <Mark>
      <path d="M32 8a14 14 0 0 1 8 25c-2 2-3 4-3 7H27c0-3-1-5-3-7a14 14 0 0 1 8-25Z" />
      <path d="M27 46h10M29 52h6" />
      <path d="M10 20l5 3M54 20l-5 3M32 2v4" />
    </Mark>
  ),
  'Zero-Touch Maintenance': () => (
    <Mark>
      <path d="M40 10a12 12 0 0 0-14 17L10 43a5 5 0 0 0 7 7l16-16a12 12 0 0 0 17-14l-8 8-8-2-2-8 8-8Z" />
      <circle cx="48" cy="48" r="9" />
    </Mark>
  ),
  'Discord AI Chat Assistant': () => (
    <Mark>
      <path d="M10 14h44v28H30l-14 12V42H10V14Z" />
      <circle cx="24" cy="28" r="2.5" /><circle cx="40" cy="28" r="2.5" />
    </Mark>
  ),
  'Telegram Assistant Bot': () => (
    <Mark>
      <path d="M56 10 8 30l14 6 4 16 8-10 14 10 8-42Z" />
      <path d="M22 36 46 18" />
    </Mark>
  ),
  'AI-Powered Development Workflow': () => (
    <Mark>
      <path d="M20 18 8 32l12 14M44 18l12 14-12 14" />
      <path d="M32 12 30 24l8 2-10 14 2-12-8-2 10-14Z" />
    </Mark>
  ),
  'Spec-Driven Development Practice': () => (
    <Mark>
      <rect x="10" y="8" width="44" height="48" rx="4" />
      <path d="M10 20h44M22 8v48" />
      <path d="M30 30h16M30 38h16M30 46h10" />
    </Mark>
  ),

  // ── Data & Analytics ────────────────────────────────────────────────
  'Executive Scoreboard Dashboard': () => (
    <Mark>
      <path d="M20 10h24v10a12 12 0 0 1-24 0V10Z" />
      <path d="M20 14h-8c0 8 3 12 8 12M44 14h8c0 8-3 12-8 12" />
      <path d="M32 32v10M24 50h16M28 42h8v8" />
    </Mark>
  ),
  'Department Delivery Dashboard': () => (
    <Mark>
      <rect x="6" y="10" width="52" height="40" rx="4" />
      <path d="M6 20h52M12 15h4" />
      <path d="M14 42V32M24 42V28M34 42v-8M14 42h36" />
      <circle cx="48" cy="30" r="5" />
    </Mark>
  ),
  'Data Loader Automation': () => (
    <Mark>
      <path d="M32 6v22M24 20l8 8 8-8" />
      <ellipse cx="32" cy="38" rx="20" ry="6" />
      <path d="M12 38v12c0 3 9 6 20 6s20-3 20-6V38" />
    </Mark>
  ),
  'Analytics Exchange': () => (
    <Mark>
      <path d="M10 22h36M38 14l8 8-8 8" />
      <path d="M54 42H18M26 34l-8 8 8 8" />
      <circle cx="10" cy="22" r="3" /><circle cx="54" cy="42" r="3" />
    </Mark>
  ),
  'Snowflake Ecosystem Modernization': () => (
    <Mark>
      <path d="M32 6v52M10 19l44 26M10 45l44-26" />
      <path d="M26 12l6 6 6-6M26 52l6-6 6 6" />
    </Mark>
  ),
  'Snowflake Openflow Exploration': () => (
    <Mark>
      <path d="M20 8v20M12 15l8 8 8-8" />
      <path d="M20 28c0 12 8 14 18 14h14M46 34l8 8-8 8" />
    </Mark>
  ),
  'Marketing Representative Intelligence': () => (
    <Mark>
      <circle cx="27" cy="27" r="17" />
      <path d="M40 40 56 56" />
      <path d="M18 31l6-6 5 4 7-9" />
    </Mark>
  ),
  'Marketing Representative Productivity Analysis': () => (
    <Mark>
      <circle cx="32" cy="36" r="20" />
      <path d="M32 36V22M32 36l9 6" />
      <path d="M26 8h12M32 8v8" />
    </Mark>
  ),

  // ── Internal Platforms ──────────────────────────────────────────────
  'Greenlight Document Workflow Platform': () => (
    <Mark>
      <rect x="22" y="6" width="20" height="52" rx="8" />
      <circle cx="32" cy="17" r="5" /><circle cx="32" cy="32" r="5" /><circle cx="32" cy="47" r="5" />
      <path d="M29 47l2 2 4-4" />
    </Mark>
  ),
  'Project & Workspace Hub': () => (
    <Mark>
      <circle cx="32" cy="32" r="7" />
      <rect x="6" y="6" width="12" height="12" rx="2" /><rect x="46" y="6" width="12" height="12" rx="2" />
      <rect x="6" y="46" width="12" height="12" rx="2" /><rect x="46" y="46" width="12" height="12" rx="2" />
      <path d="M18 18l9 9M46 18l-9 9M18 46l9-9M46 46l-9-9" />
    </Mark>
  ),
  'Policy Hub': () => (
    <Mark>
      <path d="M14 8h30a6 6 0 0 1 6 6v42H20a6 6 0 0 1-6-6V8Z" />
      <path d="M14 44a6 6 0 0 0 6 6h30" />
      <path d="M24 20h16M24 28h16" />
    </Mark>
  ),
  'Team Workspaces Platform': () => (
    <Mark>
      <circle cx="24" cy="26" r="13" />
      <circle cx="40" cy="26" r="13" />
      <circle cx="32" cy="41" r="13" />
    </Mark>
  ),
  'Bucketlist V2 Modernization': () => (
    <Mark>
      <path d="M14 22h36l-5 32H19l-5-32Z" />
      <path d="M18 22a14 9 0 0 1 28 0" />
      <path d="M25 36l5 6 10-11" />
    </Mark>
  ),
  'Room & Parking Reservation': () => (
    <Mark>
      <circle cx="20" cy="24" r="12" /><circle cx="20" cy="24" r="4" />
      <path d="M29 33 54 58M44 48l6-6M50 54l6-6" />
    </Mark>
  ),
  'Transaction Queuing — Partner Organization': () => (
    <Mark>
      <path d="M8 20h48v8a5 5 0 0 0 0 8v8H8v-8a5 5 0 0 0 0-8v-8Z" />
      <path d="M24 20v24" strokeDasharray="4 5" />
      <path d="M34 30h14M34 36h10" />
    </Mark>
  ),
}
