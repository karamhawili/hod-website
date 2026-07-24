# REDESIGN.md — HOD Website Visual + Structural Overhaul

Companion to CLAUDE.md (which imports this file). Covers everything specific
to the redesign mission. Delete the import + this file once all phases below
ship. Detailed build history lives in Audit.md's changelog — this file is
intent + current-state, Audit.md is the dated record of what happened.

## Reference history (context — don't rebuild toward superseded entries)

1. k-studio.gr — initial reference. Shipped as the old Phases 2–5 (tokens,
   nav/footer, landing, studio page) — see Audit.md changelog for the dated
   record. **Superseded.**
2. **vincentvanduysen.com — current and final reference.** Everything below
   describes this direction. Supersedes the k-studio-era brown/warm-neutral
   palette, Manrope/Inter fonts, and the editorial-feed landing layout.
   Client approved extra scope/cost for this pivot — no sign-off gate before
   building.

Screenshots: `/design-refs/vvd/` (landing carousel, cursor guidelines,
project detail hero + scroll, archive grid, about, contact, publications).

## Current-state facts about the codebase (still true post-pivot)

These survive from the earlier build and are easy to miss from a code skim:

- **The embedded Sanity Studio lives at `/admin`** (moved from `/studio` in the
  earlier build to free that route for the public Studio page). The client's
  CMS URL is `/admin`. Do not move it back.
- **`useScrollAnimation` hook exists in `src/hooks`** — relevant to Phase 5's
  scroll work; evaluate reuse vs replace, don't assume it's absent.
- **Hardcoded hex anti-pattern:** old `*.module.css` files contain literal
  `#333`/`#666`/`#fff`. Don't repeat this in new code; don't "fix" it in
  out-of-scope files either.
- **Schema registration is manual:** register new schemas in
  `src/sanity/schemaTypes/index.ts`; add singletons to the desk structure in
  `src/sanity/structure.ts`. GROQ goes through the existing `sanityFetch`
  pattern in `src/sanity/lib/queries.ts`.
- ~~Nav `theme` prop + Footer `showGradient` prop~~ — **removed in Phase 6**
  (Audit.md C1/C2 closed). The rebuilt `/project/[slug]` renders no chrome at
  all (close ✕ only), and no other page passes either prop.

## What VVD actually is (read before building anything)

Not a scrolling marketing site. Three distinct interaction modes:

### 1. Landing — project viewer (the hard part)

- One project fills the viewport at a time, showing one image from its gallery.
- **Horizontal input** (click/hover left or right screen edge, cursor becomes
  a chevron) → cycles through _that project's_ images.
- **Vertical input** (scroll, or hover top/bottom band → chevron up/down
  appears) → moves to the _next/previous project_ entirely.
- No click-to-open on the image itself — the whole surface is claimed by the
  directional hover zones. Instead: an explicit **"Go to project →"** CTA,
  confident and visible on desktop (deliberately clearer than VVD's own quiet
  "More info" — we're improving on that specifically).
- **This is our one deliberate exception to "no scroll-jacking."** Scroll
  input on the landing is intentionally intercepted and mapped to
  project-to-project navigation. Nowhere else does this — every other page
  (Archive, Studio, project detail, Contact, Join Us) is normal, unmodified
  document scroll.

### 2. Project detail page

- Opens with project info at top: title, location, year (see
  `Project_details_page_hero.png`), then description copy, then credits line.
- Below: the **same ordered image list** from the landing carousel, now a
  normal vertical scroll, one image after another.
- Images respect **native aspect ratio**, width-capped by the page
  max-width/margins (not full-bleed, not cropped to a fixed ratio).
- **Mobile:** images go full viewport width, height auto (ratio preserved,
  width fixed instead of capped by margin).

### 3. Archive page (replaces `/portfolio` — rebuild, then rename)

- Grid of all projects — the "see everything" page, since the landing viewer
  only shows one project at a time and isn't built for browsing the catalog.
- Reference: `Screenshot_2026-07-23_at_1_54_02_AM.png` — simple grid,
  thumbnail + name/location/status line underneath, no card chrome.
- **Category filter** as an indented sub-list under "Archive" in the left nav
  (`All` + categories), mirroring VVD's own Archive sub-nav — NOT a mega-menu,
  just a flat filter list. Categories (confirmed in Phase 4): **Residential /
  Restaurants / Beach Clubs / Lounges & Bars / Other**.
- Search bar (top-right on VVD's version): **deferred, not in this build**
  unless the catalog grows enough to need it.

### 4. Every other page (Studio/About, Contact, Publications, Join Us)

- Plain vertical scroll, no carousel behavior.
- Images float free at native aspect ratio — multiple ratios on one page is
  intentional and organic, not a bug to normalize into a grid.

### Mobile interaction (landing viewer)

- Horizontal swipe = image-to-image (mirrors desktop left/right).
- Vertical swipe = project-to-project (mirrors desktop up/down).
- Tap anywhere on the image = open project detail (no hover-zone ambiguity on
  touch, so tap safely means "open" — unlike desktop click).

### Nav taxonomy

- No mega-menu. Visual quietness over category depth.
- Only exception: **Archive's category filter**, shown as a simple indented
  sub-list under "Archive" when that section is active — same pattern VVD uses
  for Info/Press sub-items, not a hover-triggered mega-menu.

## Design direction (supersedes k-studio-era rules)

- Palette: near-monochrome — warm off-white background, near-black text,
  very restrained brown-black title treatment (à la VVD), not k-studio-era
  brown-as-accent. Exact values set in Phase 2 token pass.
- Typography: serif display (project + page titles) + clean sans body,
  mirroring VVD's serif/sans pairing. Exact fonts are a Phase 2 decision —
  the earlier Manrope/Inter pairing is superseded, re-choose for VVD.
- No gradients, no script fonts (still true from earlier direction).
- Whitespace is extreme. Nav is a slim, quiet, left-aligned text stack — not a
  bar, not centered, not boxed.

## Stack (verified against actual code)

- Next.js 16 (App Router), React 19, TypeScript.
- **Styling: CSS Modules + CSS custom properties in `src/app/globals.css`.**
  styled-components is in package.json ONLY as a Sanity Studio dependency —
  never write app UI with it.
- Sanity v5 via `next-sanity`, Live Content API (`defineLive` / `sanityFetch`
  in `src/sanity/lib/live.ts`, `<SanityLive />` in root layout) — not plain ISR.
- TypeGen is adopted (`overloadClientMethods: false`; generated
  `src/sanity/sanity.types.ts` committed) — see Audit.md C4. In-scope rebuilds
  should adopt generated `*_QUERY_RESULT` types; hand-written `src/types/sanity.ts`
  survives only for not-yet-migrated consumers.
- Deployed on Vercel, `@vercel/analytics`.

## CMS — project schema (full rebuild, not incremental)

The existing PageBuilder-based `project` schema is **dropped entirely**. This
reverses the earlier "PageBuilder is out of scope, do not touch" rule — that
rule applied to the k-studio-era mission and no longer holds. New schema is
intentionally minimal:

```ts
{
  name: 'project',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'location', type: 'string' },     // "Lisbon, Portugal"
    { name: 'year', type: 'string' },          // "2025" / "2024–2025"
    { name: 'status', type: 'string' },        // "In progress"/"On hold"/"Completed" — archive captions
    { name: 'category', type: 'reference', to: [{ type: 'category' }] },
    { name: 'description', type: 'array', of: [{ type: 'block' }] },
    { name: 'credits', type: 'string' },       // "Photos by X"
    { name: 'images', type: 'array', of: [{
        type: 'image', fields: [{ name: 'alt', type: 'string' }]
      }] },                                    // ordered — drives BOTH landing
                                                 // carousel AND detail scroll
    { name: 'featured', type: 'boolean' },     // included in landing rotation
  ]
}
```

`category` schema: simple `{ title, slug }` — Residential / Restaurants /
Beach Clubs / Lounges & Bars / Other (confirmed; documents created in Studio).

**Dropped entirely:** `pageBuilder.ts`, all `blocks/*` schemas (`heroBlock`,
`imageDetailsBlock`, `imageBlock`, `imagePairBlock`, `mixedImagePairBlock`,
`centeredTextBlock`), the `PageBuilder` component tree, and every
`PageBuilderBlock[]` consumer in `src/types/sanity.ts`. Once these are gone,
the old tokens/fonts they depended on (`--color-brown-*`,
`--font-serif/sans/script`, `--surface-gradient`, the `Section` component) can
finally be retired — the earlier build couldn't delete them because the
project page still consumed them.

**CMS re-evaluation needed for:** ~~`homePage` singleton~~ (resolved in
Phase 5: deleted entirely — the viewer landing needs no CMS document, it
renders featured projects directly), `siteSettings` (nav labels may need the
Archive category list), `studioPage` (content model likely survives; revisit
visual treatment only).

## Working rules

- **Plan mode first** for anything non-trivial. Propose, wait for approval, build.
- Small commits, one logical unit each.
- The Phase 5 scroll-jack is the ONLY place allowed to intercept native scroll.
  If scroll interception is proposed anywhere else, flag it — don't build it.
- Never modify Sanity env (`src/sanity/env.ts`), deployment config, or
  `next.config.ts` without asking.
- Never commit secrets; `.env.local` untouched/unread unless asked.
- Out-of-scope fix needed → FLAG, don't silently fix.
- Uncertain between two implementations → ask, don't pick silently.
- Match conventions: CSS Modules co-located with components,
  component-per-folder, `_components` for route-private components, `@/` alias.

## Phases (renumbered — this list supersedes the old one in Audit.md/history)

- [x] Phase 1 — Audit (infra findings still valid post-pivot; see Audit.md)
- [x] Phase 1.5 — Approved fixes (typegen, GROQ split, `.npmrc`)
- [x] Phase 2 — VVD token pass: palette, type scale, spacing, font re-choice
      (supersedes shipped k-studio-era tokens)
- [x] Phase 3 — Nav + Footer restyle for VVD quietness (structure from earlier
      build likely survives; visual treatment does not)
- [x] Phase 4 — Project schema rebuild (drop PageBuilder) + category taxonomy
- [x] Phase 5 — Landing project-viewer (hard build: two-axis nav, hover-zone
      cursor states, scroll-jack, touch gestures, "Go to project" CTA)
- [x] Phase 6 — Project detail page (info header + native-ratio scroll body).
      Retires the Nav `theme` / Footer `showGradient` props if nothing else
      needs them.
- [ ] Phase 7 — Archive page (grid + category filter; replaces `/portfolio`,
      retires `LatestProjects`)
- [ ] Phase 8 — Studio/About + Join Us visual pass (content model mostly
      survives; restyle only)
- [ ] Phase 9 — Responsive + QA pass; retire now-orphaned old tokens/fonts/
      `Section` once PageBuilder is fully gone

## Open items (both Phase 4 blockers resolved 2026-07-25)

- **Category list — confirmed:** Residential / Restaurants / Beach Clubs /
  Lounges & Bars / Other (hospitality-leaning; user rejected the generic list).
- **Content migration — confirmed: clean break.** No migration script; the
  user deletes old project docs in `/admin` and re-enters manually. Landing/
  portfolio feeds are empty until re-entry (query shims keep them rendering
  new-schema docs meanwhile).
