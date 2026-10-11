<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Recovery Project — Agent Operating Rules

These rules apply to any AI agent working in this repository. They were added
during the project recovery effort to keep work evidence-based, documented, and
aligned with the existing architecture.

## Read before working

1. Read `AGENTS.md`, `CODE_RULES.md`, and the relevant project documentation
   before touching any code. Start with `docs/README.md` (documentation index),
   then `docs/planning/EXECUTION_STATUS.md` for the live plan.
2. Understand the existing architecture before proposing or implementing
   changes. Start from `docs/project/ARCHITECTURE.md` and trace the actual code
   paths.
3. Follow the documented stack, conventions, folder structure, and
   architectural boundaries in `CODE_RULES.md` (feature-based folders, thin
   `route.ts` re-exports, handlers → service → repository → model flow,
   tenant scoping, `{ success, data | error }` responses) and the cross-cutting
   decisions in `docs/project/TECHNICAL_DECISIONS.md`.

## Work from the plan

4. Work from documented epics and milestones (`docs/planning/ROADMAP.md`,
   `docs/epics/EPIC-*.md`, `docs/milestones/EPIC-*/MILESTONE-*.md`). Follow the
   dependency map (`docs/planning/DEPENDENCY_MAP.md`) and the handoff protocol
   (`docs/planning/HANDOFF_PROTOCOL.md`). Do not make untracked, ad-hoc changes
   that bypass the plan.
5. Keep implementations as simple as possible — **KISS**. Avoid unnecessary
   dependencies, abstractions, refactoring, and architectural changes.
6. Fix root causes, not symptoms. Do not add workarounds or hardcoded responses
   to mask a bug.

## Verify everything

7. Verify findings against actual source code, logs, runtime behavior, or test
   results. Never rely on assumptions, filenames, or documentation alone.
8. Delegate independent analysis and testing tasks to subagents when useful
   (architecture audit, API/flow tracing, QA testing, implementation review).
   Keep ownership of the architecture and final verification yourself.
9. Write or update tests for important behavior and bug fixes. Run the relevant
   checks after every meaningful change:
   - `npm run typecheck`
   - `npm run lint`
   - `npm run build`
   - `npm test` / `npm run test:e2e` where they exist
10. Test complete user journeys when the required environment (local MongoDB,
    credentials, services) is available. Use `npm run dev` and exercise the
    real routes.
11. Never mark a task complete without verifiable evidence. Milestone statuses
    live in `docs/planning/EXECUTION_STATUS.md` and in the milestone file
    itself; update them with actual results (commands run, tests passing,
    manual verification records), not intent.

## Report honestly

12. Update documentation when requirements, architecture, or behavior change.
13. Report blocked tasks, missing credentials, unavailable external services,
    and untested behavior honestly.
14. Never expose secrets, commit credentials, or replace real integrations with
    fake implementations merely to make tests pass. `.env` is local-only and
    gitignored — never print or commit its values.

## Recovery documentation map

- **Index:** `docs/README.md` — the canonical documentation set and identifier
  conventions. Read it before anything else.
- **Plan & status:** `docs/planning/ROADMAP.md`, `docs/planning/DEPENDENCY_MAP.md`,
  `docs/planning/EXECUTION_STATUS.md`, `docs/planning/HANDOFF_PROTOCOL.md`.
- **Epics / milestones:** `docs/epics/EPIC-00X.md`;
  `docs/milestones/EPIC-00X/MILESTONE-NNN.md` (17 required sections).
- **Contracts:** `docs/project/TECHNICAL_DECISIONS.md` (DEC-*/OD-*),
  `docs/project/{ARCHITECTURE,DATA_MODEL,API_CONTRACTS,MODULE_MAP,LOCALIZATION,TEMPLATE_SYSTEM,TEST_STRATEGY}.md`.
- **Evidence:** `docs/reports/DIAGNOSIS.md`, `docs/reports/TRACEABILITY.md`,
  plus milestone-specific reports when produced.
