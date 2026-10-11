# MILESTONE-017 — Template Imagery & Optional Pexels

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-017 |
| Epic | EPIC-006 — Template System & Quality |
| Title | Template Imagery & Optional Pexels |
| Status | Not Started |
| Owner | — |
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

- **T01 — Bundled imagery**
  - Work: curate and add images; consistent aspect ratios/treatment.
  - Done when: templates render with no missing images.
- **T02 — Pexels provider**
  - Work: server-only search; timeouts; return `[]` on failure/no key.
  - Done when: no key ⇒ `[]`; failure ⇒ `[]`; success ⇒ mapped `{url,alt}`.
- **T03 — Search endpoint**
  - Work: validate `q`/`orientation`; envelope; no key leakage.
  - Done when: returns `{ success, data: { images } }` or empty list.
- **T04 — next.config + resolution**
  - Work: allow Pexels host; implement uploads>pexels>bundled resolution.
  - Done when: rendered images use allowed hosts only.

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

## 16. Acceptance criteria

- **AC-01** — Both templates render coherent imagery with no missing slots.
- **AC-02** — Pexels integration is optional; no key ⇒ app fully functional.
- **AC-03** — Provider failures never break creation or rendering.
- **AC-04** — API key never reaches the client.
- **AC-05** — Illustrative imagery is distinguishable and not labeled as customer
  work.
- **AC-06** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- OD-3: confirm Pexels usage terms/attribution before enabling in production;
  without it, bundled imagery is the default.
- Respect provider rate limits; cache/limit calls.
