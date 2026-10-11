# Gzora — Documentation Index

This directory is the canonical, evidence-based documentation set for the Gzora
multi-tenant company-profile website builder. It was created during the project
recovery effort. **Repository files are the single source of truth** — not
conversation history.

Read this index first, then follow the context-loading policy in
`planning/HANDOFF_PROTOCOL.md`.

## Canonical documents

| Area | Document | Purpose |
|---|---|---|
| Product | [`PRODUCT_REQUIREMENTS.md`](./PRODUCT_REQUIREMENTS.md) | PRD: product invariants, FR-01…FR-15, PA-01…PA-10 |
| Diagnosis | [`reports/DIAGNOSIS.md`](./reports/DIAGNOSIS.md) | Verified current state, defects, evidence |
| Diagnosis | [`reports/TRACEABILITY.md`](./reports/TRACEABILITY.md) | PRD → Epic → Milestone → Task → Test map |
| Project | [`project/ARCHITECTURE.md`](./project/ARCHITECTURE.md) | Layer boundaries and runtime architecture |
| Project | [`project/MODULE_MAP.md`](./project/MODULE_MAP.md) | Feature ownership and responsibilities |
| Project | [`project/DATA_MODEL.md`](./project/DATA_MODEL.md) | Entities, relationships, indexes |
| Project | [`project/API_CONTRACTS.md`](./project/API_CONTRACTS.md) | Verified vs target API contract |
| Project | [`project/LOCALIZATION.md`](./project/LOCALIZATION.md) | Arabic/English + RTL/LTR rules |
| Project | [`project/TEMPLATE_SYSTEM.md`](./project/TEMPLATE_SYSTEM.md) | Template/content/renderer contract |
| Project | [`project/TEST_STRATEGY.md`](./project/TEST_STRATEGY.md) | Test pyramid, tooling, required tests |
| Project | [`project/TECHNICAL_DECISIONS.md`](./project/TECHNICAL_DECISIONS.md) | Authoritative cross-cutting decisions (DEC-*) |
| Planning | [`planning/ROADMAP.md`](./planning/ROADMAP.md) | Canonical epic/milestone roadmap |
| Planning | [`planning/DEPENDENCY_MAP.md`](./planning/DEPENDENCY_MAP.md) | Milestone dependency graph + critical path |
| Planning | [`planning/EXECUTION_STATUS.md`](./planning/EXECUTION_STATUS.md) | Live status + first actionable milestone |
| Planning | [`planning/HANDOFF_PROTOCOL.md`](./planning/HANDOFF_PROTOCOL.md) | Context loading + handoff rules |
| Epics | [`epics/`](./epics/) | `EPIC-001` … `EPIC-009` |
| Milestones | [`milestones/`](./milestones/) | One folder per epic, `MILESTONE-NNN.md` files |
| Templates | [`templates/`](./templates/) | Epic / Milestone / Handoff authoring templates |

## Milestone-produced reports

Certain reports are deliverables of specific milestones and appear here once
created (they do not exist yet — that is expected):

- `reports/BASELINE.md` — recorded baseline commands (MILESTONE-001).
- `reports/MIGRATION.md` — migration steps + validated dry-run (MILESTONE-006).
- `reports/PRODUCTION_READINESS.md` — final gates, prerequisites, limitations
  (MILESTONE-028).

## Non-normative / historical references

These files exist but are **not** part of the canonical documentation set:

- `DASHBOARD_UI.md` (repository root) — a UI extraction guide copied from a
  different project (`decoration-demo`). Useful as a visual reference, but it
  describes another codebase and must not be treated as a contract.
- `ROADMAP.md` (repository root) — the pre-recovery roadmap. Superseded by
  `planning/ROADMAP.md`; retained as historical record.
- `node_modules/next/dist/docs/` — upstream Next.js 16 reference. Consulted for
  Next.js 16 breaking changes (see `AGENTS.md`).

## Identifier conventions

- Epics: `EPIC-NNN` (e.g. `EPIC-002`). Stable — never renumbered.
- Milestones: `MILESTONE-NNN` (globally unique). A milestone belongs to exactly
  one epic.
- Tasks: `<MILESTONE-NNN>-TNN` (e.g. `MILESTONE-004-T03`).
- Requirements: `FR-NN`, `PA-NN` (from the PRD).
- Decisions: `DEC-*` (`project/TECHNICAL_DECISIONS.md`). Open decisions: `OD-*`.
- Acceptance criteria: `AC-*` inside epics/milestones.

## How to start work

1. Read `AGENTS.md` and `CODE_RULES.md`.
2. Read `docs/README.md` (this file), `planning/EXECUTION_STATUS.md`.
3. Read your assigned milestone and its parent epic.
4. Read only the additional files those documents reference.

See `planning/EXECUTION_STATUS.md` for the current first actionable milestone.
