# Template System

The template/content/renderer contract. Binds EPIC-006 and the content,
publishing, and localization epics. Grounded in DEC-002 and DEC-006; PRD FR-04,
FR-05, FR-08. Templates are **immutable code definitions**; customer data lives
only in `Site.content` / `Site.published`.

## 1. Core model

```
TemplateDefinition (code, immutable)
  id, slug, name, description
  category: 'real-estate' | 'construction' | ...
  supportedLocales: Locale[]
  previewImage: string
  theme: TemplateTheme            // color/typography tokens
  pages: TemplatePage[]           // composition of sections per page
  sectionSchemas: Record<SectionType, ZodSchema>  // content shape per section
  imageSlots: ImageSlotDef[]      // named slots the customer can fill
  defaultContent: SiteContent     // bilingual seed content (deep-cloned per site)
```

- Definitions live in `features/templates/definitions/<template>/`.
- `features/templates/index.ts` exports the registry (`getTemplate(id)`,
  `listTemplates()`). It holds **no customer data** and performs **no DB access**.

## 2. SiteContent — the customer-owned data contract

All templates share **one** content shape; templates differ by which sections
they render, in what order, and their theme.

```ts
type LocalizedText = { en: string; ar: string };

type SiteContent = {
  company: { name: string; tagline: LocalizedText; description: LocalizedText;
             logo?: ImageRef; favicon?: ImageRef };
  about:   { title: LocalizedText; body: LocalizedText;
             mission?: LocalizedText; vision?: LocalizedText; image?: ImageRef };
  services: Array<{ id: string; title: LocalizedText; description: LocalizedText;
                    icon: string /* lucide name */; image?: ImageRef }>;
  features: Array<{ id: string; title: LocalizedText; description: LocalizedText; icon: string }>;
  stats?:   Array<{ id: string; label: LocalizedText; value: string }>; // only if real
  process?: Array<{ id: string; step: number; title: LocalizedText; description: LocalizedText }>;
  contact:  { phone?: string; email?: string; address?: LocalizedText;
              mapUrl?: string; social?: Record<string, string> };
  images:   Partial<Record<ImageSlotKey, ImageRef>>;
  isSampleContent?: boolean;
};
```

`ImageRef`:
```ts
type ImageRef = { url: string; alt: LocalizedText;
                  source: 'upload' | 'pexels' | 'bundled' };
```

- `projects` are **not** in `SiteContent`; they are a separate collection and
  enter the renderer as a separate argument + into the published snapshot.
- `stats` is optional and **only** populated with real customer data. Templates
  must not fabricate numbers (FR-05, DEC-006).

## 3. Section contract

- `SectionType` is a closed union (e.g. `hero`, `intro`, `services`, `features`,
  `featured-projects`, `stats`, `process`, `cta`, `contact`, `about-body`,
  `project-grid`, `project-detail`).
- Each section type has exactly one React component in
  `features/templates/sections/<Section>.tsx`.
- A section component receives `({ type, content, projects, locale, theme,
  page, activeProjectSlug? })` (see `sections/types.ts`) and is responsible only
  for presentation + fallback handling.
- Unknown section types are skipped, not crashed on (forward compatibility).
- Each section marks its own root with `data-section={type}`; a degraded (empty)
  section returns `null` and leaves no marker.

## 4. TemplateRenderer

- Server Component in `features/templates/components/TemplateRenderer.tsx`
  (only `ImageWithFallback` is a client component — `TemplateDefinition` holds
  Zod schema classes and must not cross a client boundary).

```
<TemplateRenderer
   template={TemplateDefinition}
   content={SiteContent}          // draft OR published snapshot content
   projects={ProjectView[]}       // from snapshot on public, live on preview
   locale={Locale}                // 'en' | 'ar', default 'en'
   theme={TemplateTheme}          // defaults to template.theme
   pageId={string?}               // template page id; default: home ('/')
   activeProjectSlug={string?}    // for 'project-detail' sections
/>
```

- **Single** renderer for all templates. No per-template renderer fork.
- Renders only sections declared in the resolved `template.pages[].sections`, in
  order; header/nav/footer chrome is derived from `template.pages` + content.
- Missing optional content → section degrades gracefully or is omitted. Never
  render literal placeholder text (FR-04).
- Theme tokens are applied as `--tp-*` CSS custom properties on the renderer
  root via `themeCssVars(theme)` and consumed by every section.
- Images use `next/image` through `ImageWithFallback`; on error or empty src,
  render a styled placeholder carrying the localized `alt` (FR-08).

## 5. Pages

Both MVP templates provide: **Home, About, Services, Projects, Project Details,
Contact** (FR-05). Page compositions differ between templates to give each a
distinct identity while consuming the same `SiteContent`.

| Page | Typical sections |
|---|---|
| Home | hero, intro, services, features, featured-projects, stats?, process?, cta, contact |
| About | about-body, mission/vision, features, cta |
| Services | services grid, process, cta |
| Projects | project-grid (filter by category) |
| Project Details | project-detail (gallery, category, location, description) |
| Contact | contact details, map/action |

## 6. Immutability & cloning

- Creating a Site deep-clones `template.defaultContent` and overlays company
  input. The template object is never written to.
- Editing writes only `Site.content`. There is **no** code path that mutates a
  `TemplateDefinition` (PRD invariant 8, FR-12).
- A helper `cloneTemplateContent(template, companyInput)` owns this; it is the
  only place that reads `defaultContent`.

## 7. Imagery (FR-08)

- Priority: customer uploads > Pexels results (if configured) > bundled curated
  defaults.
- `shared/lib/images/pexels.ts` (server-only) is an **optional** provider. When
  `PEXELS_API_KEY` is absent or the API fails, it returns an empty result and the
  caller uses bundled defaults. Site creation/rendering never depends on it.
- Bundled defaults live under `public/templates/<template>/…` and are curated
  per business category; they are coherent, correctly cropped (consistent aspect
  ratio), and licensed for use. They are labeled `source: 'bundled'`.
- Illustrative imagery (`source: 'pexels' | 'bundled'`) is always visually
  distinguishable from customer project imagery and is never captioned as a
  customer's real project (FR-08).
- Alt text is required and localized. `images.pexels.com` must be present in
  `next.config.ts` `remotePatterns` before any Pexels URL renders.

## 8. Quality bar (PA-06)

A newly created site, with **only** its creation-form input and no further edits,
must render all six pages as a complete, coherent company profile:

- No empty sections, no "Property Name", no lorem ipsum, no "coming soon".
- Content is category-appropriate and worded generically (no invented facts).
- Responsive on mobile/tablet/desktop, in both `en` and `ar`.
- Consistent typography, spacing, imagery treatment, and `lucide-react` icons.
- No broken images when slots are unfilled (bundled fallbacks).

## 9. Template identity

The two templates must be *visually distinct* while sharing data contracts:

| Template | Identity | Home emphasis |
|---|---|---|
| `real-estate` | premium, spacious, large hero, property-forward | featured listings, locations |
| `construction` | sturdy, industrial, capability-forward | process, capabilities, stats (if real), safety |

Theme tokens (colors, radii, fonts) are per-template; layout density and section
order differ. Both are validated by the same section components.

## 10. Rules (do / don't)

| Do | Don't |
|---|---|
| One `SiteContent` shape for all templates | Per-template divergent data models |
| One `TemplateRenderer` | A renderer per template |
| Immutable definitions + deep clone | Mutate `defaultContent` per site |
| Bundled fallback imagery | Depend on Pexels at create/render time |
| `lucide-react` icons | Emoji or ad-hoc SVG icon sets |
| Graceful degradation | Placeholder/lorem/coming-soon content |

## 11. Verification

- M-013–M-017 build/verify definitions, renderer, sections, both templates, and
  imagery.
- Unit tests: unknown section skipped; missing localized field omitted; clone
  does not share references with the definition.
- E2E (M-027): create a site on each template, publish, view in EN + AR, assert
  six pages and no placeholder text.
- Component snapshots assert no placeholder strings.

See also: `DEC-002`, `DEC-006`, `LOCALIZATION.md`, `DATA_MODEL.md`
(`SiteContent`/`PublishedSnapshot`).
