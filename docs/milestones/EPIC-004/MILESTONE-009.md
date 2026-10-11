# MILESTONE-009 — Company / About / Services / Capabilities Editor

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-009 |
| Epic | EPIC-004 — Content Editing |
| Title | Company / About / Services / Capabilities Editor |
| Status | Not Started |
| Owner | — |
| Depends on | M-004, M-008 |
| Blocks | M-027 |
| PRD refs | FR-06, FR-10, FR-14, PA-04 |
| Decisions | DEC-002, DEC-004, DEC-005 |
| Estimated size | L |

## 2. Objective

Give customers a working editor for company identity, About Us, Services, and
capabilities/features that loads current content, validates, saves reliably, and
never alters the shared template.

## 3. Background & rationale

D-04: the only "configuration" UI is a no-op `alert()`. FR-06 requires editing of
company name/description, About, Services, and features. This editor writes
`Site.content` (draft), independent of publishing (DEC-004).

## 4. Scope (in scope)

- Editor sections: company (name, tagline, description, logo), About
  (title/body/mission/vision/image), Services (add/edit/remove/reorder items with
  icon + image), Features/capabilities (same pattern), optional Stats (only real
  data; off by default).
- Load current draft content; save via `PUT /api/sites`; success/error feedback.
- Per-field bilingual inputs (EN/AR) using `LocalizedText`.

## 5. Out of scope

- Contact/site settings (M-010); projects (EPIC-005); publish/preview
  (EPIC-008); template rendering (EPIC-006, consumed).

## 6. Dependencies & preconditions

- M-004 (content schema + `updateDraftContent`), M-008 (a site exists), M-013
  (section contract defines editable fields).

## 7. Deliverables

- Add: `app/(dashboard)/dashboard/(panel)/editor/page.tsx` (or
  `content/page.tsx`) — editor entry.
- Add: `features/sites/components/editor/{CompanyEditor,AboutEditor,ServicesEditor,FeaturesEditor}.tsx`.
- Change: `features/sites/handlers.ts` — `PUT` persists draft `content`.
- Change: `features/sites/api-client.ts` — `updateSiteContent`.
- Remove/replace: `features/templates/components/TemplateConfigContent.tsx`
  no-op save (migrate its slot config into the real editor or delete).

## 8. Tasks

- **T01 — Draft load/save path**
  - Work: editor loads `getDraftContent`; saves via api-client → handler →
    `updateDraftContent`.
  - Done when: saved values persist across reload.
- **T02 — Company/About editors**
  - Work: bilingual fields with validation; image selection from media.
  - Done when: AR and EN both editable; no overwrite on switch.
- **T03 — Services/Features editors**
  - Work: add/edit/remove/reorder items; lucide icon picker; per-item images.
  - Done when: list CRUD works and persists.
- **T04 — Stats (optional)**
  - Work: disabled by default; explicit opt-in; warning against fabricated data.
  - Done when: absent unless the user provides real values.
- **T05 — Feedback**
  - Work: inline success/error, dirty-state handling, disabled save while saving.
  - Done when: no silent failures; no false success.

## 9. Interfaces & contracts touched

```ts
// features/sites/api-client.ts
updateSiteContent(input: { content: SiteContent }): Promise<Site>;
// features/sites/service.ts (M-004)
updateDraftContent(tenantId, content): Promise<Site>;
```

## 10. Data model impact

- Writes `Site.content` only; `Site.published` untouched.

## 11. API impact

| Method | Path | Change |
|---|---|---|
| PUT | `/api/sites` | accepts draft `content`; returns updated Site; envelope |

## 12. UI/UX impact

- Editor with sections/tabs, item lists, icon/image pickers, clear states,
  accessibility (labels, keyboard), responsive.

## 13. Localization impact

- EN/AR inputs per field; language toggle in the editor; no data loss on switch;
  new UI strings added to catalogs.

## 14. Security & tenancy

- Tenant from session; validate content with Zod; reject unknown/invalid fields.

## 15. Testing & verification

- Integration: save → reload returns saved values; invalid content rejected.
- Integration: editing does not change `Site.published`.
- Component: bilingual field round-trip.
- `typecheck`, `lint`, `build` pass.

## 16. Acceptance criteria

- **AC-01** — Company/About/Services/Features content is editable and persists.
- **AC-02** — Both languages are editable without overwriting each other.
- **AC-03** — Saving shows success; failures show an error and persist nothing.
- **AC-04** — The shared template definition is never modified.
- **AC-05** — Stats are empty unless real data is provided.
- **AC-06** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- The editor must cover exactly the M-013 fields the renderer consumes; adding a
  field later requires a schema + renderer update.
- Do not present sample data as real company facts (FR-05).
