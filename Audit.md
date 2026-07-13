# Audit Tracker — HOD Redesign (Phase 1.5)

Living record of audit findings and their remediation status. Companion to the Phase 1 audit report.

**Legend:** ⬜ TODO · 🟦 IN PROGRESS · ✅ DONE · ⛔ BLOCKED (needs decision) · ⏳ DEFERRED (belongs to a later phase) · ❌ WON'T-FIX

---

## 🔴 Critical

> Reality-check: none of the four criticals is a present-tense bug. C1–C3 are **constraints for the Phase 3 Nav/Footer rebuild** — there is no safe code change to land today without starting that rebuild (which also skips Phase 2 token work). C4 is the only Phase-1.5-actionable item, and it is gated on the typegen go/no-go decision.

| # | Status | Item | Notes / plan |
|---|--------|------|--------------|
| C1 | ⏳ DEFERRED → Phase 3 | Footer `showGradient` consumed by out-of-scope `/project/[slug]` & `/join-us` | Not a bug now. Constraint: the rebuilt Footer must keep accepting `showGradient` (may ignore it visually) until project pages are migrated. Encoded here so it isn't dropped. |
| C2 | ⏳ DEFERRED → Phase 3 | Navigation `theme` consumed by out-of-scope `/project/[slug]` | Constraint: rebuilt Navigation must preserve the `theme="light"` API. |
| C3 | ⏳ DEFERRED → Phase 3 | Nav/Footer rendered per-route (5 files), not in layout | Verified a clean hoist into a shared layout is **blocked**: `/project/[slug]` computes `theme={hasContent ? …}` from data it fetches itself, so its Nav can't move to a layout without a refetch. Resolve as part of the Phase 3 rebuild, not now. |
| C4 | ✅ DONE | `@/types/sanity` imported by 10 out-of-scope files → type change ripples | **Adopted TypeGen without rippling into out-of-scope files.** Pipeline configured, `src/sanity/sanity.types.ts` generated & committed, `tsc --noEmit` clean. Consumer migration deferred by design (see below). |

**C4 — ADOPTED TYPEGEN. What shipped:**

- ✅ `typegen` block in `sanity.cli.ts` (`path`, `schema` → `src/sanity/extract.json`, `generates` → `src/sanity/sanity.types.ts`). This is the actual **S5** fix — the script was fine; the missing config told `typegen generate` where to read the schema.
- ✅ Gitignored the intermediate `src/sanity/extract.json`; committed the generated `src/sanity/sanity.types.ts` (911 lines).
- ✅ **`overloadClientMethods: false`** — critical setting. `true` retypes every existing `sanityFetch()` to generated types, which conflicts with the hand-written `PageBuilderBlock[]` still consumed by the out-of-scope project page and **breaks `next build`** (verified: 1 error at `project/[slug]/page.tsx`). With `false`, existing code compiles unchanged and generated `*_QUERY_RESULT` types are available for opt-in import.
- ✅ Verified `npx tsc --noEmit` is clean (0 errors) after the change. (A stale `tsconfig.tsbuildinfo` briefly masked this — cleared it.)
- ⏳ **Migrate consumers** — deferred by design. In-scope files adopt generated types during their rebuild (Phase 3/4); out-of-scope PageBuilder/project files keep importing `@/types/sanity` until those pages are migrated (the exact ripple C4 warns about). Flip `overloadClientMethods` back to `true` once every consumer uses generated types.

> Note: the committed `sanity.types.ts` matches `overloadClientMethods: false`, so re-running `npm run typegen` reproduces it identically.

---

## 🟠 Should-fix (awaiting green light after critical review)

| # | Status | Item |
|---|--------|------|
| S1 | ✅ DONE | Split `queries.ts` into `LIST_FIELDS` (no page-builder `content`) for the three list queries + `DETAIL_FIELDS` (listing + content) for `PROJECT_PAGE_QUERY`. Cards no longer fetch the full project-page payload. Verified: no `content` consumer among list callers, `tsc` clean, detail query unchanged in shape. **Follow-up:** re-run `npm run typegen` to refresh the generated `*_QUERY_RESULT` shapes (harmless while stale — nothing consumes them with `overloadClientMethods: false`). |
| S2 | ⏳ DEFERRED → Phase 4 (confirmed) | Waterfall in home `page.tsx`. `page.tsx` is wiped in Phase 4 → build with `Promise.all`/parallel fetch from the start. See carry-forward. |
| S3 | ⏳ DEFERRED → Phase 4 (confirmed) | Unnecessary `"use client"` on wiped components → new landing components default to server components. See carry-forward. |
| S4 | ⏳ DEFERRED → Phase 4 (confirmed) | Image opt. In-scope targets wiped → build optimized from the start. Out-of-scope `LatestProjects`/`ProjectsGrid` left untouched (flag only). See carry-forward. |
| S5 | ✅ DONE | ~~`typegen` npm script is misconfigured~~ Fixed by adding the `typegen` block to `sanity.cli.ts` (done as part of C4). Config loads; full run pending creds (see C4). |
| S6 | ✅ DONE | **New (surfaced in Phase 1.5):** `npm install`/`npm ci` fail without `--legacy-peer-deps` (`@sanity/color-input@4` peer-conflicts with `sanity@5`). Fixed by adding `.npmrc` (`legacy-peer-deps=true`); verified a plain `npm install` now succeeds. Follow-up (not blocking): upgrade `@sanity/color-input` to a Sanity-5-compatible release and drop the flag. |

---

## 🟡 Nice-to-have (backlog)

| # | Status | Item |
|---|--------|------|
| N1 | ⬜ TODO | `coalesce(location, category)` references a non-existent `category` field — dead fallback. |
| N2 | ⬜ TODO | `urlFor(...).url() \|\| ""` empty-string `src` → broken `<Image>` if image missing. |
| N3 | ⬜ TODO | GROQ orders by `_createdAt` but components re-sort by `year`; missing `sizes` on scaled images. |
| N4 | ⬜ TODO | Live API has no tokens / no `<VisualEditing/>` → no in-Studio preview. Fine for published-only; revisit if editors want live preview. |
| N5 | ⬜ TODO | Footer LinkedIn points to `company/addmindhospitality` — verify correct company. |
| N6 | ⬜ TODO | `useScrollAnimation` makes `Section` a client component site-wide; re-evaluate for the rebuild. |

---

## Phase 4 carry-forward (build it right, don't fix-then-delete)

The new landing/about components must be built to satisfy these — they replace the deferred should-fixes:

- **[S2]** Fetch project data in the server page with `Promise.all` (no sequential `await` waterfall). With `LIST_FIELDS` (S1 ✅) the payload is already trimmed.
- **[S3]** New components are **server components by default**; add `"use client"` only where there's real interactivity (state, effects, handlers).
- **[S4]** Standardize a Sanity image helper (`.width(...).auto('format')`, sane `quality`, proper `sizes`) and use it everywhere instead of raw `urlFor().url()` + `quality={100}`.
- **Also revisit (nice-to-have):** N2 (`url() || ""` empty-src), N3 (`sizes`, redundant client-side re-sort), N6 (`Section` client-only animation hook — CLAUDE.md flags re-evaluating `useScrollAnimation`).

**Also carried by out-of-scope coupling (from Criticals):** rebuilt Navigation must keep the `theme` prop (C2); rebuilt Footer must keep accepting `showGradient` (C1) until `/project/[slug]` migrates; layout hoist (C3) must account for the project route's data-derived nav theme.

**Out-of-scope, flagged only (not for this redesign):** S4 image opt on `LatestProjects`/`ProjectsGrid`; N5 (Footer LinkedIn URL); N1 (dead `category` coalesce).

## Phase 3 follow-ups (Nav/Footer + siteSettings)

- **Run `npm run typegen`** — the new `SITE_SETTINGS_QUERY` isn't in the generated types yet; `SiteSettings` is hand-written in `types/sanity.ts` for now (consistent with the transitional pattern).
- **Populate the `siteSettings` singleton** in Studio (`/studio` → Site Settings). Until then, Nav/Footer render hardcoded fallbacks matching the old content.
- **Client fixes via CMS:** placeholder phone `+961 1 234 567` and the LinkedIn URL (`company/addmindhospitality`, audit N5) — both still in the footer *fallback*; correct them by filling siteSettings.
- **"Join Us" nav link is provisional** pending the open `/join-us` decision (it's in `DEFAULT_NAV`).
- **Visual tune:** the inline `Logo` uses a cropped viewBox (`90 395 860 275`); verify in-browser it isn't clipped and looks right at header/footer sizes.
- **Out-of-scope note:** `/portfolio` + `/project/[slug]` now show the new global Nav/Footer (intended). The new fixed header is slightly taller — eyeball their top spacing.

## Phase 4 status (landing page)

- **Built (2026-07-09):** `homePage` singleton (hero video+image / intro / projects / studio / showcase), `HOME_PAGE_QUERY` + card projection + fallbacks, `.theme-redesign` base, `urlForSized` helper, `Reveal` wrapper, five server-component sections, `page.tsx` rebuilt. Old landing components (Hero, FeaturedProject, AboutSection, InstagramGrid, Recognition) deleted — no external importers; `Section`/`LatestProjects` kept for out-of-scope pages.
- **Carry-forwards resolved by construction:** S2 (no waterfall — one query, embedded derefs), S3 (server components; only `Reveal` is client), S4 (`urlForSized` + `sizes`, no `quality={100}`), N2 (no `url() || ""`), N6 (old animation hook not used by new pages).
- **User runtime steps:** populate Home Page in `/studio` (hero image required; optional video; pick projects; studio images; showcase project); visual pass vs `design-refs/landing-page/`.
- **Dropped from old landing (flag):** InstagramGrid + Recognition content has no home on the new landing by design — press could resurface on About (Phase 5) if wanted.

## Changelog

- **2026-07-05** — Tracker created. Criticals triaged: C1–C3 deferred to Phase 3 as rebuild constraints; C4 blocked pending typegen decision.
- **2026-07-05** — Decision: adopt TypeGen. Wired the pipeline: `typegen` block added to `sanity.cli.ts`, `src/sanity/extract.json` gitignored (S5 ✅). Installed deps (needed `--legacy-peer-deps` → logged as S6). Type generation blocked in-sandbox: Sanity v5 `schema extract` calls the project API and fails on a placeholder ID — needs an authenticated run of `npm run typegen`. No consuming code changed; out-of-scope pages untouched.
- **2026-07-05** — User generated `sanity.types.ts` locally. Caught that `overloadClientMethods: true` broke `next build` at the out-of-scope project page; set it to `false`, regenerated-equivalent output, verified `tsc --noEmit` clean. **C4 done.** All four criticals resolved (C4 fixed; C1–C3 documented as Phase-3 constraints).
- **2026-07-05** — Folded S6 into this pass: added `.npmrc` (`legacy-peer-deps=true`); verified a flagless `npm install` now succeeds. Left unstaged for user to commit. Awaiting green light before starting the remaining should-fix items (S1–S5).
- **2026-07-09** — Phase 4 iteration 3: feeds restructured from arbitrary scatter to the reference's **wide-card + offset-pair row grid** (reads intentional, shared rows); magazines removed from cards entirely → new **`studioSection.mentions`** schema field rendered as a text-only hairline press index (publication + line + ↗), defaults carry all old press + the image-less magazine features (NOUN/Love That Design/AD). tsc/eslint/typegen clean.
- **2026-07-09** — Phase 4 iteration 2 (user notes): headings Archivo→**Manrope**; intro statement smaller/tighter; sticky columns got a bottom image (new CMS field on both sections); StudioTeaser→**StudioFeed** — same treatment as ProjectsFeed but scrolling cards = press mentions + About Us + Join Us (`studioSection.cards` replaces `images`; old Recognition content as placeholder defaults); shared `FeedCard` extracted so both feeds stay identical; placeholders from existing public assets wherever CMS images are missing. tsc/eslint/typegen clean.
- **2026-07-09** — **Phase 4 built** (landing page, schema-first, k-studio structure adapted to our tokens per user refs). tsc/eslint/typegen all clean — typegen now runs locally (CLI reads .env.local). Zero out-of-scope files touched; deletions limited to wiped landing components. Details in "Phase 4 status" above.
- **2026-07-06** — Phase 3 design iteration 2: footer rebuilt against user refs (`design-refs/footer/`, primary: eleven.png) — inverted warm-dark ground (tokens flipped via color-mix, no new hex), two-zone layout with full-height vertical hairline, Menu/Studios/Connect index, hairline + meta row. Footer now also renders nav links (from siteSettings). Header: no border, more solid frosted bar + faint shadow, logo 34px→28px compress on scroll. Fonts switched Fraunces→Archivo earlier same day.
- **2026-07-06** — **Phase 3 built** (Nav + Footer + siteSettings singleton). Schema-first siteSettings (nav/contact/locations/socials) as a Studio singleton; Nav/Footer self-fetch it (so out-of-scope routes need no prop changes) with hardcoded fallbacks. New header = logo-left / all-caps links-right, sticky, transparent→frosted "mirror" on scroll, theme-aware color (keeps `theme` prop, C2). New editorial footer, warm tokens, no gradient (keeps `showGradient`, C1). Reusable inline `Logo` (currentColor). tsc + eslint clean; zero out-of-scope files touched. See Phase 3 follow-ups above.
- **2026-07-05** — Should-fix batch. **S1 done** (`queries.ts` LIST/DETAIL split; `tsc` clean). Flagged that **S2/S3/S4-in-scope target Phase-4-wiped files** → recommended deferring into the rebuild rather than fix-then-delete; S4's durable targets are out-of-scope portfolio and left untouched.
- **2026-07-05** — User chose to defer S2–S4 to Phase 4. Recorded as confirmed deferrals + added a "Phase 4 carry-forward" section so the rebuild implements them by construction. **Phase 1.5 audit remediation complete:** actioned C1–C4, S1, S5, S6; remainder deferred to Phase 2–4 with tracked rationale.
- **2026-07-05** — **Phase 2 done** (tokens + fonts). Added warm-neutral + brown token set + Fraunces/Inter to `globals.css`/`layout.tsx`; deprecated (kept) `--surface-gradient`/`--font-script`; corrected REDESIGN.md aesthetic rules (user kept brown, not monochrome). Old element defaults left on legacy tokens so out-of-scope pages are untouched. `tsc` clean; diff isolated to 3 files. **Runtime/visual verify (needs Sanity env) is the user's step.** Phase 3/4 carry-forward: add `.theme-redesign` base class; post-redesign cleanup deletes deprecated tokens + drops the 3 old font loads.
</content>
</invoke>
