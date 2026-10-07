# ADR 002: MongoDB with Mongoose

## Status
Accepted

## Context
Gzora needs a flexible, scalable database for multi-tenant data with varying schemas (projects, media, themes).

## Decision
Use MongoDB with Mongoose ODM.

## Consequences

### Positive
- Flexible schema for different template structures
- Mongoose provides validation, middleware, TypeScript support
- Easy horizontal scaling with sharding
- Rich query language for complex filters

### Negative
- MongoDB requires careful index planning
- Mongoose adds overhead vs raw driver
- No joins (must use aggregation or denormalization)

## Alternatives Considered
- **PostgreSQL + Prisma**: Stronger relational integrity, but less flexible for template-driven content
- **DynamoDB**: AWS-specific, less flexible querying
- **Firebase**: Vendor lock-in, limited query capabilities
