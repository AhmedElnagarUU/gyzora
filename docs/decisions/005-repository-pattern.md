# ADR 005: Repository Pattern for Data Access

## Status
Accepted

## Context
Gzora needs consistent, testable, and secure data access across the application with enforced tenant isolation.

## Decision
Use the Repository pattern — all database queries go through repository functions in `lib/repositories/`.

## Consequences

### Positive
- Centralized data access logic
- Enforced tenant isolation in one place
- Easy to test (mock repositories)
- Swappable implementations (e.g., for caching)
- Clear separation of concerns

### Negative
- Additional abstraction layer
- May feel like over-engineering for simple queries
- Requires discipline to maintain

## Alternatives Considered
- **Direct Mongoose in components**: Violates separation of concerns, hard to test
- **Service layer only**: Services would need to know MongoDB details
- **Prisma**: Different abstraction model, less control over queries
