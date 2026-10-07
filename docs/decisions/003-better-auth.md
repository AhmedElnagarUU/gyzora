# ADR 003: Better Auth

## Status
Accepted

## Context
Gzora needs authentication with role-based access control, session management, and extensibility for OAuth providers.

## Decision
Use Better Auth as the authentication library.

## Consequences

### Positive
- Framework-agnostic, works with Next.js
- Built-in session management
- Extensible plugin architecture
- TypeScript-first
- Supports OAuth, email/password, and more

### Negative
- Smaller community than NextAuth.js
- Documentation still maturing
- May need custom extensions for complex RBAC

## Alternatives Considered
- **NextAuth.js**: More mature, but heavier and less flexible
- **Clerk**: Excellent UX, but vendor lock-in and pricing
- **Custom auth**: Too much maintenance burden
