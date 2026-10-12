# Roadmap — Gzora Recovery

Canonical epic and milestone plan for the recovery. Supersedes the root
`ROADMAP.md` (pre-recovery, historical). IDs are **stable** — never renumber.
Each milestone is a self-contained file under `milestones/EPIC-00X/`.

Status vocabulary: `Not Started` · `In Progress` · `Blocked` · `Done`.
Authoritative live status: `EXECUTION_STATUS.md`.

## How to read this

- **Epic** = a coherent outcome (stable `EPIC-NNN`).
- **Milestone** = an independently handoff-able unit of work with 17 sections
  (`templates/MILESTONE_TEMPLATE.md`). One owner at a time.
- Dependencies are declared per milestone; `DEPENDENCY_MAP.md` is the graph.
- "First actionable" is whichever milestone in `EXECUTION_STATUS.md` has all
  dependencies `Done`.

## Epics & milestones

### EPIC-001 — Stabilization & Contracts
Make the existing app safe to build on: enforce the API envelope, thin routes,
and validated configuration **before** adding new behavior.

| ID | Milestone | Depends on |
|---|---|---|
| MILESTONE-001 | Baseline Verification & API Boundary/Contract Cleanup | — |
| MILESTONE-002 | Environment & Configuration Hardening | — |

### EPIC-002 — Domain, Ownership & Persistence
Establish the ownership model, bilingual content, immutable published snapshot,
and portfolio↔site linkage in the data layer.

| ID | Milestone | Depends on |
|---|---|---|
| MILESTONE-003 | Site Ownership & One-Site-Per-User | M-001, M-013 |
| MILESTONE-004 | Bilingual Site Content & Published Snapshot Schema | M-001, M-013 |
| MILESTONE-005 | Project↔Site Linkage & Bilingual Project Schema | M-001, M-013 |
| MILESTONE-006 | Data Migration & Index Enforcement | M-003, M-004, M-005 |

### EPIC-003 — Site Creation & Dashboard
Deliver the one-site-per-user creation journey and lifecycle dashboard.

| ID | Milestone | Depends on |
|---|---|---|
| MILESTONE-007 | Site Lifecycle Dashboard | M-003 |
| MILESTONE-008 | Site Creation Flow | M-003, M-004, M-006, M-013 |

### EPIC-004 — Content Editing
Let customers edit company/about/services/contact content after creation and
after publication, without touching the template.

| ID | Milestone | Depends on |
|---|---|---|
| MILESTONE-009 | Company / About / Services / Capabilities Editor | M-004, M-008 |
| MILESTONE-010 | Contact & Site Settings Editor | M-004, M-008 |

### EPIC-005 — Portfolio (Projects)
Bilingual project CRUD, media, cover, and ordering that feed the published site.

| ID | Milestone | Depends on |
|---|---|---|
| MILESTONE-011 | Project CRUD (bilingual) | M-005, M-008 |
| MILESTONE-012 | Project Media / Cover / Ordering | M-011 |

### EPIC-006 — Template System & Quality
Turn the two shallow templates into rich, reusable company-profile experiences
sharing one section contract and renderer.

| ID | Milestone | Depends on |
|---|---|---|
| MILESTONE-013 | Template Content Schema, Section Contract & Default Content | M-001, M-002 |
| MILESTONE-014 | Shared Renderer & Section Library | M-013 |
| MILESTONE-015 | Real Estate Template | M-013, M-014 |
| MILESTONE-016 | Construction Template | M-013, M-014 |
| MILESTONE-017 | Template Imagery & Optional Pexels | M-013, M-014, M-015, M-016 |

### EPIC-007 — Localization (Arabic / English)
Wire next-intl, RTL/LTR, localized customer content, and language switching.

| ID | Milestone | Depends on |
|---|---|---|
| MILESTONE-018 | next-intl Wiring, Locale Direction & Fallback | M-014, M-015, M-016 |
| MILESTONE-019 | Dashboard Localization & RTL | M-018 |
| MILESTONE-020 | Public Site Localization & Language Switching | M-018, M-023 |

### EPIC-008 — Publishing & Public Website
Draft/publish snapshot workflow, owner-only preview, public rendering, SEO and
tracking.

| ID | Milestone | Depends on |
|---|---|---|
| MILESTONE-021 | Draft/Publish Workflow & Snapshot Service | M-004, M-008, M-023 |
| MILESTONE-022 | Owner-Only Preview | M-021 |
| MILESTONE-023 | Public Website Rendering from Snapshot | M-004, M-014, M-015, M-016, M-018 |
| MILESTONE-024 | Public SEO Metadata & Tracking Scripts | M-020, M-023 |

### EPIC-009 — Testing & Production Readiness
Automated verification and a genuinely deployable build.

| ID | Milestone | Depends on |
|---|---|---|
| MILESTONE-025 | Test Tooling Baseline & Domain/Isolation Tests | M-002, M-006 |
| MILESTONE-026 | API Contract & Publishing Tests | M-025, M-021 |
| MILESTONE-027 | Playwright E2E (EN/AR) | M-008, M-009, M-011, M-020, M-021, M-023 |
| MILESTONE-028 | Production Build / Deployment Readiness / Final Traceability | M-024, M-025, M-026, M-027 |

## Recommended execution order

```
Phase A (stabilize)      M-001, M-002
Phase B (contracts)      M-013
Phase C (domain)         M-003, M-004, M-005 → M-006
Phase D (create + edit)  M-008 → M-009, M-010 ; M-011 → M-012 ; M-007
Phase E (templates)      M-014 → M-015, M-016 → M-017
Phase F (localize)       M-018 → M-019
Phase G (publish + web)  M-023 → M-020 ; M-021 → M-022 ; M-024
Phase H (verify + ship)  M-025, M-026, M-027 → M-028
```

`MILESTONE-001`, `MILESTONE-002`, `MILESTONE-013`, `MILESTONE-014`,
`MILESTONE-015`, `MILESTONE-016`, and `MILESTONE-017` are **Done**
(M-013/014 2026-10-11/12 — shared template content contract, single renderer
and full section library; M-015/M-016 2026-10-12 — the two template
identities, real estate premium light teal/gold/serif and construction
industrial dark orange/yellow, both verified across all six pages; M-017
2026-10-12 — 13 bundled license-free photos, optional server-only Pexels
provider and `/api/images/search` endpoint, bundled refs wired into both
templates' defaults).
`MILESTONE-018` is the next actionable milestone (critical path — shared
i18n/next-intl wiring); M-003, M-004, M-005, M-008 are also unblocked. Live
status: `EXECUTION_STATUS.md`.

## MVP acceptance mapping

| PRD | Covered by |
|---|---|
| PA-01 Account & ownership | M-001, M-003, M-025 |
| PA-02 One site per user | M-003, M-006, M-025 |
| PA-03 Site creation | M-008, M-027 |
| PA-04 Content editing | M-009, M-010, M-027 |
| PA-05 Portfolio | M-011, M-012, M-027 |
| PA-06 Template quality | M-013–M-017, M-027 |
| PA-07 Bilingual | M-018–M-020, M-027 |
| PA-08 Publication | M-021, M-022, M-023, M-027 |
| PA-09 API/data integrity | M-026 |
| PA-10 Production readiness | M-028 |

Full traceability: `reports/TRACEABILITY.md`.

## Out of scope (MVP)

Per PRD §8 and DEC-009: multiple sites per user, ecommerce, a drag-and-drop page
builder, custom domains/new routing scheme, complex roles, advanced analytics or
marketing automation, a new billing system. Pre-existing extras (owner dashboard,
tracking, S3, `plan` field) are **retained and hardened only**.

## Risks (carried from DIAGNOSIS)

| Risk | Impact | Handling |
|---|---|---|
| No runtime DB verification yet (U-01) | Rework | M-025 sets up in-memory DB; early milestones add tests |
| Locale-routing SEO decision (OD-2) | Rework of i18n | Resolve before M-018; default DEC-005 |
| Pexels key/terms (OD-3) | Imagery | Bundled fallbacks; provider optional (M-017) |
| Deployment target (OD-4) | Publish/revalidation | Confirm before M-028 |
| Existing data migration (OD-6/U-05) | Data loss | M-006 validates against a dump |
| `aws-sdk` v2 end-of-support | Security | Migrate when scoped; no new v2 usage |
| Scope creep (extras) | Effort | DEC-009 guard |
