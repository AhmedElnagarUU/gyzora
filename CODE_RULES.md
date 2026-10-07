# Gzora — Code Rules

## 1. Project Structure

```
gyzora/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Landing page, pricing, etc.
│   ├── (dashboard)/        # Customer dashboard (auth required)
│   ├── (owner)/            # Owner dashboard (owner role required)
│   ├── [tenantSlug]/       # Public tenant websites
│   ├── api/                # Route Handlers (API endpoints)
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/             # Shared React components
│   ├── ui/                 # Base UI components (Button, Input, etc.)
│   ├── forms/              # Form components
│   └── layout/             # Layout components (Header, Footer, etc.)
├── lib/                    # Server-side utilities
│   ├── auth/               # Better Auth config
│   ├── db/                 # MongoDB connection
│   ├── repositories/       # Data access layer
│   ├── services/           # Business logic
│   └── utils/              # Helper functions
├── models/                 # Mongoose schemas
├── templates/              # Website templates (TypeScript objects)
├── themes/                 # Theme definitions
├── i18n/                   # Internationalization
│   ├── messages/           # Translation files
│   └── config.ts           # i18n configuration
├── docs/                   # Documentation
│   ├── architecture/
│   ├── decisions/
│   ├── epics/
│   └── reports/
├── public/                 # Static assets
├── next.config.ts
├── tsconfig.json
└── package.json
```

## 2. Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Components | PascalCase | `ProjectCard.tsx` |
| Files (non-component) | kebab-case | `auth-service.ts` |
| API routes | kebab-case | `app/api/auth/login/route.ts` |
| Mongoose models | PascalCase singular | `User`, `Tenant`, `Site` |
| MongoDB collections | snake_case plural | `users`, `tenants`, `sites` |
| CSS classes | Tailwind utilities | `flex items-center gap-2` |
| Environment variables | SCREAMING_SNAKE | `MONGODB_URI` |
| i18n keys | dot.notation | `dashboard.projects.title` |

## 3. Server/Client Boundaries

### Server Components (default)
- Data fetching from MongoDB
- Authentication checks
- Business logic
- Database mutations via Server Actions

### Client Components (`'use client'`)
- Interactive UI (forms, modals, dropdowns)
- Browser APIs (localStorage, window)
- Event handlers (onClick, onChange)
- Third-party integrations (analytics, pixels)

### Rules
- **Never** import server-only code into client components
- **Never** expose API keys to client components
- **Always** validate data on server, even if validated on client
- Server Actions for mutations, Route Handlers for external APIs

## 4. Database Access

### Mongoose Models
- All models in `models/` directory
- Models are singletons — use `models/` pattern to avoid recompilation
- Always use TypeScript interfaces with models

### Repository Pattern
- All database queries go through repositories in `lib/repositories/`
- Components/pages never query MongoDB directly
- Repositories return plain objects, not Mongoose documents

### Tenant Isolation
- **EVERY** query MUST include `tenantId` filter
- Repositories enforce tenant isolation automatically
- Never trust client-provided tenantId — derive from session

```typescript
// CORRECT: tenantId from session
const session = await auth.api.getSession({ headers })
const tenantId = session?.user.tenantId
const projects = await projectRepository.findByTenant(tenantId)

// WRONG: tenantId from client input
const { tenantId } = await req.json()
const projects = await projectRepository.findByTenant(tenantId)
```

## 5. Validation

### Zod Schemas
- All input validation with Zod
- Schemas in `lib/validation/` or colocated with models
- Validate on server for every mutation

```typescript
import { z } from 'zod'

export const createProjectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  images: z.array(z.string().url()).max(20).optional(),
})
```

### Server Action Validation
```typescript
export async function createProject(formData: FormData) {
  'use server'
  const data = createProjectSchema.parse(Object.fromEntries(formData))
  // ... proceed with validated data
}
```

## 6. Authentication & Authorization

### Better Auth
- All auth via Better Auth — no custom auth logic
- Session contains: `user.id`, `user.role`, `user.tenantId`
- Roles: `CUSTOMER`, `OWNER`

### Authorization Rules
- **CUSTOMER**: Can only access own tenant's data
- **OWNER**: Can access all tenants, platform management
- **Public**: Landing page, public tenant websites

### Protecting Routes
```typescript
// In Server Components
const session = await auth.api.getSession({ headers })
if (!session) redirect('/auth/signin')

// In Server Actions
const session = await auth.api.getSession({ headers })
if (!session) throw new Error('Unauthorized')

// In Route Handlers
const session = await auth.api.getSession({ headers })
if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
```

## 7. Multi-Tenancy

### Tenant Resolution
- Public sites: `gzora.com/s/{tenantSlug}` — resolve by slug
- Dashboard: tenant from session
- API: tenant from session

### Tenant Context
```typescript
// lib/tenant.ts
export async function getTenantContext() {
  const session = await auth.api.getSession({ headers })
  if (!session?.user.tenantId) throw new Error('No tenant')
  return {
    tenantId: session.user.tenantId,
    userId: session.user.id,
    role: session.user.role,
  }
}
```

### Data Isolation
- All tenant-scoped queries MUST filter by tenantId
- Indexes on tenantId for all tenant-scoped collections
- Compound indexes: `{ tenantId: 1, slug: 1 }` for tenant-scoped lookups

## 8. Media & File Storage

### S3 Storage
- All media stored in S3, not MongoDB
- MongoDB stores metadata: `{ key, url, size, mimeType, tenantId }`
- Use pre-signed URLs for uploads

### Image Optimization
- Use `next/image` for optimization
- S3 public base URL for source images
- Implement `loader` in `next.config.ts` for S3

### Media Repository
```typescript
// lib/repositories/media.ts
export async function uploadMedia(file: File, tenantId: string) {
  // 1. Generate unique key
  // 2. Upload to S3
  // 3. Save metadata to MongoDB
  // 4. Return media object
}
```

## 9. Error Handling

### Server Actions
```typescript
// Return errors as values, not throws
export async function createProject(prevState: any, formData: FormData) {
  const result = createProjectSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }
  // ... proceed
}
```

### Route Handlers
```typescript
export async function POST(request: Request) {
  try {
    // ... handle request
    return Response.json({ data })
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### Error Boundaries
- `error.tsx` for route-level error handling
- `global-error.tsx` for app-level errors
- Log errors to console in development, to logging service in production

## 10. TypeScript Conventions

### Strict Mode
- `strict: true` in tsconfig
- No `any` — use `unknown` and narrow
- Explicit return types on exported functions

### Type Definitions
```typescript
// models/types.ts
export interface IUser {
  _id: Types.ObjectId
  email: string
  name: string
  role: 'CUSTOMER' | 'OWNER'
  tenantId?: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}
```

### API Response Types
```typescript
// lib/api.ts
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: unknown }
```

## 11. Testing

### Unit Tests
- Vitest for unit tests
- Test repositories, services, utilities
- Mock MongoDB with `mongodb-memory-server`

### Integration Tests
- Test API endpoints with supertest
- Test Server Actions directly

### E2E Tests
- Playwright for critical user flows
- Test: signup → create site → publish → view public site

## 12. Prohibited Patterns

| Don't | Do Instead |
|-------|-----------|
| Query MongoDB in components | Use repositories |
| Trust client-provided tenantId | Derive from session |
| Store secrets in client code | Use server environment variables |
| Use `any` type | Use `unknown` and narrow |
| Skip validation | Always validate with Zod |
| Hardcode tenant logic | Use tenant context |
| Use `next lint` | Use ESLint directly |
| Use `middleware` | Use `proxy.ts` if needed |
| Use Pages Router | Use App Router |
| Use `getServerSideProps` | Use Server Components |

## 13. Git Workflow

- `main` branch — production-ready
- Feature branches: `feature/epic-milestone-task`
- Commit messages: `feat: add project creation flow`
- PR requires: passing build, passing tests, code review

## 14. Environment Variables

### Server-only (never expose to client)
- `MONGODB_URI`
- `BETTER_AUTH_SECRET`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `POLAR_ACCESS_TOKEN`

### Client-safe (prefix with `NEXT_PUBLIC_`)
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_S3_PUBLIC_BASE_URL`

### Rules
- Never commit `.env` files
- Use `.env.example` for documentation
- Validate env vars at startup
