# MILESTONE-028 — Production Build / Deployment Readiness / Final Traceability

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-028 |
| Epic | EPIC-009 — Testing & Production Readiness |
| Title | Production Build / Deployment Readiness / Final Traceability |
| Status | Not Started |
| Owner | — |
| Depends on | M-024, M-025, M-026, M-027 |
| Blocks | — |
| PRD refs | FR-15, PA-10 |
| Decisions | DEC-003, DEC-007, DEC-008 |
| Estimated size | M |

## 2. Objective

Confirm the MVP is genuinely production-ready: a verified production build, all
quality gates green, deployment prerequisites documented, remaining limitations
reported honestly, and the traceability map complete.

## 3. Background & rationale

FR-15/PA-10 explicitly state a green build alone is not production readiness. All
prior milestones must be verified together, the deploy path documented, and any
unresolved risk surfaced rather than hidden.

## 4. Scope (in scope)

- Run and record the full gate set: `typecheck`, `lint`, `build`, `test`,
  `test:e2e`.
- Verify the production build with `NEXT_PUBLIC_*`/server env handling and secret
  isolation.
- Document deployment prerequisites (env vars, Mongo, S3, optional Pexels, host/
  CDN per OD-4) and operational limitations.
- Resolve/statically report lint warnings; confirm no `any` leaks, no route logic.
- Complete `reports/TRACEABILITY.md` and update `EXECUTION_STATUS.md`.

## 5. Out of scope

- New features; OWASP scan; Sentry/monitoring; CI pipeline implementation beyond
  documenting required gates (PRD §8 / DEC-009).

## 6. Dependencies & preconditions

- All feature + test milestones Done. OD-4 resolved (deploy target) or explicitly
  reported as an assumption.

## 7. Deliverables

- Add: `docs/reports/PRODUCTION_READINESS.md` — gate results, prerequisites,
  limitations, risks.
- Change: `docs/reports/TRACEABILITY.md` — final, complete.
- Change: `docs/planning/EXECUTION_STATUS.md` — final statuses + evidence.
- Change: `README.md`/.env.example docs if deployment steps changed.

## 8. Tasks

- **T01 — Full gate run**
  - Work: run all five commands; capture summaries.
  - Done when: recorded with pass/fail and route/coverage counts.
- **T02 — Env/secret verification**
  - Work: confirm no secret reaches the client; server env validated (M-002);
    build works without secrets.
  - Done when: verified and documented.
- **T03 — Deploy prerequisites**
  - Work: document required services/vars/host; note OD-4 outcome.
  - Done when: a fresh environment can be configured from the doc.
- **T04 — Limitations & risks**
  - Work: list unresolved items (e.g. `aws-sdk` v2, OD-3/OD-5, unverified paths).
  - Done when: honest and specific.
- **T05 — Traceability**
  - Work: map FR/PA → epic → milestone → test → status.
  - Done when: every requirement has a status and evidence.

## 9. Interfaces & contracts touched

- None; verification + documentation.

## 10. Data model impact

- None.

## 11. API impact

- None; endpoint coverage asserted by M-026.

## 12. UI/UX impact

- None; journeys asserted by M-027.

## 13. Localization impact

- En/AR verified by M-027; catalog parity by M-025.

## 14. Security & tenancy

- Re-verify S-02 (users API) and all isolation tests are green before declaring
  readiness. No known critical cross-tenant defect may remain.

## 15. Testing & verification

```
npm run typecheck   # pass
npm run lint        # pass (list remaining warnings with rationale)
npm run build       # pass (record route count / timing)
npm test            # pass
npm run test:e2e    # pass
```

## 16. Acceptance criteria

- **AC-01** — All five gates pass with recorded evidence.
- **AC-02** — No secret is exposed to the client; env is validated.
- **AC-03** — Deployment prerequisites documented (OD-4 outcome stated).
- **AC-04** — Remaining limitations/risks documented honestly.
- **AC-05** — No known critical cross-tenant defect remains.
- **AC-06** — `TRACEABILITY.md` is complete and consistent.

## 17. Handoff & risks

- If any gate fails, the milestone is **not** Done; report the failure and the
  blocking cause.
- Do not waive mandatory requirements silently (PRD §10); report unverified items
  as blocked.
- Final risks likely include `aws-sdk` v2 EOL, no CDN decision, and any
  unverifiable environment-dependent behavior.
