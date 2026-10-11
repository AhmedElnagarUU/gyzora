# Handoff Protocol

How work moves between agents (and humans) without losing context or creating
incompatible architectures. Read this before starting or finishing a milestone.

## 1. Principles

1. **Repository is the source of truth.** Decisions, status, and contracts live
   in files, not in a chat transcript or an agent's memory.
2. **One milestone, one owner at a time.** A milestone has exactly one active
   owner; overlapping edits to the same files are forbidden.
3. **Self-contained milestones.** Each `MILESTONE-NNN.md` contains everything
   needed to execute it (17 sections). An agent should not need to read the whole
   repo; it reads the milestone, its epic, and the documents the milestone
   references.
4. **Evidence over intent.** Handoff is complete only with verifiable evidence
   (`AGENTS.md` §11).
5. **No silent decision changes.** Deviating from a `DEC-*` requires a recorded
   amendment first (`TECHNICAL_DECISIONS.md`). Open `OD-*` items are resolved by
   a decision, never by assumption.

## 2. Context-loading policy (in order)

1. `AGENTS.md` — operating rules.
2. `CODE_RULES.md` — structural/convention rules.
3. `docs/README.md` — documentation map.
4. `docs/planning/EXECUTION_STATUS.md` — current status, ready queue.
5. Your milestone file `docs/milestones/EPIC-00X/MILESTONE-NNN.md`.
6. Its epic `docs/epics/EPIC-00X.md`.
7. Only the additional documents the milestone references (e.g.
   `project/DATA_MODEL.md`, `project/API_CONTRACTS.md`,
   `project/TEMPLATE_SYSTEM.md`, `project/LOCALIZATION.md`).

Do **not** bulk-read unrelated features. Load the minimum needed to execute.

## 3. Taking a milestone (start)

1. Confirm all prerequisites are `Done` in `EXECUTION_STATUS.md`.
2. If a prerequisite is `Not Started`, do not start — pick another ready
   milestone or report the block.
3. Set the milestone `Status: In Progress` and `Owner` in both the milestone
   file (metadata) and `EXECUTION_STATUS.md`.
4. Re-read the milestone's **Technical contract** and **Acceptance criteria**
   sections; confirm each is implementable as written. If not, record the issue
   in the milestone's Handoff section and raise it before coding.
5. Work only within the milestone's scope. Out-of-scope changes are a scope
   violation.

## 4. Doing the work

- Follow the milestone's task list (`T01…`) and stop at each `Done when` gate.
- Keep changes consistent with `CODE_RULES.md` and existing patterns
  (feature folders, thin `route.ts`, handler→service→repository→model, tenant
  scoping, `{ success, data | error }`).
- Prefer the simplest fix; fix root causes, not symptoms (KISS).
- After each meaningful change run: `npm run typecheck`, `npm run lint`,
  `npm run build`, and the targeted tests named by the milestone.
- If reality contradicts the plan (e.g. a field the docs missed), update the
  docs in the same change and note it in the handoff.

## 5. Completing a milestone (handoff out)

Produce a handoff record using `templates/HANDOFF_TEMPLATE.md`. It must include:

- Milestone ID, owner, date, status.
- **Files changed** (paths) and why.
- **Commands run and their results** (paste summary lines).
- **Tests added/updated** (names + what they assert).
- **Acceptance criteria:** each `AC-*` with pass/fail + evidence.
- **Deviations/decisions:** any `DEC-*` amendment or new `OD-*`.
- **Follow-ups / risks** for downstream milestones.
- **Known untouched/blocked** items (honest gaps).

Then:

1. Set `Status: Done` in the milestone file **only if** every `AC-*` passed.
2. Update `EXECUTION_STATUS.md` (status, owner, evidence, ready queue, log).
3. Update `reports/TRACEABILITY.md` if any requirement status changed.
4. If a contract changed, update the relevant `project/*.md` and note it here.

## 6. Blocked handoff

If blocked (missing credential, external service, prerequisite, or unclear
decision):

- Set `Status: Blocked` — not `In Progress`, not `Done`.
- Record **precisely**: what is blocked, what was tried, what is needed, and who
  owns the unblocking (usually Product/Architecture for `OD-*`).
- Do not implement a workaround that fakes the blocked behavior (`AGENTS.md`
  §13–14). Do not invent an integration to make a test pass.

## 7. File-conflict rules

- Two active milestones must not edit the same file in the same window. If they
  would, the later one is not ready — resolve the ordering in
  `DEPENDENCY_MAP.md`.
- Shared contracts (`features/sites/model.ts`, `features/templates/types.ts`,
  `i18n/*`, `shared/lib/env.ts`) are changed by their owning milestone only;
  others consume them.
- If you must touch another feature, do it through its `service.ts`, never its
  `model.ts`/`repository.ts` (`CODE_RULES.md` §1).

## 8. Working with subagents

Delegation is encouraged for independent analysis, tracing, and testing
(`AGENTS.md` §8), with these rules:

- Give the subagent the milestone ID, the relevant contract, and the exact
  question. It starts with fresh context, so include what it needs.
- The owner keeps responsibility for architecture and final verification; a
  subagent's output is reviewed, not trusted blindly.
- Do not let two subagents edit the same files concurrently.

## 9. Session/directory moves

If you create a worktree or move the session to a different directory, use the
OpenCode session-move capability so the working directory tracks the work. Do not
leave the session pointed at a stale directory.

## 10. Definition of Done (per milestone)

A milestone is `Done` when **all** hold:

- [ ] All `AC-*` verified with evidence.
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes (no new errors).
- [ ] `npm run build` passes.
- [ ] Targeted tests exist and pass (where tests are applicable).
- [ ] No `CODE_RULES.md` boundary violated; no new routes with logic.
- [ ] Tenant isolation preserved for any touched tenant-scoped code.
- [ ] Docs updated (`EXECUTION_STATUS.md` + any changed contract/decision).
- [ ] Handoff record written.
- [ ] Scope respected (nothing out-of-scope).

## 11. Templates

- `templates/HANDOFF_TEMPLATE.md` — the handoff record.
- `templates/MILESTONE_TEMPLATE.md` — the 17-section milestone shape.
- `templates/EPIC_TEMPLATE.md` — the epic shape.
