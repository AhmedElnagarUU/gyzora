# Localization (Arabic / English)

How the platform supports `en` and `ar` in the dashboard, in customer content,
and on public websites. Binds EPIC-007 and every user-facing milestone. Rules
here come from DEC-005 and FR-10; where a product decision is still open it is
marked `OD-*` and must not be silently resolved.

## 1. Supported locales

| Locale | Direction | Role |
|---|---|---|
| `en` | LTR | Default product + default site locale |
| `ar` | RTL | Fully supported |

`Locale = 'en' | 'ar'`. The canonical list lives in `i18n/config.ts`; never
duplicate it — import the union.

## 2. Two distinct localization concerns

1. **UI chrome / system strings** — labels, buttons, validation, navigation.
   Owned by next-intl message catalogs (`i18n/messages/{en,ar}.json`). Rendered
   with `useTranslations` / `getTranslations`.
2. **Customer content** — company text, services, projects, image alt text.
   Owned by the customer and stored as bilingual data (`LocalizedText`), never as
   a global translation key.

These are intentionally separate. A customer's Arabic About text is data, not a
message catalog entry. Do not push customer content through `useTranslations`.

## 3. Bilingual content type

```ts
type LocalizedText = { en: string; ar: string };
```

- Both fields are always present; either may be the empty string.
- Arrays of localized items (services, features, process steps) carry
  `LocalizedText` per item.
- Language is modeled explicitly. It is **never** inferred from direction or
  script (FR-10).

## 4. Fallback policy (single source of truth)

Resolution order for any localized field, implemented once in `shared/i18n`
(do not re-implement per feature):

```
requested locale (e.g. 'ar')
  → 'en'
  → omit the field (render nothing for that slot)
```

- `resolveLocalized(value, locale)` returns `string` (possibly `''`).
- A section is dropped only when *all* of its localized fields resolve empty;
  a partially filled section renders the filled parts.
- Fallback never silently copies Arabic into an English field or vice versa
  (that would corrupt saved data). It only affects rendering.

## 5. Dashboard locale

- Chosen via a `locale` cookie (default `en`), next-intl "without i18n routing".
- No `[locale]` URL segment in the dashboard; existing routes are preserved
  (FR-11, DEC-005).
- A single `NextIntlClientProvider` is mounted in the root layout with locale +
  messages resolved on the server.
- Switching language persists the cookie and refreshes; form state in the
  dashboard is preserved (no data loss on language change, FR-10).

## 6. Public website locale

- Default locale = `Site.defaultLocale`.
- Visitors switch with `?lang=ar|en`. The query parameter is validated against
  the supported set; unknown values fall back to the site default.
- The public wrapper sets `<html lang>` and `<html dir>` from the resolved
  locale. `dir="rtl"` for `ar`.
- Language switching preserves the current Site and route (same slug, only
  `?lang` changes).
- `<link rel="alternate" hreflang="en|ar">` + `x-default` are emitted.
- Missing/unknown slug → graceful 404 regardless of locale.

> **OD-2:** whether SEO warrants locale-prefixed routes (`/ar/s/slug`). Default
> decision is cookie + `?lang` (DEC-005). A change requires a DEC amendment and a
> milestone update; do not switch ad hoc.

## 7. Direction-aware layout (RTL)

- RTL is driven by `dir` on the wrapper element plus **logical CSS properties**.
- Use Tailwind logical utilities: `ms-*`/`me-*` (margin), `ps-*`/`pe-*`
  (padding), `text-start`/`text-end`, `start-*`/`end-*` (inset), `border-s`/
  `border-e`.
- Never use `ml-*`/`mr-*`/`left-*`/`right-*` for direction-sensitive spacing in
  shared or public components. Physical properties are allowed only for truly
  direction-agnostic cases (e.g. centering) and must be justified.
- Icons that imply direction (arrows, chevrons) are mirrored for RTL only when
  the meaning is directional; `lucide-react` icons are not blindly flipped.
- Numbers, dates, currency: rendered consistently; no manual Arabic-Indic digit
  conversion (out of scope).

## 8. Message catalogs

- `i18n/messages/en.json` is the source of truth for keys.
- `i18n/messages/ar.json` must contain every key; missing keys fall back to `en`
  at runtime and are reported by a test (M-018, M-025).
- Keys use dot notation, namespaced by feature: `projects.list.title`,
  `sites.editor.about.heading`, `common.actions.save`.
- No hardcoded user-visible string in components. Landing-page strings currently
  live in the catalog; each later milestone moves its own strings in.

## 9. Validation & error messages

- Zod messages are localized by key, not embedded English text (or a single
  catalog lookup wraps raw Zod errors at the boundary).
- API errors remain machine-stable strings (`ONE_SITE_LIMIT`, `SLUG_TAKEN`);
  the client maps the code to a translated message. Do not send human prose in
  the API error field that the UI shows verbatim.

## 10. Rules (do / don't)

| Do | Don't |
|---|---|
| Store `{ en, ar }` for all customer text | Store one string and "translate later" |
| Resolve fallback in one shared helper | Duplicate fallback logic per feature |
| Use logical CSS utilities | Use `ml/mr/left/right` for layout spacing |
| Keep UI strings in message catalogs | Hardcode English in components |
| Emit `hreflang` alternates | Assume a single language for SEO |
| Model language explicitly | Infer locale from text direction |

## 11. Verification

- Unit tests assert `resolveLocalized` fallback (`ar`→`en`→omit).
- Catalog parity test: every `en` key exists in `ar` (M-025).
- Component tests assert `dir` on wrappers (M-018/M-019).
- E2E (M-027) exercises EN and AR on dashboard + public site, verifying
  direction, language switch, and that localized content persists.

See also: `TECHNICAL_DECISIONS.md` DEC-005, `TEMPLATE_SYSTEM.md` (localized
default content), `TEST_STRATEGY.md`.
