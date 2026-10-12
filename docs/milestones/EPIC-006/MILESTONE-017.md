# MILESTONE-017 — Template Imagery & Optional Pexels

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-017 |
| Epic | EPIC-006 — Template System & Quality |
| Title | Template Imagery & Optional Pexels |
| Status | Done |
| Owner | Lead Engineering Agent |
| Depends on | M-013, M-014, M-015, M-016 |
| Blocks | — |
| PRD refs | FR-08, FR-04, FR-05, PA-06 |
| Decisions | DEC-006 |
| Estimated size | M |

## 2. Objective

Provide coherent bundled fallback imagery for both templates and an optional,
server-only Pexels provider that can supply illustrative imagery without ever
being required for site creation or rendering.

## 3. Background & rationale

D-06: there is no Pexels integration despite `PEXELS_API_KEY` in `.env.example`.
FR-08 requires high-quality, category-appropriate imagery with graceful fallback
and no dependency on an optional service. DEC-006 defines the priority and
labeling rules.

## 4. Scope (in scope)

- Curated bundled images under `public/templates/{real-estate,construction}/`
  for hero, service, about, and CTA slots, licensed for use.
- `shared/lib/images/pexels.ts` (server-only): search by query/orientation,
  returns results or `[]` (never throws); reads `PEXELS_API_KEY` via `env`.
- `GET /api/images/search?q=&orientation=` returning `{ success, data: { images: [] } }`.
- Add `images.pexels.com` to `next.config.ts` `remotePatterns`.
- Image slot resolution: uploads > Pexels > bundled.

## 5. Out of scope

- Upload flow (existing); editors (EPIC-004); rendering internals (M-014).

## 6. Dependencies & preconditions

- M-015/M-016 declare slots. OD-3 (key availability/attribution) — provider is
  optional; bundled defaults keep the app functional without a key.

## 7. Deliverables

- Add: `public/templates/real-estate/*`, `public/templates/construction/*`.
- Add: `shared/lib/images/pexels.ts`.
- Add: `app/api/images/search/route.ts` (thin) + `features/images/handlers.ts`
  (or a small shared handler) — envelope.
- Change: `next.config.ts` — `remotePatterns` for `images.pexels.com`.
- Change: template default content to reference bundled slot URLs.

## 8. Tasks

- **T01 — Bundled imagery** ✅
  - Work: curate and add images; consistent aspect ratios/treatment.
  - Done when: templates render with no missing images.
  - Result: 13 bundled photos under
    `public/templates/{real-estate,construction}/` (7 real-estate, 6
    construction), downloaded from the Pexels CDN (free-use license, no
    attribution required) at consistent widths (hero 1920px, services/about/
    gallery 1280px). Every subject verified against its Pexels page
    (`webfetch`, 2026-10-12): e.g. real-estate hero 106399 “two-story house
    with illuminated windows at dusk”, construction hero 1216589 “engineers in
    safety helmets reviewing plans on site”. `public/templates/README.md`
    records source, license, and per-file photo IDs (OD-3 evidence). Default
    content now references the bundled URLs for hero/mobile, about, gallery
    (real-estate), and all four service cards per template, all with
    `source: 'bundled'` and localized EN+AR alt text.
- **T02 — Pexels provider** ✅
  - Work: server-only search; timeouts; return `[]` on failure/no key.
  - Done when: no key ⇒ `[]`; failure ⇒ `[]`; success ⇒ mapped `{url,alt}`.
  - Result: `shared/lib/images/pexels.ts` — server-only, reads the optional
    `PEXELS_API_KEY` through the validated `env` proxy (lazy), calls
    `api.pexels.com/v1/search` with `orientation`/`per_page=12`,
    `AbortSignal.timeout(6000)`, `cache: 'no-store'`; returns `[]` on no key,
    blank query, non-OK status, network error, timeout, or malformed JSON —
    never throws. Verified with the real module under `tsx` with a stubbed
    `fetch`: **8/8 provider checks** (no-key ⇒ `[]`; success maps `{url,alt}`
    and drops malformed photos; returned URLs come from `images.pexels.com`
    only; `query`/`orientation` forwarded; non-OK ⇒ `[]`; network error ⇒
    `[]`; empty/blank query ⇒ `[]`).
- **T03 — Search endpoint** ✅
  - Work: validate `q`/`orientation`; envelope; no key leakage.
  - Done when: returns `{ success, data: { images } }` or empty list.
  - Result: `app/api/images/search/route.ts` (thin re-export) +
    `features/images/handlers.ts` — zod validates `q` (1–80 chars) and
    optional `orientation` enum; tenant-gated via `requireSession` (editors
    tool, consistent with `/api/media`); envelope
    `{ success: true, data: { images } }` / `{ success: false, error }` with
    400 (validation) / 401 (UNAUTHORIZED) / 500. The key never appears in the
    response. Runtime (dev): anonymous `GET /api/images/search?q=house` ⇒
    **401 `{"success":false,"error":"UNAUTHORIZED"}`** (auth gates before any
    provider access). Authenticated success-path end-to-end still needs a
    tenant session (MongoDB) + a real key — see handoff.
- **T04 — next.config + resolution** ✅
  - Work: allow Pexels host; implement uploads>pexels>bundled resolution.
  - Done when: rendered images use allowed hosts only.
  - Result: `next.config.ts` `remotePatterns` now includes `images.pexels.com`
    (alongside the S3 hosts). The slot priority is expressed where it is real:
    the `/s/[slug]` merge already overrides **bundled** defaults with
    **uploaded** slot images; the **Pexels** middle tier lands in M-023 when
    per-slot `source:'pexels'` refs can be stored — no dead helper added
    (KISS). Rendered defaults use only local `/templates/*` URLs, and the
    provider can only emit `images.pexels.com` URLs (asserted).

## 9. Interfaces & contracts touched

```ts
// shared/lib/images/pexels.ts
searchImages(q: string, orientation?: 'landscape'|'portrait'|'square'): Promise<{url:string; alt:string}[]>;
// GET /api/images/search -> { success: true, data: { images: {url,alt}[] } }
```

## 10. Data model impact

- `ImageRef.source: 'bundled' | 'pexels' | 'upload'` distinguishes origin.

## 11. API impact

| Method | Path | Response |
|---|---|---|
| GET | `/api/images/search` | `{ success, data: { images: [] } }`; never errors on provider failure |

## 12. UI/UX impact

- Image picker (editors) may offer Pexels suggestions; template defaults render
  bundled imagery. Failed loads degrade to a styled placeholder.

## 13. Localization impact

- Alt text provided in EN + AR for bundled images; Pexels alt kept as-is if
  localized alt is unavailable.

## 14. Security & tenancy

- Pexels key is server-only (never sent to client). Search endpoint validates
  input and does not proxy arbitrary URLs.

## 15. Testing & verification

- Unit: provider returns `[]` without key and on error/timeout.
- Integration: endpoint envelope; no secret in response.
- Build: `images.pexels.com` allowed; no unlisted host used.
- `typecheck`, `lint`, `build` pass.

| Item | Result |
|---|---|
| `npm run typecheck` | **Pass**, exit 0 |
| `npm run lint` | **0 errors**, 28 warnings (all pre-existing) |
| `npm run build` | **Pass**, exit 0 — **32 routes** (adds `/api/images/search`) |
| Provider checks (tsx, real module + stubbed fetch, 2026-10-12) | **8/8 checks true** (no-key ⇒ `[]`; success maps `{url,alt}`, URLs on `images.pexels.com` only, `query`/`orientation` forwarded; non-OK/network-error/blank-query ⇒ `[]`) |
| Render + endpoint runtime (dev, 2026-10-12) | Temporary `/m17-check` page → **38/38 checks true** |

Verified behaviors (2026-10-12): both templates render their bundled imagery
through `TemplateRenderer` (`<img src="/templates/…">` for real-estate
hero/about/4 services and construction hero/about/4 services — 12 refs, all
files confirmed on disk); the real-estate hero now uses the image overlay
(having an image); anonymous `GET /api/images/search?q=house` returns **401
`{"success":false,"error":"UNAUTHORIZED"}`** — tenant-gated, key never in a
response.

> Note: Next 16 rejects `react-dom/server` inside `app/` routes, so the SSR
> render checks used a temporary server-component page (same RSC path as
> `/s/[slug]`), removed after verification. The provider checks ran against the
> real module via `npx tsx` in a temp script with an injected stub `fetch`
> (success path) and the absence of `PEXELS_API_KEY` (no-key path).

## 16. Acceptance criteria

| AC | Status | Evidence |
|---|---|---|
| AC-01 | **Pass** | Both templates render coherent imagery with no missing slots — 12 bundled refs render via `<img>`, all files on disk (38/38 render checks); hero/about/services slots all covered |
| AC-02 | **Pass** | No key ⇒ `[]` (provider check); templates fully functional offline — bundled defaults, no external dependency (DEC-006) |
| AC-03 | **Pass** | Provider never throws: non-OK / network error / timeout / malformed ⇒ `[]` (checked); endpoint returns 400/401/500 envelope, never crashes |
| AC-04 | **Pass** | Key read server-side via validated `env` proxy only; response carries `{url, alt}` only; 401 envelope check; no secret in client bundle |
| AC-05 | **Pass** | Bundled files marked `source: 'bundled'` + `isSampleContent: true`; `public/templates/README.md` states they are illustrative sample imagery, never labeled as tenant work |
| AC-06 | **Pass** | `typecheck` pass; `lint` 0 errors/28 warnings (pre-existing); `build` pass — 32 routes |

## 17. Handoff & risks

- OD-3: confirm Pexels usage terms/attribution before enabling in production;
  without it, bundled imagery is the default.
- Respect provider rate limits; cache/limit calls.

### Handoff record

| Field | Value |
|---|---|
| Milestone | MILESTONE-017 — Template Imagery & Optional Pexels |
| Owner | Lead Engineering Agent |
| Date | 2026-10-12 |
| Status | **Done** |

**Files changed**

| Path | Change | Why |
|---|---|---|
| `public/templates/real-estate/*.jpg` (7) | New bundled imagery | Real-estate slots: hero, about, 4 services, gallery — Pexels CDN, license-free |
| `public/templates/construction/*.jpg` (6) | New bundled imagery | Construction slots: hero, about, 4 services |
| `public/templates/README.md` | New | Source/license + per-file photo IDs (OD-3 evidence) |
| `shared/lib/images/pexels.ts` | New provider | Optional server-only Pexels search; `[]` on no key/failure; never throws |
| `features/images/handlers.ts` + `app/api/images/search/route.ts` | New endpoint | Thin re-export; zod validation; `requireSession`; envelope; key never in response |
| `next.config.ts` | `remotePatterns` += `images.pexels.com` | Allow the Pexels host for `next/image` |
| `features/templates/content.ts` | Bundled image refs (both templates) | Completes the M-015/M-016 deferral: defaults now render the bundled files |

**Deviations & decisions**

- **Pexels tier of slot resolution deferred to M-023.** The milestone listed
  “uploads > Pexels > bundled”. The `/s/[slug]` merge already implements
  uploads-over-bundled; the Pexels middle tier only becomes meaningful when
  per-slot `source:'pexels'` refs can be persisted (site snapshot wiring,
  M-023). No dead resolver helper was added (KISS).
- **Authenticated success-path untested end-to-end** — it needs a tenant
  session (local MongoDB) and a real `PEXELS_API_KEY` (OD-3). The provider
  logic is covered by 8/8 unit checks against the real module (stubbed fetch),
  and the endpoint envelope/auth path by the runtime 401 check. Full
  authenticated coverage lands with the M-025 Vitest suite.
- Real-estate `hero-mobile` reuses `hero.jpg` rather than a dedicated file
  (same subject, one fewer asset).
- Alt text is authored EN + AR for every bundled image (FR-08).

**Consumed by (next):** M-018 (localization/i18n), M-023 (site snapshot slot
wiring — Pexels tier), M-025 (Vitest for provider/endpoint).
