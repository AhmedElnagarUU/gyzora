# Traceability Map

Requirement → Epic → Milestone → Verification. Proves every PRD requirement is
owned and testable, and flags anything uncovered. Keep in sync with
`EXECUTION_STATUS.md`; a requirement is only "met" when its milestone is `Done`
with evidence.

Legend for Type: `AC` (acceptance criteria), `INT` (integration test), `E2E`
(Playwright), `UNIT` (unit test), `MAN` (manual verification record).

## Functional requirements

| PRD | Requirement | Epic | Milestones | Verification | Status |
|---|---|---|---|---|---|
| FR-01 | Authentication | 001, 002 | M-001 (session envelope) | INT (M-026), E2E (M-027) | Not Started |
| FR-02 | Dashboard & site lifecycle, one site | 002, 003 | M-003, M-007 | INT + AC, E2E (M-027) | Not Started |
| FR-03 | Site creation | 003 | M-008 | INT + E2E (M-027) | Not Started |
| FR-04 | Improve the two templates | 006 | M-013, M-014, M-015, M-016 | UNIT + render tests (M-025), E2E (M-027) | Not Started |
| FR-05 | Required pages/sections | 006 | M-013…M-017, M-023 | render tests, E2E (M-027) | Not Started |
| FR-06 | Content editing after create/publish | 002, 004 | M-004, M-009, M-010 | INT + E2E (M-027) | Not Started |
| FR-07 | Portfolio project CRUD | 002, 005 | M-005, M-011, M-012 | INT + E2E (M-027) | Not Started |
| FR-08 | Image management + Pexels | 005, 006 | M-012, M-017 | UNIT (provider fallback), render tests | Not Started |
| FR-09 | Publication vs draft | 002, 008 | M-004, M-021, M-022 | INT (M-026), E2E (M-027) | Not Started |
| FR-10 | Arabic/English | 007 | M-018, M-019, M-020 | UNIT (fallback/parity), E2E (M-027) | Not Started |
| FR-11 | Public website access | 008 | M-020, M-023, M-024 | INT + E2E (M-027) | Not Started |
| FR-12 | Persistence & one-site invariant | 002 | M-003, M-004, M-005, M-006 | INT incl. concurrency (M-025) | Not Started |
| FR-13 | Multi-tenant security | 001, 002 | M-001, M-003, M-005 | INT isolation suite (M-025/M-026) | Not Started |
| FR-14 | UX & visual quality | 003, 004, 005, 006, 007 | M-007, M-009, M-010, M-012, M-014…M-017, M-019 | render/component + E2E | Not Started |
| FR-15 | Reliability & production readiness | 009 | M-025, M-026, M-027, M-028 | all gates (M-028) | Not Started |

## Product acceptance criteria

| PRD | Criterion | Epic | Milestones | Verification | Status |
|---|---|---|---|---|---|
| PA-01 | Account & ownership | 001, 002 | M-001, M-003 | INT (M-026), E2E (M-027) | Not Started |
| PA-02 | One site per user | 002 | M-003, M-006 | INT concurrency (M-025) | Not Started |
| PA-03 | Site creation | 003 | M-008 | INT + E2E (M-027) | Not Started |
| PA-04 | Content editing | 004 | M-009, M-010 | INT + E2E (M-027) | Not Started |
| PA-05 | Portfolio management | 005 | M-011, M-012 | INT + E2E (M-027) | Not Started |
| PA-06 | Template quality | 006 | M-013…M-017, M-023 | render tests + E2E | Not Started |
| PA-07 | Bilingual experience | 007 | M-018, M-019, M-020 | UNIT + E2E (M-027) | Not Started |
| PA-08 | Publication | 008 | M-021, M-022, M-023 | INT (M-026) + E2E (M-027) | Not Started |
| PA-09 | API & data integrity | 009 | M-025, M-026 | contract + domain tests | Not Started |
| PA-10 | Production readiness | 009 | M-028 | full gate run | Not Started |

## MVP scope items (PRD §8)

| Scope item | Milestones |
|---|---|
| Existing authentication flow | M-001 (preserved) |
| One Site per user | M-003, M-006 |
| Site creation using existing templates | M-008 |
| Company info & content management | M-009, M-010 |
| Portfolio create/edit/delete | M-011, M-012 |
| Rich reusable templates | M-013…M-017 |
| Arabic and English | M-018…M-020 |
| Template imagery (Pexels) | M-017 |
| Preview & publish | M-021, M-022 |
| Editing + subsequent updates | M-009, M-010, M-021 |
| MongoDB persistence | M-004, M-005, M-006 |
| Multi-tenant ownership enforcement | M-003, M-005 |
| Critical tests + E2E | M-025, M-026, M-027 |
| Production build/deploy readiness | M-028 |

## Diagnosis defects → resolution

| ID | Finding | Milestone(s) |
|---|---|---|
| D-01 | Site auto-created on signup | M-003 |
| D-02 | No one-site enforcement | M-003, M-006 |
| D-03 | No content/draft-published separation | M-004, M-021 |
| D-04 | Shallow templates / no-op save | M-013…M-017 |
| D-05 | No localization wiring | M-018, M-019, M-020 |
| D-06 | No Pexels integration | M-017 |
| D-07 | Route/handler violations | M-001 |
| D-08 | Inconsistent envelope | M-001 |
| D-09 | Dead ends / stubs | M-007, M-008, M-010, M-011 |
| D-10 | Tracking never rendered | M-024 |
| D-11 | Placeholder public render / dead theme | M-014, M-023 |
| D-12 | Projects not linked to Site | M-005 |
| D-13 | Projects not bilingual | M-005, M-011 |
| D-14 | Dangling doc refs | M-001 |
| S-01 | Theme class unused | M-014 |
| S-02 | Users API cross-tenant read | M-026, M-028 |
| S-03 | Non-transactional signup create | M-003, M-006 |
| S-04 | No revalidation on publish | M-021 |
| S-05 | Project status semantics | M-005, M-011, M-021 |
| U-01 | No runtime test evidence | M-025 |
| U-02 | Pexels key/terms unknown | M-017 (OD-3) |
| U-03 | Deployment target unknown | M-028 (OD-4) |
| U-04 | Locale routing undecided | M-018 (OD-2) |
| U-05 | Production data unknown | M-006 |

## Open decisions → resolving milestone

| OD | Question | Blocking milestone | Status |
|---|---|---|---|
| OD-1 | Keep Tenant vs migrate | M-003 (recommend keep) | Open |
| OD-2 | Locale in URL vs cookie/`?lang` | M-018 | Open |
| OD-3 | Pexels key/terms | M-017 | Open |
| OD-4 | Deploy target / CDN | M-028 | Open |
| OD-5 | Project status vs site publish | M-005/M-021 | Open |
| OD-6 | Migrate/delete empty auto-sites | M-006 | Open |
| OD-7 | Owner dashboard scope | (DEC-009 guard) | Open |

## Coverage gaps / notes

- All PRD requirements and acceptance criteria are assigned to at least one
  milestone. No requirement is uncovered as of this plan.
- "Status" here mirrors `EXECUTION_STATUS.md`; update both together.
- Some FRs are verified by multiple milestones (e.g. FR-10 by M-018/019/020);
  the requirement is met only when all are `Done`.
