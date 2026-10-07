# Gzora Architecture

## System Overview

Gzora is a multi-tenant SaaS website builder built as a modular Next.js monolith.

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Landing Page│  │  Dashboard  │  │  Public Tenant Site │ │
│  │   (/)       │  │  (/dashboard)│  │  (/s/[tenantSlug]) │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 16 Server                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   App Router│  │ Route Handlers│  │  Server Actions   │ │
│  │  (Pages)    │  │  (/api/*)    │  │  (Mutations)      │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Better Auth│  │  Repositories│  │  Services          │ │
│  │  (Session)  │  │  (MongoDB)   │  │  (Business Logic)  │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   MongoDB   │  │     S3      │  │      CDN            │ │
│  │  (Metadata) │  │  (Media)    │  │  (Cache/Delivery)   │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Request Flows

### 1. Public Landing Page
```
Browser → Next.js Server Component → Static HTML (cached)
```

### 2. Customer Dashboard
```
Browser → Next.js Server Component → auth.api.getSession() → Repository → MongoDB → HTML
```

### 3. Public Tenant Site
```
Browser → /s/[tenantSlug] → Resolve tenant → Fetch published site → Render template + theme + content → HTML
```

### 4. API Mutation (Server Action)
```
Browser → Server Action → Validate (Zod) → Auth check → Repository → MongoDB → Revalidate → Response
```

## Multi-Tenancy Model

### Tenant Isolation
- Every tenant-scoped query MUST include `tenantId` filter
- Repositories enforce tenant isolation
- Tenant context derived from session, never from client input

### Tenant Resolution
- **Dashboard**: `session.user.tenantId`
- **Public site**: `tenantSlug` URL parameter → lookup tenant → verify published

### Data Model
```
User → belongs to → Tenant → has many → Sites
                                    → has many → Projects
                                    → has many → Media
                                    → has one  → ThemeConfig
                                    → has one  → TrackingConfig
```

## Authentication & Authorization

### Better Auth
- Session-based authentication
- Roles: `CUSTOMER`, `OWNER`
- Session contains: `user.id`, `user.role`, `user.tenantId`

### Authorization Matrix
| Route | CUSTOMER | OWNER | Public |
|-------|----------|-------|--------|
| `/` | ✅ | ✅ | ✅ |
| `/auth/*` | ✅ | ✅ | ✅ |
| `/dashboard/*` | ✅ (own tenant) | ✅ | ❌ |
| `/owner/*` | ❌ | ✅ | ❌ |
| `/s/[tenantSlug]` | ✅ | ✅ | ✅ (if published) |

## Template Rendering

### Template Structure
```typescript
interface Template {
  id: string
  name: string
  category: 'real-estate' | 'construction' | 'interior-design' | 'architecture'
  sections: TemplateSection[]
  defaultTheme: string
}

interface TemplateSection {
  id: string
  type: 'hero' | 'projects' | 'about' | 'contact' | 'gallery'
  config: Record<string, unknown>
}
```

### Rendering Pipeline
```
Template + Theme + Tenant Content + Locale → React Components → HTML
```

## Caching Strategy

| Layer | Cache | Invalidation |
|-------|-------|--------------|
| CDN | Public tenant sites | On publish |
| Next.js | Static pages | On revalidateTag |
| MongoDB | Query results | On mutation |
| Browser | Static assets | Versioned URLs |

## Security

- All inputs validated with Zod
- Tenant isolation enforced in repositories
- API keys never exposed to client
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Rate limiting on API routes (future)
