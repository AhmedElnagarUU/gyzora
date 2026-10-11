# Execution Status

Live status of every milestone. **This is the file agents update as work
progresses.** It is the authority for "what can be started now". Update it in the
same change as the work it describes, with real evidence — never intent
(`AGENTS.md` §11).

## Legend

- **Status:** `Not Started` · `In Progress` · `Blocked` · `Done`
- **Evidence:** a command result, test name, PR/commit ref (or file path + line),
  or a manual verification record. "Intent" is not evidence.
- A milestone is `Done` only when all acceptance criteria are verified and all
  `CODE_RULES.md` checks pass.

## Current state

- **Phase:** Phase A (stabilize) — **complete** (M-001, M-002 both Done → EPIC-001 done).
- **First actionable milestone:** **`MILESTONE-013`** (EPIC-006; depends on M-001 + M-002).
- **Baseline commands (pre-recovery, verified):** `typecheck` pass, `lint` pass
  (0 errors/44 warnings), `build` pass. No test framework.
- **Post-M-001/M-002 (verified 2026-10-11):** `typecheck` pass; `lint` 0 errors/30
  warnings; `build` pass — 31 routes, verified without `.env` present (AC-04).
  See `docs/reports/BASELINE.md`, `MILESTONE-001`, `MILESTONE-002`.
- **Blocked:** authenticated-endpoint runtime verification requires a usable
  MongoDB session (`U-01`); resolves with `MILESTONE-025`. Unauth endpoint
  behavior was exercised (401 envelopes; see BASELINE.md).

## Milestone status

| ID | Title | Epic | Depends on | Status | Owner | Evidence |
|---|---|---|---|---|---|---|
| M-001 | Baseline Verification & API Boundary/Contract Cleanup | 001 | — | **Done** | Lead Eng. Agent | typecheck pass; lint 0/30; build pass (31 routes); 12 thin routes; 401 envelopes runtime-verified; independent review: 0 blockers (`docs/milestones/EPIC-001/MILESTONE-001.md` §16–17) |
| M-002 | Environment & Configuration Hardening | 001 | — | **Done** | Lead Eng. Agent | `shared/lib/env.ts` (Zod, lazy) wired into DB/auth/S3; `.env.example` synced; typecheck pass; lint 0/30; build pass WITHOUT `.env`; 5/5 env smoke cases pass (`docs/milestones/EPIC-001/MILESTONE-002.md`) |
| M-003 | Site Ownership & One-Site-Per-User | 002 | M-001, M-013 | Not Started | — | — |
| M-004 | Bilingual Site Content & Published Snapshot Schema | 002 | M-001, M-013 | Not Started | — | — |
| M-005 | Project↔Site Linkage & Bilingual Project Schema | 002 | M-001, M-013 | Not Started | — | — |
| M-006 | Data Migration & Index Enforcement | 002 | M-003, M-004, M-005 | Not Started | — | — |
| M-007 | Site Lifecycle Dashboard | 003 | M-003 | Not Started | — | — |
| M-008 | Site Creation Flow | 003 | M-003, M-004, M-006, M-013 | Not Started | — | — |
| M-009 | Company / About / Services / Capabilities Editor | 004 | M-004, M-008 | Not Started | — | — |
| M-010 | Contact & Site Settings Editor | 004 | M-004, M-008 | Not Started | — | — |
| M-011 | Project CRUD (bilingual) | 005 | M-005, M-008 | Not Started | — | — |
| M-012 | Project Media / Cover / Ordering | 005 | M-011 | Not Started | — | — |
| M-013 | Template Content Schema, Section Contract & Default Content | 006 | M-001, M-002 | Not Started | — | — |
| M-014 | Shared Renderer & Section Library | 006 | M-013 | Not Started | — | — |
| M-015 | Real Estate Template | 006 | M-013, M-014 | Not Started | — | — |
| M-016 | Construction Template | 006 | M-013, M-014 | Not Started | — | — |
| M-017 | Template Imagery & Optional Pexels | 006 | M-013, M-014, M-015, M-016 | Not Started | — | — |
| M-018 | next-intl Wiring, Locale Direction & Fallback | 007 | M-014, M-015, M-016 | Not Started | — | — |
| M-019 | Dashboard Localization & RTL | 007 | M-018 | Not Started | — | — |
| M-020 | Public Site Localization & Language Switching | 007 | M-018, M-023 | Not Started | — | — |
| M-021 | Draft/Publish Workflow & Snapshot Service | 008 | M-004, M-008, M-023 | Not Started | — | — |
| M-022 | Owner-Only Preview | 008 | M-021 | Not Started | — | — |
| M-023 | Public Website Rendering from Snapshot | 008 | M-004, M-014, M-015, M-016, M-018 | Not Started | — | — |
| M-024 | Public SEO Metadata & Tracking Scripts | 008 | M-020, M-023 | Not Started | — | — |
| M-025 | Test Tooling Baseline & Domain/Isolation Tests | 009 | M-002, M-006 | Not Started | — | — |
| M-026 | API Contract & Publishing Tests | 009 | M-025, M-021 | Not Started | — | — |
| M-027 | Playwright E2E (EN/AR) | 009 | M-008, M-009, M-011, M-020, M-021, M-023 | Not Started | — | — |
| M-028 | Production Build / Deployment Readiness / Final Traceability | 009 | M-024, M-025, M-026, M-027 | Not Started | — | — |

## Ready queue (all prerequisites Done)

1. `MILESTONE-013` — Template Content Schema, Section Contract & Default Content
   (EPIC-006; depends on M-001, M-002 — both Done)

With EPIC-001 complete, `M-013` is the next actionable milestone; it unblocks
M-003, M-004, M-005 (EPIC-002) and M-014+ (EPIC-006).

## Review findings (from M-001 independent review — not yet scheduled)

Pre-existing issues found by the M-001 review in files **outside** M-001's
declared change set. They are tracked here rather than silently fixed.

| ID | Finding | File | Suggested owner |
|---|---|---|---|
| RF-1 | `GET /api/tenants?id=` trusts a client id (cross-tenant read / IDOR); no consumer uses `?id=` | `features/tenants/handlers.ts` | new authz milestone (EPIC-002/003) |
| RF-2 | `GET /api/users?userId=` ignores tenant (S-02) | `features/users/handlers.ts` + `service.ts` | M-026/M-028 |
| RF-3 | Cross-feature `model.ts` imports (`tenants`↔`sites`) violate CODE_RULES §1 | `features/tenants/service.ts`, `features/sites/public-service.ts` | EPIC-002 |
| RF-4 | Handlers echo raw `error.message`; a DB failure leaked the Mongo hostname (generic-error helper needed) | `features/{projects,admin,tracking,sites}/handlers.ts` | M-026 |
| RF-5 | Dead `?slug` tenants api-client (handler only reads `?id=`) | `features/tenants/api-client.ts` | cleanup |
| RF-6 | Lint nits: no-op schema/transform, unused `_id`, dead barrel, `force-dynamic` in client files | several | later hardening |

## Blocked / at-risk

| Item | Blocked by | Notes |
|---|---|---|
| Authenticated runtime verification (U-01) | No usable DB session / no test credentials | Unauthenticated 401 envelopes verified; full paths unblock with M-025 (mongodb-memory-server) |
| M-006 migration | Unknown production data (U-05) | Needs a DB dump before execution |
| M-017 Pexels | Unknown key/terms (OD-3) | Bundled fallbacks keep it non-blocking |
| M-018 locale routing | OD-2 decision | Default DEC-005 (cookie + `?lang`) |
| M-028 deploy | OD-4 target unknown | Confirm before finalizing |

## Change log

| Date | Change | By |
|---|---|---|
| 2026-10-11 | Initial status snapshot; all milestones `Not Started`; first actionable `MILESTONE-001` | Recovery planning |
| 2026-10-11 | **M-001 Done** — thin routes + envelope across projects/tracking/admin/auth-session/health; consumers updated; D-14 refs fixed; `PUT /api/sites` 400 mapping; typecheck/lint(0/30)/build pass; 401 envelopes runtime-verified. Added Review findings RF-1…RF-6. Ready queue → M-002 | Lead Eng. Agent |
| 2026-10-11 | **M-002 Done** — `shared/lib/env.ts` (Zod, lazy, typed) reads through DB/auth/S3 bootstrap; `.env.example` synced; build verified without `.env`; 5/5 env smoke cases pass. **EPIC-001 complete** (M-001+M-002). Ready queue → M-013 | Lead Eng. Agent |

## How to update

1. Set `Status` and `Owner`; fill `Evidence` with the actual command/test/record.
2. When a milestone becomes `Done`, add the exact checks run (typecheck/lint/
   build/test) to `Evidence`.
3. Recompute the **Ready queue** from `DEPENDENCY_MAP.md`.
4. Append a row to the change log.
5. Never mark `Done` without evidence (`AGENTS.md` §11).
