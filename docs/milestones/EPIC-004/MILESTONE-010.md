# MILESTONE-010 — Contact & Site Settings Editor

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-010 |
| Epic | EPIC-004 — Content Editing |
| Title | Contact & Site Settings Editor |
| Status | Not Started |
| Owner | — |
| Depends on | M-004, M-008 |
| Blocks | — |
| PRD refs | FR-06, FR-10, FR-14, PA-04 |
| Decisions | DEC-004, DEC-005, DEC-009 |
| Estimated size | M |

## 2. Objective

Let customers edit contact details and basic site settings (site name, slug,
default locale, theme) that persist to the draft Site and reflect on the public
site after publish.

## 3. Background & rationale

FR-06 requires contact information editing; the current settings page is static
with dead links (D-09). Contact also feeds the Contact page (FR-05). Site
settings (slug/locale/theme) must be editable but must not silently break public
URLs.

## 4. Scope (in scope)

- Contact editor: phone, email, address (`LocalizedText`), map URL, social links.
- Site settings: site name, template (with confirmation), theme, default locale;
  slug editing with uniqueness validation and warning about changing the public
  URL.
- Persist to `Site.content.contact` and `Site` settings fields.

## 5. Out of scope

- Company/About/Services (M-009); publishing (M-021); tracking config (existing
  feature, out of MVP gate per DEC-009).

## 6. Dependencies & preconditions

- M-004 (content), M-008 (site exists).

## 7. Deliverables

- Change: `app/(dashboard)/dashboard/(panel)/settings/page.tsx` — real settings.
- Add: `features/sites/components/editor/ContactEditor.tsx`,
  `SiteSettingsEditor.tsx`.
- Change: `features/sites/schema.ts` — `updateSiteSchema` for settings + contact.
- Change: `features/sites/api-client.ts` — settings update.

## 8. Tasks

- **T01 — Contact fields**
  - Work: bilingual address; phone/email/mapUrl/social; validation (email/URL).
  - Done when: values persist and render on Contact (M-023).
- **T02 — Settings fields**
  - Work: name, template, theme, defaultLocale; slug with 409 `SLUG_TAKEN`
    handling and a change warning.
  - Done when: settings persist; invalid slug rejected.
- **T03 — Dead-link cleanup**
  - Work: remove `/about`, `/contact`, `/privacy` dead links from settings/footer
    or route them correctly.
  - Done when: no dead links remain.

## 9. Interfaces & contracts touched

```ts
// features/sites/api-client.ts
updateSiteSettings(input: UpdateSiteSettingsInput): Promise<Site>;
// UpdateSiteSettingsInput
{ name?: string; slug?: string; theme?: string; defaultLocale?: 'en'|'ar';
  contact?: SiteContent['contact'] }
```

## 10. Data model impact

- Writes `Site.name/slug/theme/defaultLocale` and `Site.content.contact`.

## 11. API impact

| Method | Path | Change |
|---|---|---|
| PUT | `/api/sites` | accepts settings + contact; 409 `SLUG_TAKEN`/`ONE_SITE_LIMIT` as applicable |

## 12. UI/UX impact

- Settings form with sections, validation feedback, slug-change confirmation,
  responsive/accessible.

## 13. Localization impact

- Bilingual address; UI strings in catalogs; locale change affects public default.

## 14. Security & tenancy

- Tenant from session; slug uniqueness enforced server-side; settings writes
  ownership-scoped.

## 15. Testing & verification

- Integration: contact/settings persist; duplicate slug → 409.
- Integration: settings change is draft-safe (does not change `published` until
  publish).
- `typecheck`, `lint`, `build` pass.

## 16. Acceptance criteria

- **AC-01** — Contact details are editable (bilingual address) and persist.
- **AC-02** — Site name/slug/theme/defaultLocale are editable; duplicate slug
  rejected.
- **AC-03** — No dead links remain on the settings page.
- **AC-04** — Changes do not affect the published site until publish.
- **AC-05** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- Changing the slug changes the public URL; warn clearly and revalidate on
  publish (M-021/M-024).
- Theme selection has no effect until EPIC-006 theme tokens are applied.
