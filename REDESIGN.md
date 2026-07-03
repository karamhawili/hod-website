# CLAUDE.md — HOD Website (House of Design)

## What this project is

Marketing website for House of Design (HOD), an interior design studio in Beirut.
Built ~4 months ago, deployed on Vercel. We are now doing a **partial redesign**.

## Current mission (READ THIS FIRST)

Redesign of the following, and ONLY the following:

1. **Landing page** (`/`) — currently: Hero, FeaturedProject, LatestProjects,
   AboutSection, InstagramGrid, Recognition. All of this gets wiped and rebuilt.
2. **About page** (`/about`) — currently AboutHero, AboutWorkWithUs,
   AboutFounder, AboutServices. Wiped and rebuilt.
3. **Navigation** (`src/components/Navigation`) — global, rebuilt from scratch.
4. **Footer** (`src/components/Footer`) — global, rebuilt from scratch.
   The `showGradient` prop and gradient styling die with the redesign.

**Open decision (ask before assuming):** `/join-us` currently exists as its own
route. It may fold into the new about page or stay separate. Do not touch it
until this is decided.

**Out of scope — do not modify:** `/portfolio`, `/project/[slug]`, the
PageBuilder system (`src/components/PageBuilder`, `src/sanity/schemaTypes/blocks/*`,
`pageBuilder.ts`), and the `project` + `category` schemas. These serve the
project detail pages and must keep working exactly as they do now.
Do NOT reuse the existing PageBuilder blocks for the new landing/about pages —
they belong to the old design language.

### Design direction

- Primary reference: **k-studio.gr** (minimal editorial architecture-studio
  aesthetic). Reference screenshots live in `/design-refs/` when provided —
  always look at them before building a section.
- We take the _structure and rhythm_ from the reference — full-bleed sections,
  editorial feed layout, all-caps labels, monochrome palette, photography-first —
  but we do NOT copy it 1:1. Everything is expressed through OUR tokens.
- Aesthetic rules: white background, near-black text, no accent colors,
  **no gradients, no script fonts** (both exist in the old tokens and are being
  removed). Photography and video carry the visual weight.
- Animation rules: subtle only — fade/translate on scroll-into-view (a
  `useScrollAnimation` hook already exists in `src/hooks`, evaluate whether to
  reuse or replace), navbar scroll transition, hover zoom on images.
  NO parallax, NO cursor followers, NO loading screens, NO scroll-jacking.

## Stack (verified against actual code)

- Next.js 16 (App Router), React 19, TypeScript
- **Styling: CSS Modules + CSS custom properties in `src/app/globals.css`.**
  styled-components appears in package.json ONLY as a Sanity Studio dependency —
  never write app UI with it.
- Sanity v5 via `next-sanity`. Studio embedded at `/studio`.
  Data fetching uses the **Live Content API** (`defineLive` / `sanityFetch` in
  `src/sanity/lib/live.ts`, `<SanityLive />` in root layout) — not plain ISR.
- Fonts loaded via `next/font/google` in `src/app/layout.tsx`:
  currently Cormorant Garamond (serif), Darker Grotesque (sans),
  Great Vibes (script — to be removed in redesign). Font choices for the new
  design are a Phase 2 decision.
- Types: currently **hand-written** in `src/types/sanity.ts`. A typegen script
  exists in package.json but is not in use (no extract.json / generated types).
  Whether to adopt typegen properly is an audit-phase decision — until then,
  follow the existing hand-written pattern consistently.
- Deployed on Vercel, `@vercel/analytics`.

## Design system

- `globals.css` already has a token layer, but it encodes the OLD aesthetic
  (brown palette `--color-brown-*`, `--surface-gradient`, `--font-script`).
  Phase 2 = **replace/prune these tokens**, not create from zero. Keep the
  structural tokens that still make sense (`--container-*`, `--content-*` width
  scale, `--section-padding`) and re-value them as needed.
- All NEW components MUST consume tokens. No hardcoded hex values, no magic px
  spacing, no one-off font sizes. (Old module.css files contain hardcoded
  `#333`/`#666`/`#fff` — do not repeat that pattern; do not "fix" it in
  out-of-scope files either.)
- Out-of-scope pages are NOT migrated to new tokens. If removing an old token
  would break an out-of-scope page, keep the old token alive (possibly marked
  deprecated) and flag it.

## CMS rules

- The current landing/about pages are mostly **hardcoded JSX** — only
  FeaturedProject/LatestProjects pull from Sanity. Making the new pages
  CMS-configurable means NEW schema work:
  - `homePage` singleton (hero media, intro text, feed/section content, ordering)
  - `aboutPage` singleton
  - `siteSettings` singleton (contact info, socials, footer content, nav labels)
- New pages are **content-editable, not layout-builder**: layouts are fixed in
  code; the client edits text, images, media, and the order of feed items.
  Do NOT build a drag-and-drop section builder for these pages.
- Schema comes FIRST for any new page: propose schema → get approval → build
  components → wire GROQ via the existing `sanityFetch` pattern in
  `src/sanity/lib/queries.ts`.
- Register new schemas in `src/sanity/schemaTypes/index.ts` and add singletons
  to the desk structure in `src/sanity/structure.ts`.
- Every new schema field needs a sensible `title` and, where non-obvious, a
  `description` — the client is non-technical.

## Working rules

- **Plan mode first** for anything non-trivial. Propose, wait for approval, build.
- Small commits, one logical unit each (one section = one commit).
- Never modify: Sanity project ID/dataset/env (`src/sanity/env.ts`), deployment
  config, `next.config.ts`, or any route outside the mission scope, without asking.
- Never commit secrets. `.env.local` stays untouched and unread unless asked.
- If a fix outside scope seems needed (e.g., a broken query in an old page),
  FLAG it, don't fix it silently.
- When uncertain between two implementations, ask — don't pick silently.
- Match existing conventions: CSS Modules co-located with components,
  component-per-folder structure, `_components` folders for route-private
  components, path alias `@/`.

## Phases (current status: Phase 1)

- [ ] Phase 1 — Audit of existing code (report only, no changes). Include:
      Live API setup correctness, hand-written types vs typegen decision,
      GROQ query hygiene, image pipeline usage.
- [ ] Phase 1.5 — Approved fixes from audit (isolated commits)
- [ ] Phase 2 — Token replacement in globals.css + font decision
- [ ] Phase 3 — Navigation + Footer redesign
- [ ] Phase 4 — Landing page (schema → components → GROQ → polish)
- [ ] Phase 5 — About page (+ join-us decision)
- [ ] Phase 6 — Responsive + QA pass

Update the checkboxes as phases complete.
