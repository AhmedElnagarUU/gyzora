# EPIC-005 — Portfolio (Projects)

## 1. Summary

Deliver bilingual portfolio management: create, view, edit, delete, order, and
attach images/cover to projects that belong to the user's Site and feed the
public website.

## 2. Motivation

FR-07 requires project CRUD, and today project text is single-language (D-13),
projects are not reliably linked to a Site (D-12), and there is no media/cover
attach UI or ordering UX. The portfolio is the core credibility asset of a
company-profile site.

## 3. Scope

- In scope: bilingual project CRUD (title, description, category, location),
  cover/gallery image references, display ordering, status eligibility, delete
  authorization.
- Out of scope: project editing on the public site, template rendering design
  (EPIC-006), publish snapshot behavior (EPIC-008 consumes projects).

## 4. Related requirements

| PRD | Requirement |
|---|---|
| FR-07 | Portfolio project management |
| FR-08 | Image management (project images) |
| FR-10 | Arabic & English |
| PA-05 | Portfolio management |

## 5. Related decisions

- DEC-004 — non-ARCHIVED projects in `order` enter the publish snapshot.
- DEC-005 — bilingual project fields.
- DEC-006 — customer project imagery distinguishable from illustrative imagery.

## 6. Milestones

| ID | Title | Depends on | Status |
|---|---|---|---|
| MILESTONE-011 | Project CRUD (bilingual) | M-005, M-008 | Not Started |
| MILESTONE-012 | Project Media / Cover / Ordering | M-011 | Not Started |

## 7. Dependencies

- Requires: EPIC-002 (project schema, site linkage), EPIC-003 (Site exists),
  media feature (existing).
- Unblocks: EPIC-008 (published projects), M-027 (E2E portfolio journey).

## 8. Definition of Done (epic)

- [ ] A user can create, edit, delete, and reorder their projects.
- [ ] Projects are bilingual and scoped to the owning Site/tenant; deleting
      another tenant's project is denied.
- [ ] Cover image and gallery references persist and render.
- [ ] Invalid data is rejected; public pages never break from project data.
- [ ] `typecheck`, `lint`, `build` pass; CRUD + isolation covered by tests.

## 9. Risks & open decisions

- OD-5 (project status vs site publish) — DEC-004 picks site-level publish gate;
  keep project status as "eligible for next publish".
- Image picker depends on existing media library/S3 flow.

## 10. Handoff notes

- Contract frozen: `Project.siteId` required; `Project.title/description` are
  `LocalizedText`; `order` ascending.
- EPIC-008 snapshots projects at publish time; live edits do not change the
  published site until re-publish.
