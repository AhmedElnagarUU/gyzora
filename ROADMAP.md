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
- [~] 1.7 Add i18n support (English + Arabic, RTL/LTR) — config + messages created, component integration pending
- [x] 1.8 Verify build passes

### M2: Authentication & Authorization ✅
**Goal:** Users can sign up, sign in, and are assigned roles. Tenant created on signup.

- [x] 2.1 Install and configure Better Auth
- [x] 2.2 Create MongoDB connection and Mongoose setup
- [x] 2.3 Define User, Tenant, Site models
- [x] 2.4 Build sign up page
- [x] 2.5 Build sign in page
- [x] 2.6 Implement session management
- [x] 2.7 Add role-based authorization (CUSTOMER, OWNER)
- [x] 2.8 Create tenant on signup
- [x] 2.9 Protect dashboard routes
- [x] 2.10 Verify auth flow end-to-end

### M3: Customer Dashboard
**Goal:** Customers can manage their site, projects, and media.

- [ ] 3.1 Build dashboard layout (sidebar, header)
- [ ] 3.2 Create dashboard home (site overview)
- [ ] 3.3 Build site settings page
- [ ] 3.4 Build projects list page
- [ ] 5.5 Build project create/edit page
- [ ] 3.6 Build media library page
- [ ] 3.7 Implement S3 file upload
- [ ] 3.8 Add project image gallery
- [ ] 3.9 Verify dashboard flow

### M4: Template & Theme System
**Goal:** Customers can choose templates and themes for their site.

- [ ] 4.1 Define template TypeScript interfaces
- [ ] 4.2 Create 2 starter templates (Real Estate, Construction)
- [ ] 4.3 Define theme TypeScript interfaces
- [ ] 4.4 Create 3 starter themes (Light, Dark, Brand)
- [ ] 4.5 Build template selection page
- [ ] 4.6 Build theme selection page
- [ ] 4.7 Implement template rendering engine
- [ ] 4.8 Verify template + theme rendering

### M5: Content & Projects
**Goal:** Full project content management with SEO.

- [ ] 5.1 Build project content editor
- [ ] 5.2 Add SEO metadata fields
- [ ] 5.3 Implement project publishing status
- [ ] 5.4 Add project ordering
- [ ] 5.5 Verify content management

### M6: Publishing & Public Sites
**Goal:** Published sites are publicly accessible at `gzora.com/s/{tenantSlug}`.

- [ ] 6.1 Implement publish workflow
- [ ] 6.2 Build public site renderer
- [ ] 6.3 Add tenant slug resolution
- [ ] 6.4 Implement CDN caching headers
- [ ] 6.5 Add cache invalidation on publish
- [ ] 6.6 Verify public site delivery

### M7: Tracking & Pixels
**Goal:** Customers can configure tracking pixels.

- [ ] 7.1 Define tracking config schema
- [ ] 7.2 Build tracking settings page
- [ ] 7.3 Implement Meta Pixel injection
- [ ] 7.4 Implement Google Analytics injection
- [ ] 7.5 Verify tracking scripts load

### M8: Owner Dashboard
**Goal:** Platform owners can manage users, tenants, and view platform state.

- [ ] 8.1 Build owner dashboard layout
- [ ] 8.2 Build users list page
- [ ] 8.3 Build tenants list page
- [ ] 8.4 Implement activate/suspend tenant
- [ ] 8.5 Build platform analytics page
- [ ] 8.6 Verify owner authorization

### M9: Production Hardening
**Goal:** Secure, performant, monitored production deployment.

- [ ] 9.1 Security audit (OWASP)
- [ ] 9.2 Performance optimization
- [ ] 9.3 Error tracking (Sentry)
- [ ] 9.4 Logging and monitoring
- [ ] 9.5 Load testing
- [ ] 9.6 Deployment pipeline

---

## Dependencies

```
M1 (Foundation)
  └── M2 (Auth)
        └── M3 (Dashboard)
              ├── M4 (Templates)
              │     └── M5 (Content)
              │           └── M6 (Publishing)
              │                 └── M7 (Tracking)
              └── M8 (Owner Dashboard)
                    └── M9 (Production)
```

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Next.js 16 breaking changes | High | Read docs, test incrementally |
| Better Auth + MongoDB compatibility | Medium | Use official MongoDB adapter |
| S3 upload complexity | Medium | Use pre-signed URLs, abstract in repository |
| i18n RTL complexity | Medium | Use next-intl, test Arabic early |
| Multi-tenant data leaks | Critical | Repository pattern, always filter by tenantId |
| Scope creep | High | Strict MVP, post-MVP in roadmap |

## Unresolved Decisions

| Decision | Options | Status |
|----------|---------|--------|
| Billing provider | Polar (already in .env) vs Stripe | Polar — already configured |
| CDN | CloudFront vs Cloudflare | TBD in M6 |
| Error tracking | Sentry vs LogRocket | TBD in M9 |
| Testing strategy | Vitest vs Jest | Vitest — faster, ESM-native |
| ORM | Mongoose vs Prisma | Mongoose — simpler, MongoDB-native |
