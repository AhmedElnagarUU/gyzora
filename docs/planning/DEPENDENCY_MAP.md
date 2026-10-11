# Dependency Map

The milestone dependency graph, critical path, and parallelization guidance.
Source of truth for "what can I start now". Keep in sync with `ROADMAP.md` and
each milestone's own `Depends on` field.

## 1. Graph

```mermaid
graph TD
  M001[M-001 API/contracts]:::stab
  M002[M-002 env/config]:::stab
  M013[M-013 content schema]:::tpl
  M003[M-003 ownership]:::domain
  M004[M-004 content+snapshot schema]:::domain
  M005[M-005 project schema]:::domain
  M006[M-006 migration+indexes]:::domain
  M007[M-007 site dashboard]:::create
  M008[M-008 site creation]:::create
  M009[M-009 company editor]:::edit
  M010[M-010 contact/settings editor]:::edit
  M011[M-011 project CRUD]:::portfolio
  M012[M-012 project media/order]:::portfolio
  M014[M-014 renderer+sections]:::tpl
  M015[M-015 real estate]:::tpl
  M016[M-016 construction]:::tpl
  M017[M-017 imagery/Pexels]:::tpl
  M018[M-018 next-intl wiring]:::i18n
  M019[M-019 dashboard i18n]:::i18n
  M020[M-020 public i18n]:::i18n
  M021[M-021 publish snapshot]:::pub
  M022[M-022 preview]:::pub
  M023[M-023 public render]:::pub
  M024[M-024 SEO/tracking]:::pub
  M025[M-025 test baseline]:::qa
  M026[M-026 API/pub tests]:::qa
  M027[M-027 E2E]:::qa
  M028[M-028 ship]:::qa

  M001 --> M003
  M001 --> M004
  M001 --> M005
  M002 --> M013
  M001 --> M013
  M013 --> M003
  M013 --> M004
  M013 --> M005
  M013 --> M008
  M003 --> M006
  M004 --> M006
  M005 --> M006
  M003 --> M007
  M003 --> M008
  M004 --> M008
  M006 --> M008
  M004 --> M009
  M008 --> M009
  M004 --> M010
  M008 --> M010
  M005 --> M011
  M008 --> M011
  M011 --> M012
  M013 --> M014
  M014 --> M015
  M014 --> M016
  M013 --> M015
  M013 --> M016
  M014 --> M017
  M015 --> M017
  M016 --> M017
  M014 --> M018
  M015 --> M018
  M016 --> M018
  M018 --> M019
  M014 --> M023
  M015 --> M023
  M016 --> M023
  M018 --> M023
  M023 --> M020
  M018 --> M020
  M023 --> M021
  M004 --> M021
  M008 --> M021
  M021 --> M022
  M023 --> M024
  M020 --> M024
  M002 --> M025
  M006 --> M025
  M025 --> M026
  M021 --> M026
  M008 --> M027
  M009 --> M027
  M011 --> M027
  M020 --> M027
  M021 --> M027
  M023 --> M027
  M024 --> M028
  M025 --> M028
  M026 --> M028
  M027 --> M028
```

Legend: `stab`=EPIC-001, `domain`=EPIC-002, `create`=EPIC-003, `edit`=EPIC-004,
`portfolio`=EPIC-005, `tpl`=EPIC-006, `i18n`=EPIC-007, `pub`=EPIC-008, `qa`=EPIC-009.

## 2. Dependency table

| ID | Prerequisites | Unblocks |
|---|---|---|
| M-001 | — | M-003, M-004, M-005, M-013 |
| M-002 | — | M-013, M-025 |
| M-013 | M-001, M-002 | M-003, M-004, M-005, M-008, M-014, M-015, M-016 |
| M-003 | M-001, M-013 | M-006, M-007, M-008 |
| M-004 | M-001, M-013 | M-006, M-008, M-009, M-010, M-021, M-023 |
| M-005 | M-001, M-013 | M-006, M-011 |
| M-006 | M-003, M-004, M-005 | M-008, M-025 |
| M-007 | M-003 | — |
| M-008 | M-003, M-004, M-006, M-013 | M-009, M-010, M-011, M-021, M-027 |
| M-009 | M-004, M-008 | M-027 |
| M-010 | M-004, M-008 | — |
| M-011 | M-005, M-008 | M-012, M-027 |
| M-012 | M-011 | — |
| M-014 | M-013 | M-015, M-016, M-017, M-018, M-023 |
| M-015 | M-013, M-014 | M-017, M-018, M-023 |
| M-016 | M-013, M-014 | M-017, M-018, M-023 |
| M-017 | M-013, M-014, M-015, M-016 | — |
| M-018 | M-014, M-015, M-016 | M-019, M-020, M-023 |
| M-019 | M-018 | — |
| M-020 | M-018, M-023 | M-024, M-027 |
| M-021 | M-004, M-008, M-023 | M-022, M-026, M-027 |
| M-022 | M-021 | — |
| M-023 | M-004, M-014, M-015, M-016, M-018 | M-020, M-021, M-024, M-027 |
| M-024 | M-020, M-023 | M-028 |
| M-025 | M-002, M-006 | M-026, M-028 |
| M-026 | M-025, M-021 | M-028 |
| M-027 | M-008, M-009, M-011, M-020, M-021, M-023 | M-028 |
| M-028 | M-024, M-025, M-026, M-027 | — |

## 3. Critical path

Longest chain gating the finish:

```
M-001 → M-013 → M-004 → M-006 → M-008 → M-009 → M-011 → M-014
      → M-015 → M-018 → M-023 → M-021 → M-027 → M-028
```

Any slip on these milestones slips the finish. Prefer to staff the critical path
first and parallelize the branches below around it.

## 4. Parallelization opportunities

After Phase A (`M-001`, `M-002`) and `M-013`:

- **Track 1 (domain):** M-003, M-004, M-005 can proceed in parallel; converge at
  M-006.
- **Track 2 (templates):** M-014 → {M-015, M-016} in parallel → M-017.
- **Track 3 (edit/portfolio):** after M-008, M-009/M-010 and M-011/M-012 are
  independent of the template track.
- **Track 4 (test infra):** M-025 tooling setup can begin right after M-002;
  domain tests need M-006.

Safe merge points (barriers): M-006, M-008, M-018, M-023, M-028.

## 5. Rules

- Do not start a milestone until **all** prerequisites are `Done` in
  `EXECUTION_STATUS.md`.
- If two milestones must land together, record the coupling here and in both
  files rather than starting early.
- Adding/removing a dependency requires updating this file, `ROADMAP.md`, the
  affected milestone files, and `EXECUTION_STATUS.md` in the same change.
- No cycles. The graph is a DAG; verify after any edit.
