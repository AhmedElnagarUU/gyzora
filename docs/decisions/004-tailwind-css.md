# ADR 004: Tailwind CSS v4

## Status
Accepted

## Context
Gzora needs a utility-first CSS framework for rapid UI development with design system consistency.

## Decision
Use Tailwind CSS v4 with the new PostCSS plugin.

## Consequences

### Positive
- Utility-first enables rapid prototyping
- v4 is faster with better performance
- No config file needed (CSS-first configuration)
- Excellent TypeScript support
- Small production bundle with PurgeCSS

### Negative
- Utility classes can be verbose
- Learning curve for new developers
- Requires discipline to maintain consistency

## Alternatives Considered
- **CSS Modules**: More verbose, no design system
- **Styled Components**: Runtime overhead, SSR complexity
- **shadcn/ui**: Built on Tailwind, but adds abstraction layer
