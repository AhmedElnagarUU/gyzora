# Data Model

Target entities and indexes. "Current" reflects verified code; "Target" is the
agreed contract (see `TECHNICAL_DECISIONS.md`). Deviations require a decision
amendment.

## Entity relationships (target)

```
User (Better Auth `user`)
  1 ─── 1 Tenant            (CUSTOMER; created at signup)
  1 ─── 1 Site              (enforced by Site.ownerUserId unique)
                 Site
                  1 ─── N Project      (Project.siteId required)
                  1 ─── N Media        (tenant-scoped)
                  1 ─── 0..1 TrackingConfig (tenant-scoped)
```

`Template` is **not** a collection — it is a code-resident definition (DEC-002).

## User (`user` collection, Better Auth-owned)

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `email` | string | unique, lowercase |
| `name` | string | |
| `role` | `'CUSTOMER' \| 'OWNER'` | default CUSTOMER |
| `tenantId` | ObjectId | ref Tenant |

Managed by Better Auth; `features/auth/service.updateUser` writes `role`/`tenantId`.

## Tenant (`tenants`)

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `name` | string | |
| `slug` | string | **unique**, lowercase |
| `plan` | `'FREE'\|'PRO'\|'ENTERPRISE'` | retained; not an MVP gate (DEC-009) |
| `status` | `'ACTIVE'\|'SUSPENDED'\|'DELETED'` | public site requires `ACTIVE` |
| `createdAt/updatedAt` | Date | |

## Site (`sites`) — current vs target

| Field | Current | Target |
|---|---|---|
| `_id` | ObjectId | ObjectId |
| `ownerUserId` | — | ObjectId ref user, **unique** |
| `tenantId` | ObjectId (index only) | ObjectId ref Tenant, **unique** |
| `name` | string | string |
| `slug` | string, **unique** | string, **unique**, lowercase |
| `template` | string | string (template id) |
| `theme` | string | string (theme id) |
| `defaultLocale` | — | `'en' \| 'ar'`, default `'en'` |
| `status` | `DRAFT\|PUBLISHED` | `DRAFT \| PUBLISHED` (public gate) |
| `content` | — | `SiteContent` (draft, bilingual) |
| `published` | — | `PublishedSnapshot \| null` |
| `createdAt/updatedAt` | Date | Date |

Target indexes: `{ slug: 1 } unique`, `{ ownerUserId: 1 } unique`,
`{ tenantId: 1 } unique`.

`SiteContent` (shape finalized in M-013, persisted in M-004):
```
LocalizedText = { en: string; ar: string }
SiteContent = {
  company:  { name, tagline, description, logo?, favicon? }
  about:    { title: LocalizedText, body: LocalizedText, mission?, vision?, image? }
  services: Array<{ id, title: LocalizedText, description: LocalizedText,
                    icon: string /* lucide name */, image? }>
  features: Array<{ id, title: LocalizedText, description: LocalizedText, icon }>
  stats?:   Array<{ id, label: LocalizedText, value: string }>   // only if real
  process?: Array<{ id, step, title: LocalizedText, description: LocalizedText }>
  contact:  { phone?, email?, address?: LocalizedText, mapUrl?, social?: {...} }
  images:   Partial<Record<ImageSlotKey, ImageRef>>
  isSampleContent?: boolean
}
ImageRef = { url: string; alt: LocalizedText; source: 'upload'|'pexels'|'bundled' }
```
`PublishedSnapshot`:
```
{ content: SiteContent, template: string, theme: string,
  defaultLocale: 'en'|'ar', projects: ProjectSnapshot[],
  version: number, publishedAt: Date }
```

## Project (`projects`)

| Field | Current | Target |
|---|---|---|
| `_id` | ObjectId | ObjectId |
| `tenantId` | ObjectId (index) | ObjectId (index) |
| `siteId` | ObjectId (optional) | ObjectId ref Site, **required**, indexed |
| `title` | string | `LocalizedText` |
| `description` | string | `LocalizedText` |
| `slug` | string | string, unique per site |
| `category` | string | string |
| `location` | — | `LocalizedText?` |
| `order` | number | number (ascending display order) |
| `status` | `DRAFT\|PUBLISHED\|ARCHIVED` | same (publish eligibility, DEC-004) |
| `coverImage` | — | `ImageRef?` |
| `images` | array | array of `ImageRef` |
| `seoMetadata` | object | `{ title?, description?, keywords?, ogImage? }` |
| `createdAt/updatedAt` | Date | Date |

Target indexes: `{ tenantId: 1 }`, `{ siteId: 1, order: 1 }`,
`{ siteId: 1, slug: 1 } unique`.

> Migration note: `title`/`description` change from `string` to `LocalizedText`.
> M-006 defines the migration (wrap existing strings into `{ en: value, ar: '' }`).

## Media (`media`)

| Field | Type | Notes |
|---|---|---|
| `tenantId` | ObjectId | index |
| `key` | string | S3 key `tenants/{tenantId}/...` |
| `url` | string | public URL |
| `size` | number | bytes |
| `mimeType` | enum | png/jpeg/jpg/gif/webp |

Index: `{ tenantId: 1, key: 1 } unique`.

## TrackingConfig (`tracking_configs`)

| Field | Type | Notes |
|---|---|---|
| `tenantId` | ObjectId | index |
| `siteId` | ObjectId | optional |
| `trackers[]` | array | `{ provider, name, pixelId?, trackingId?, scriptUrl?, enabled }` |

## Invariants

1. At most one Site per User (unique `ownerUserId`) — FR-12, PA-02.
2. At most one Site per Tenant (unique `tenantId`).
3. `Site.slug` globally unique.
4. Projects are owned by a Site and scoped by `tenantId`.
5. `Site.content` (draft) never leaks to public; public reads `Site.published`.
6. Template definitions are immutable and hold no customer data.
