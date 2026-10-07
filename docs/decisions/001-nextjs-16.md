# ADR 001: Next.js 16 with App Router

## Status
Accepted

## Context
Gzora needs a modern React framework with server-side rendering, API routes, and excellent developer experience.

## Decision
Use Next.js 16 with App Router, Turbopack, and Server Components.

## Consequences

### Positive
- Server Components reduce client JavaScript
- Built-in API routes via Route Handlers
- Turbopack for fast development and builds
- Excellent TypeScript support
- Image optimization built-in

### Negative
- Next.js 16 has breaking changes from v15
- Turbopack may have edge cases with custom configs
- Learning curve for Server/Client component boundaries

## Alternatives Considered
- **Remix**: Less mature ecosystem, smaller community
- **Astro**: Not ideal for dynamic, interactive dashboards
- **Custom Express + React**: Too much boilerplate, no SSR benefits
