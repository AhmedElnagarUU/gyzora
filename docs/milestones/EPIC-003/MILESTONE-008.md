# MILESTONE-008 — Site Creation Flow

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-008 |
| Epic | EPIC-003 — Site Creation & Dashboard |
| Title | Site Creation Flow |
| Status | Not Started |
| Owner | — |
| Depends on | M-003, M-004, M-006, M-013 |
| Blocks | M-009, M-010, M-011, M-021, M-027 |
| PRD refs | FR-02, FR-03, FR-12, PA-02, PA-03 |
| Decisions | DEC-001, DEC-002, DEC-004 |
| Estimated size | L |

## 2. Objective

Deliver a creation flow that collects meaningful company information, lets the
user select a template, creates exactly one Site, initializes its editable content
from the template, and lands the user in an editable (unpublished) site.

## 3. Background & rationale

FR-03 requires a meaningful initial form; the current `sites/new` collects only
name/slug/template/theme/status (D-09, DIAGNOSIS FR-03). Creation must clone the
template's default content (DEC-002) and must not depend on publishing (FR-09).

## 4. Scope (in scope)

- Multi-field creation form: company name, category, description, logo/brand
  imagery, contact info, address/location, services, features/capabilities,
  language preference, template selection.
- Server-side validation; create Site; init `content` via
  `cloneTemplateContent(template, companyInput)`; set `defaultLocale`.
- One-site enforcement in UI + server (409 `ONE_SITE_LIMIT`).
- Success → redirect to editor; clear error states.

## 5. Out of scope

- Rich editing after creation (EPIC-004); publish (EPIC-008); template design
  (EPIC-006, consumed).

## 6. Dependencies & preconditions

- M-003 (ownership/guard), M-004 (content/snapshot schema), M-006 (indexes/
  migration), M-013 (template defaults).
- At least the two real templates available from the registry.

## 7. Deliverables

- Change: `app/(dashboard)/dashboard/(panel)/sites/new/page.tsx` — real form.
- Change: `features/sites/handlers.ts` / `service.ts` — `createSite` with
  content init.
- Add/Change: `features/sites/components/SiteCreationForm.tsx` (client).
- Change: `features/sites/schema.ts` — `createSiteSchema` with required-field
  rules (only required fields required; FR-03).
- Change: `features/templates/index.ts` — template metadata for selection.

## 8. Tasks

- **T01 — Required-field rules**
  - Work: define which fields are required (minimum: company name, template,
    defaultLocale) and validate server-side.
  - Done when: invalid input returns 400 with field errors; valid input
    proceeds.
- **T02 — Form UI**
  - Work: build the multi-section form with template picker and image picker.
  - Done when: form collects all FR-03 fields and handles loading/errors.
- **T03 — Content initialization**
  - Work: on create, deep-clone `defaultContent` and overlay company input; set
    `defaultLocale`; `published = null`; `status = 'DRAFT'`.
  - Done when: the new site renders meaningful content without further edits.
- **T04 — One-site guard in UI**
  - Work: redirect to the existing site if one exists; never present creation
    twice.
  - Done when: a second creation attempt cannot be reached in the UI.

## 9. Interfaces & contracts touched

```ts
// features/sites/schema.ts
createSiteSchema: z.ZodType<CreateSiteInput>;
// CreateSiteInput
{ company: CompanyInput; template: string; defaultLocale: 'en'|'ar'; theme?: string }
// features/sites/service.ts
createSite(input, ctx): Promise<Site>  // deep-clones template default content
```

## 10. Data model impact

- Populates `Site.ownerUserId`, `tenantId`, `template`, `content`,
  `defaultLocale`, `status='DRAFT'`, `published=null`.

## 11. API impact

| Method | Path | Change |
|---|---|---|
| POST | `/api/sites` | accepts `CreateSiteInput`; 201 on success; 409 `ONE_SITE_LIMIT`; 400 validation |

## 12. UI/UX impact

- New creation form with grouped fields, template cards, image select,
  loading/empty/error/success states, responsive, accessible labels.

## 13. Localization impact

- Form labels/validation in catalogs; company text stored bilingual where the
  form collects it (correct language must not be overwritten when switching).

## 14. Security & tenancy

- Owner/tenant from session; template id validated against the registry; slug
  uniqueness handled with 409 `SLUG_TAKEN`.

## 15. Testing & verification

- Integration: create → exactly one site with cloned content; second create →
  409; concurrent create → one.
- Unit: `cloneTemplateContent` deep-copies.
- `typecheck`, `lint`, `build` pass.

## 16. Acceptance criteria

- **AC-01** — The form collects the FR-03 fields with explicit required rules.
- **AC-02** — Creation produces one Site with content initialized from the
  template; no publish required.
- **AC-03** — A second attempt is blocked in UI and by server (409).
- **AC-04** — Success leads to an editable site; errors are clear.
- **AC-05** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- Template selection UI depends on EPIC-006 default content being meaningful.
- M-006 migration must precede for existing users (OD-6).
- Do not require fields without a product reason (FR-03).
