# Gzora — Technical Roadmap

## Epics

### Epic 1: Product Foundation
Project setup, tooling, architecture, landing page.

### Epic 2: Authentication & Authorization
Better Auth integration, sign up/sign in, role-based access, tenant creation on signup.

### Epic 3: Customer Dashboard
Dashboard layout, site management, project CRUD, media management.

### Epic 4: Template & Theme System
Template definitions, theme system, template rendering engine.

### Epic 5: Content & Projects
Project content management, image galleries, SEO metadata.

### Epic 6: Publishing & Public Sites
Draft/publish workflow, public site rendering, CDN delivery, cache invalidation.

### Epic 7: Tracking & Pixels
Meta Pixel, Google Analytics, custom tracking scripts.

### Epic 8: Owner Dashboard
User management, tenant management, platform analytics, subscription management.

### Epic 9: Production Hardening
Security audit, performance optimization, monitoring, error tracking.

---

## Milestones

### M1: Product Foundation + Landing Page ✅
**Goal:** Working Next.js 16 app with TypeScript, Tailwind, ESLint, and a professional landing page.

- [x] 1.1 Initialize TypeScript configuration
- [x] 1.2 Set up Tailwind CSS
- [x] 1.3 Configure ESLint
- [x] 1.4 Create project structure (directories)
- [x] 1.5 Build landing page layout (header, footer, hero)
- [x] 1.6 Build landing page sections (features, templates preview, CTA)
- [x] 1.7 Complete i18n support (English + Arabic, RTL/LTR) — config, messages, and layout integration
- [x] 1.8 Done when: `npm run build` passes and the landing page renders locally.

### M2: Authentication & Authorization ✅
**Goal:** Users can sign up, sign in, and are assigned roles. Tenant created on signup.

- [x] 2.1 Install and configure Better Auth
- [x] 2.2 Create MongoDB connection and Mongoose setup
- [x] 2.3 Define User, Tenant, Site models (each in its own feature folder)
- [x] 2.4 Build sign up page
- [x] 2.5 Build sign in page
- [x] 2.6 Implement session management
- [x] 2.7 Add role-based authorization (CUSTOMER, OWNER)
- [x] 2.8 Create tenant on signup
- [x] 2.9 Protect dashboard routes
- [x] 2.10 Done when: a new user can sign up (with tenant auto-created), sign in, access the dashboard, and sign out.

### M3: Customer Dashboard ✅
**Goal:** Customers can manage their site, projects, and media.

- [x] 3.1 Build dashboard layout (sidebar, header)
- [x] 3.2 Create dashboard home (site overview)
- [x] 3.3 Build site settings page
- [x] 3.4 Build projects list page
- [x] 3.5 Build project create/edit page
- [x] 3.6 Build media library UI (list/upload/delete)
- [x] 3.7 Implement S3 pre-signed upload + metadata storage
- [x] 3.8 Enforce tenant-scoped S3 keys and file validation
- **Done when:** a customer can open the media library, upload an image file (validated by type/size), see it listed, and delete it — all scoped to their tenant.

### M4: Template & Theme System ✅
**Goal:** Customers can choose templates and themes for their site.

- [x] 4.1 Define template TypeScript interfaces
- [x] 4.2 Create 2 starter templates (Real Estate, Construction)
- [x] 4.3 Define theme TypeScript interfaces
- [x] 4.4 Create 3 starter themes (Light, Dark, Brand)
- [x] 4.5 Build template selection page
- [x] 4.8 Define image slots per template; build picker from media library
- **Done when:** a customer selects a template/theme and assigns images from their library to defined slots (logo, hero, gallery).

### M5: Content & Projects ✅
**Goal:** Full project content management with SEO.

- [x] 5.1 Build project content editor
- [x] 5.2 Add SEO metadata fields
- [x] 5.3 Implement project publishing status
- [x] 5.4 Add project ordering
- [x] 5.5 Done when: a customer can create and edit project content with SEO fields, set ordering, and toggle publishing state.

### M6: Publishing & Public Sites ✅
**Goal:** Published sites are publicly accessible at `/s/{tenantSlug}`.

- [x] 6.1 Implement publish workflow
- [x] 6.2 Build public site renderer
- [x] 6.3 Add tenant slug resolution
- [x] 6.4 Implement CDN caching headers (ISR: 3600s revalidate)
- [x] 6.5 Serve S3-hosted images via next/image with S3 base URL
- [x] 6.7 Add cache invalidation on publish
- **Done when:** a published site is viewable at `/s/{tenantSlug}` with template, theme, and assigned images rendering from S3 URLs.

### M7: Tracking & Pixels
**Goal:** Customers can configure tracking pixels.

- [ ] 7.1 Define tracking config schema
- [ ] 7.2 Build tracking settings page
- [ ] 7.3 Implement Meta Pixel injection
- [ ] 7.4 Implement Google Analytics injection
- [ ] 7.5 Done when: tracking scripts (Meta Pixel, GA) load on the published public site and fire for the configured tracking IDs.

### M8: Owner Dashboard
**Goal:** Platform owners can manage users, tenants, and view platform state.

- [ ] 8.1 Build owner dashboard layout
- [ ] 8.2 Build users list page
- [ ] 8.3 Build tenants list page
- [ ] 8.4 Implement activate/suspend tenant
- [ ] 8.5 Build platform analytics page
- [ ] 8.6 Done when: an OWNER can list users/tenants, activate/suspend tenants, and view platform analytics — all behind OWNER-only authorization.

### M9: Production Hardening
**Goal:** Secure, performant, monitored production deployment.

- [ ] 9.1 Security audit (OWASP)
- [ ] 9.2 Performance optimization
- [ ] 9.3 Error tracking (Sentry)
- [ ] 9.4 Logging and monitoring
- [ ] 9.5 Load testing
- [ ] 9.6 Deployment pipeline
- **Done when:** the platform passes an OWASP security scan, serves pages with sub-100ms P95 latency, tracks errors in production, and deploys via a CI/CD pipeline.

---

## Dependencies

```
M1 (Foundation)
  └── M2 (Auth)
        └── M3 (Dashboard + Media/S3)
              ├── M4 (Templates + Image Slots)
              │     └── M5 (Content)
              │           └── M6 (Publishing + S3 image rendering)
              │                 └── M7 (Tracking)
              └── M8 (Owner Dashboard)
                    └── M9 (Production) depends on all of M1–M8
```

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Next.js 16 breaking changes | High | Read docs, test incrementally |
| Better Auth + MongoDB compatibility | Medium | Use official MongoDB adapter |
| S3 upload complexity | Medium | Use pre-signed URLs, abstract in repository |
| S3 upload security / malicious files | High | Validate type + size server-side before signing; store only metadata |
| Cross-tenant image access | Critical | S3 keys are tenant-scoped `tenants/{tenantId}/...`; repository always filters by tenantId |
| i18n RTL complexity | Medium | Use next-intl, test Arabic early |
| Multi-tenant data leaks | Critical | Repository pattern, always filter by tenantId |
| Scope creep | High | Strict MVP, post-MVP in roadmap |

## Decided

| Decision | Choice |
|----------|--------|
| Billing provider | Polar — already configured |
| Testing strategy | Vitest — faster, ESM-native |
| ORM | Mongoose — simpler, MongoDB-native |

## Unresolved Decisions

| Decision | Options | Status |
|----------|---------|--------|
| CDN | CloudFront vs Cloudflare | TBD in M6 |
| Error tracking | Sentry vs LogRocket | TBD in M9 |
