# Test Strategy

How the recovery verifies correctness and production readiness. Binds EPIC-009
and provides the definition of "tested" referenced by every milestone. Grounded
in DEC-007, FR-15, PA-09, PA-10, and `CODE_RULES.md` §11.

## 1. Current state (verified)

- No test framework installed (no `vitest`/`@playwright`/`jest`).
- No `test` script in `package.json`.
- Correctness today rests on `npm run typecheck`, `npm run lint`,
  `npm run build` — **build-time only**, which FR-15 explicitly says is not
  production readiness.
- No running MongoDB was available during the audit, so runtime behavior is
  **unverified** (DIAGNOSIS U-01).

## 2. Tooling (target, DEC-007)

| Layer | Tool | Notes |
|---|---|---|
| Unit / integration | **Vitest** | ESM-native, fast |
| Test DB | **mongodb-memory-server** | preferred; `TEST_MONGODB_URI` fallback for CI without download |
| E2E | **Playwright** | chromium at minimum |
| Assertions | Vitest `expect` | |
| Coverage | optional | not a gate; focus on required cases |

### npm scripts (to add in M-025)

| Script | Command | Purpose |
|---|---|---|
| `test` | `vitest run` | CI single pass |
| `test:watch` | `vitest` | local development |
| `test:e2e` | `playwright test` | browser journeys |
| `test:e2e:ui` | `playwright test --ui` | optional local debugging |

`package.json` must also expose `typecheck`, `lint`, `build` (already present).

## 3. Test pyramid & placement

```
        E2E (Playwright)         few, critical journeys     e2e/
   Integration (Vitest + DB)     API + service + repo        features/**/*.test.ts
   Unit (Vitest, pure)           fallback, clone, schemas    shared/**, features/**
```

- Co-locate unit/integration tests as `*.test.ts` next to the module under test
  (or under `features/<f>/__tests__/`).
- E2E specs live in `e2e/`. Each spec creates its own tenant/user data and cleans
  up, or uses an isolated test database.

## 4. What must be tested (mandatory)

### 4.1 Tenant isolation (every tenant-scoped feature)
For **sites, projects, media, tracking, users**: an authenticated tenant cannot
read, update, or delete another tenant's resource; the attempt returns the
correct status (403/404) and leaks nothing. One test per feature (CODE_RULES §11).

### 4.2 One-Site-per-user (FR-12, PA-02)
- Creating a second site is rejected with `ONE_SITE_LIMIT` (409).
- **Concurrent** creation attempts (two parallel calls) create **exactly one**
  site — verifies the unique index + duplicate-key handling.
- The unique index exists on `ownerUserId` and `tenantId` (assert via index
  introspection).

### 4.3 Publish snapshot isolation (FR-09, PA-08, DEC-004)
- Editing draft content after publish does **not** change the public render.
- Publish writes a snapshot; public reads only the snapshot and only when
  `status === 'PUBLISHED'`.
- Unpublish hides the public site.
- A failed publish writes nothing and returns failure (no false success).

### 4.4 Data model / schema
- Zod schemas reject invalid input (required fields, enum values, URL shapes).
- `LocalizedText` fallback resolution (`ar`→`en`→omit).
- `cloneTemplateContent` deep-copies (mutating the clone does not affect the
  template definition).

### 4.5 API contract (M-026)
- Every endpoint returns `{ success, data }` or `{ success, error }`.
- Status mapping: 400/401/403/404/409/422/500.
- `route.ts` files are thin re-exports (static check: no logic).

### 4.6 Localization (FR-10, PA-07)
- Catalog parity: every `en` key exists in `ar`.
- `dir`/`lang` correct for `en`/`ar` on public + dashboard wrappers.
- Public site renders localized content for both locales; language switch
  preserves the site.
- Customer text is not overwritten when switching language.

### 4.7 Template quality (FR-04/05, PA-06)
- Both templates render the six required pages.
- No placeholder strings (`Property Name`, lorem, "coming soon") in rendered
  output.
- Missing optional content renders without error.

### 4.8 Auth
- Unauthenticated access to protected routes is denied (redirect/401).
- Role gates: non-OWNER cannot reach owner/admin routes.

## 5. E2E critical journeys (M-027, Playwright)

1. **Signup → dashboard:** register, land on dashboard, no site yet.
2. **Create site:** enter company info, pick a template, create, land in editor.
3. **Edit content:** change company/about/services, save, reload, values persist.
4. **Projects:** create, edit, reorder, delete; isolation from another tenant.
5. **Preview:** owner sees draft changes; not publicly accessible.
6. **Publish:** publish, visit `/s/<slug>`, see snapshot; edit again and confirm
   public is unchanged until re-publish.
7. **Language:** switch EN↔AR on dashboard and public site; verify direction and
   content.
8. **Both templates:** repeat create/publish for `real-estate` and `construction`.

## 6. Environment

- Tests must not require production credentials. `mongodb-memory-server` for DB.
- External services (S3, Pexels, Polar) are **stubbed or feature-flagged** in
  tests; never call live paid services from CI.
- `.env.test` (gitignored) may hold `TEST_MONGODB_URI`; `.env.example` documents
  required test vars.
- E2E runs against a locally started app (`npm run dev` or `next start` on a
  built app) with a test database.

## 7. CI gates (target)

A change is mergeable only if all pass:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`
4. `npm test` (unit + integration)
5. `npm run test:e2e` (critical journeys)

## 8. Definition of "tested" per milestone

A milestone may be marked complete only when:

- Its acceptance criteria have executable evidence (a named test, a command
  output, or a manual verification record with steps + result).
- New behavior has tests at the appropriate pyramid level.
- No previously passing test is broken.

## 9. Honesty rules

- Tests must exercise **real** code paths. Do not mock the unit under test into
  passing, and never replace a real integration with a fake to make a test green
  (`AGENTS.md` §14).
- Untested behavior (e.g. requires a live DB/credential) is reported as
  **blocked/unverified**, not as passing (`AGENTS.md` §13, FR-15 note).
- Coverage is not a goal in itself; the required cases above are.

## 10. Mapping to milestones

| Area | Milestone |
|---|---|
| Tooling baseline + domain/isolation tests | M-025 |
| API contract + publishing tests | M-026 |
| Playwright E2E (EN/AR) | M-027 |
| Production build/deploy readiness + final traceability | M-028 |

See also: `reports/TRACEABILITY.md`, `reports/DIAGNOSIS.md`,
`TECHNICAL_DECISIONS.md` DEC-007.
