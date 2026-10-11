# EPIC-003 — Site Creation & Dashboard

## 1. Summary

Deliver the core journey: an authenticated user with no Site sees a clear
"create your website" path, enters company information, selects a template, and
ends in an editable Site. The dashboard reflects the one-site reality (no
multi-site creation).

## 2. Motivation

Currently every user already owns an auto-created Site (D-01) and the creation
form collects almost nothing (D-09, FR-03 unmet). The dashboard presents a
multi-site workflow that contradicts the one-site invariant. This epic makes the
journey match PRD §5.

## 3. Scope

- In scope: dashboard lifecycle views (no-site / has-site states), creation form
  with company info + template selection, server-side one-site enforcement and
  content initialization from the template.
- Out of scope: content editing screens (EPIC-004), project management
  (EPIC-005), publishing (EPIC-008), template design (EPIC-006).

## 4. Related requirements

| PRD | Requirement |
|---|---|
| FR-02 | Dashboard and site lifecycle |
| FR-03 | Site creation |
| FR-12 | One site per user |
| PA-02 | One Site per user |
| PA-03 | Site creation |

## 5. Related decisions

- DEC-001 — one site per user; no auto-create at signup.
- DEC-002 — creation clones template default content.
- DEC-004 — creation is independent of publishing.

## 6. Milestones

| ID | Title | Depends on | Status |
|---|---|---|---|
| MILESTONE-007 | Site Lifecycle Dashboard | M-003 | Not Started |
| MILESTONE-008 | Site Creation Flow | M-003, M-004, M-006, M-013 | Not Started |

## 7. Dependencies

- Requires: EPIC-002 (ownership, content schema), M-013 (template defaults).
- Unblocks: EPIC-004 (editing needs an existing site), EPIC-005 (portfolio),
  EPIC-008 (publishing), M-027 (E2E).

## 8. Definition of Done (epic)

- [ ] A new user sees a "create site" state (no auto-created site).
- [ ] The creation form collects company info + template and creates exactly one
      Site, initializing content from the template.
- [ ] A second creation attempt is blocked in the UI and by the server.
- [ ] The user lands in an editable site without publishing first.
- [ ] `typecheck`, `lint`, `build` pass; creation covered by tests (M-025/M-027).

## 9. Risks & open decisions

- Template selection UI depends on EPIC-006 template metadata being meaningful;
  ensure at least the two real templates are selectable.
- Existing users with auto-created sites are handled by M-006 migration (OD-6).

## 10. Handoff notes

- Contract frozen: `Site.content` is initialized via
  `cloneTemplateContent(template, companyInput)`.
- EPIC-004/005/008 assume a Site always exists after this epic.
