# EPIC-004 — Content Editing

## 1. Summary

Give customers editors for their Site content — company information, About Us,
Services, capabilities/features, and Contact/site settings — that load the saved
values, validate, save reliably, and never modify the shared template.

## 2. Motivation

FR-06 requires full content editing after creation and after publication, and
there is currently no content field or editor at all (D-03, D-04: configuration
"Save" is a no-op). Without editors the product is not a website builder.

## 3. Scope

- In scope: company/about/services/features editor, contact & site settings
  editor, save/validation/feedback, image references for supported fields.
- Out of scope: project editing (EPIC-005), template rendering (EPIC-006),
  publish/preview (EPIC-008), localization wiring (EPIC-007, consumed here).

## 4. Related requirements

| PRD | Requirement |
|---|---|
| FR-06 | Website content editing |
| FR-10 | Arabic & English (content fields) |
| FR-14 | UX and visual quality |
| PA-04 | Content editing |

## 5. Related decisions

- DEC-002 — edits write `Site.content` only, never the template.
- DEC-004 — editing is independent of publishing; draft is always editable.
- DEC-005 — bilingual `LocalizedText` fields.

## 6. Milestones

| ID | Title | Depends on | Status |
|---|---|---|---|
| MILESTONE-009 | Company / About / Services / Capabilities Editor | M-004, M-008 | Not Started |
| MILESTONE-010 | Contact & Site Settings Editor | M-004, M-008 | Not Started |

## 7. Dependencies

- Requires: EPIC-002 (content schema), EPIC-003 (a Site exists), EPIC-006
  (section contract for which fields are editable).
- Unblocks: EPIC-008 (preview/publish of edited content), M-027 (E2E).

## 8. Definition of Done (epic)

- [ ] A user can edit and save company/about/services/features/contact content,
      reload the editor, and see saved values.
- [ ] Editing works before and after publication; the public site is unaffected
      until publish.
- [ ] Validation prevents invalid data from breaking rendering.
- [ ] Arabic and English fields both editable; no data overwritten on switch.
- [ ] Saved content is reflected by the renderer.
- [ ] `typecheck`, `lint`, `build` pass; editor covered by tests.

## 9. Risks & open decisions

- Editor scope must map to the M-013 section contract; adding fields later
  requires a schema change and a migration note.
- OD-2 (locale routing) affects how users switch editing language.

## 10. Handoff notes

- Contract frozen: `PUT /api/sites` accepts draft `content` and returns the
  updated Site; envelope-conforming.
- The renderer (EPIC-006) must consume every field these editors write.
