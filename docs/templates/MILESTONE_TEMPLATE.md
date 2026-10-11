# MILESTONE-NNN — <Title>

<!--
Copy this file to docs/milestones/EPIC-00X/MILESTONE-NNN.md and fill every
section. A milestone is self-contained: an agent should be able to execute it
from this file plus its epic and the documents it references. All 17 sections
are required. Delete this comment block after filling.
-->

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-NNN |
| Epic | EPIC-00X — <Epic name> |
| Title | <Title> |
| Status | Not Started |
| Owner | — |
| Depends on | <MILESTONE-… or "—"> |
| Blocks | <MILESTONE-…> |
| PRD refs | FR-NN, PA-NN |
| Decisions | DEC-… |
| Estimated size | S / M / L |

## 2. Objective

One paragraph: the single outcome this milestone delivers, phrased as a
verifiable capability.

## 3. Background & rationale

Why this milestone exists now, referencing diagnosis IDs (`D-*`, `S-*`, `U-*`)
and decisions. State the root cause being addressed.

## 4. Scope (in scope)

- Bullet list of exactly what will be implemented.

## 5. Out of scope

- Bullet list of adjacent work explicitly deferred to other milestones.

## 6. Dependencies & preconditions

- Prerequisite milestones (must be `Done`).
- Open decisions (`OD-*`) that must be resolved first.
- Environment/credentials required.

## 7. Deliverables

- Files to add (`path`) and files to change (`path`), with one-line purpose.

## 8. Tasks

> Each task has a `Done when` gate. Keep tasks atomic and ordered.

- **T01 — <task>**
  - Work: …
  - Done when: …
- **T02 — <task>**
  - Work: …
  - Done when: …

## 9. Interfaces & contracts touched

- Types/functions/services/pages added or changed, with exact signatures.
- Any cross-feature contract (must go through a `service.ts`).

## 10. Data model impact

- Collections/fields/indexes added or changed.
- Migration/backfill implications (if any).

## 11. API impact

- Endpoints added/changed (method, path, request, response, status codes).
- Envelope compliance (`{ success, data | error }`).

## 12. UI/UX impact

- Screens/components added or changed; loading/empty/error/success states.
- Accessibility notes.

## 13. Localization impact

- New localization keys, `LocalizedText` fields, RTL considerations.
- Fallback behavior.

## 14. Security & tenancy

- Ownership checks; how tenant scoping is preserved.
- Validation and error-safety (no secret leakage).

## 15. Testing & verification

- Tests to add (unit/integration/e2e), what each asserts.
- Commands to run: `npm run typecheck`, `npm run lint`, `npm run build`,
  targeted tests.

## 16. Acceptance criteria

- **AC-01** — <verifiable statement>
- **AC-02** — <verifiable statement>
- (Each AC must have evidence in the handoff.)

## 17. Handoff & risks

- Known risks/unknowns.
- Open decisions affecting this milestone.
- Explicit follow-ups for downstream milestones.
- Blocked-if conditions (what to report instead of a workaround).
