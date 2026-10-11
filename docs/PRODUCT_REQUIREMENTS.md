# Product Requirements Document (PRD)

## Multi-Tenant Company Profile Website Builder

**Document status:** Initial product baseline
**Product stage:** MVP
**Target:** Production-ready release
**Product type:** Multi-tenant SaaS
**Languages:** Arabic and English

---

## 1. Product Vision

Build a simple SaaS platform that enables businesses in real estate, interior design, decoration, finishing, construction, and related industries to create and manage professional company profile websites without requiring programming skills.

Each customer creates one website using a predefined template. The website presents the company's information, services, capabilities, and completed projects in a professional and visually rich format.

Customers manage their website through a dashboard where they can update company information, edit website content, add or remove projects, upload or select project images, preview changes, and publish updates.

The platform's purpose is to help businesses present their work professionally and build an online presence.

**This is a company profile website platform, not a general-purpose visual website builder, ecommerce platform, or application builder.**

## 2. Target Users

Primary customers:

* Real estate companies and property businesses.
* Interior design and decoration companies.
* Finishing and contracting companies.
* Construction businesses.
* Other service businesses whose credibility depends on showcasing their work.

Primary user goal:

Create a professional company website, keep its content up to date, and showcase projects to potential customers.

## 3. MVP Product Principles

1. Simplicity over unnecessary functionality.
2. One customer account owns one website.
3. Reusable templates with customer-specific content.
4. All customer data must be isolated between tenants.
5. Website content must remain editable after creation and publication.
6. Editing must not require publishing first.
7. The public website must display the last successfully published version.
8. Arabic and English must be supported throughout the relevant product flows.
9. Templates must contain realistic, rich content and complete page structures rather than empty sections.
10. The MVP must be tested as a complete application before production release.

## 4. Core Domain Concepts

### 4.1 User

An authenticated customer who manages one company website.

### 4.2 Site

The customer's actual company website, including its company information, editable content, selected template, project portfolio, language configuration, and publication state.

A user can own **at most one Site**.

### 4.3 Template

A reusable design definition represented by a structured JSON-compatible object or the project's established equivalent.

A template defines page structure, sections, layout, visual settings, and content slots. It must not contain customer-specific persistent data shared across tenants.

### 4.4 Project (Portfolio Project)

A real-world project completed, designed, constructed, or managed by the customer's business.

Examples include a residential development, an apartment interior, a villa finishing project, or a commercial building.

Portfolio projects belong to a Site. They are not the same entity as the website creation workflow or the website itself.

### 4.5 Website Content

Editable information displayed on the website, including company details, About Us, services, capabilities, contact information, and other template-supported sections.

### 4.6 Publication

The public version of the Site made available to visitors.

Editing content and publishing content are separate operations.

The existing codebase must be inspected to determine the current persistence and publishing model. The implementation must support safe editing without unintentionally exposing unpublished changes.

## 5. Core User Journey

1. A visitor registers for an account or signs in.
2. The user opens the dashboard.
3. The user starts creating a website.
4. The system checks whether the user already owns a Site.
5. If no Site exists, the user enters company information and selects an available template.
6. The system creates the Site and initializes its editable content from the selected template and provided information.
7. The user opens the website editor or content management interface.
8. The user edits company information, text, services, features, images, and other supported content.
9. The user adds, edits, or deletes portfolio projects.
10. The user previews the website.
11. The user publishes the website when ready.
12. Visitors can access the published website.
13. The user can return to the dashboard, make further edits, preview them, and publish subsequent updates.

The user must not be forced to publish a Site before being allowed to edit it.

The system must not create duplicate Sites for the same user.

## 6. Functional Requirements

### FR-01: Authentication

The application must support the existing authentication system's registration and login flows.

* Authenticated users can access their own dashboard.
* Unauthenticated users cannot access protected management routes.
* Sessions and authorization must be validated on the server where appropriate.
* Authentication failures must be handled without exposing sensitive information.

Do not replace the existing authentication provider unless a verified technical requirement justifies it.

### FR-02: Dashboard and Site Lifecycle

The dashboard allows a user to:

* See whether a Site exists.
* Create a Site if none exists.
* Open and manage the existing Site.
* Access its content editor, project management, preview, and publishing controls.
* See its publication status.

Because each user can own at most one Site, the dashboard must not present a multi-site creation workflow.

If the Site already exists, creating another Site must be prevented both in the UI and through server-side enforcement.

### FR-03: Site Creation

Site creation must collect the information needed to generate a meaningful company profile website.

The initial form should support, as appropriate to the existing product:

* Company name.
* Business category.
* Company description.
* Logo or brand imagery.
* Contact information.
* Address or service location, when applicable.
* Company services.
* Company features, strengths, or capabilities.
* Relevant website language preferences.
* Template selection.

Required fields must be explicitly defined in validation rules. Do not make every field mandatory without a product reason.

The system must validate the input, initialize the Site's editable content, associate the Site with the authenticated user, and provide a clear success or error state.

Site creation must not depend on publishing the Site.

### FR-04: Website Templates

The platform must include and improve the two existing templates rather than assuming new templates are required.

Inspect both existing templates and their rendering implementations.

Each template must:

* Have a coherent visual identity and consistent layout.
* Use reusable, structured content and section definitions.
* Render real, meaningful page content.
* Support Arabic and English.
* Support responsive layouts for mobile, tablet, and desktop.
* Use consistent typography, spacing, imagery, and iconography.
* Render correctly when optional content is missing.
* Avoid broken images, empty sections, placeholder text, and misleading company claims.

A template must be reusable across different companies. Customer-specific content must be stored separately from the shared template definition.

### FR-05: Required Website Pages and Sections

The templates must provide a sufficiently complete company profile experience.

The exact page structure may vary by template, but the MVP should support the following page types or their equivalent:

* Home.
* About Us / Company Profile.
* Services / What We Do.
* Projects / Portfolio.
* Project Details.
* Contact Us.

The Home page should include a rich combination of relevant sections, such as:

* Hero section with a clear company identity and strong imagery.
* Company introduction.
* Services or areas of expertise.
* Featured projects.
* Company capabilities or differentiators.
* Project statistics or company facts, when real data is available.
* Work process or service approach.
* A call to action.
* Contact information or a contact section.

The About page should support a meaningful company story, overview, capabilities, and mission or vision where appropriate.

The Services page should support multiple services with descriptions and suitable imagery or icons.

The Projects page should display a portfolio of customer-managed projects.

The Project Details page should present an individual project's title, description, images, category, location, and other supported information.

The Contact page should display configured contact information and supported contact actions.

Not every section must appear on every template. Sections must serve a clear purpose, and the overall page must feel complete rather than consisting of only a few generic blocks.

Do not invent customer achievements, certifications, project counts, years of experience, or other factual claims. Use editable sample content only where clearly identified as sample content, and do not present it as a customer's real achievements.

### FR-06: Website Content Editing

A customer must be able to edit the content of their existing Site after creation and after publication.

At minimum, editing must cover the supported fields for:

* Company name and description.
* About Us content.
* Services.
* Company features and capabilities.
* Contact information.
* Text displayed in supported template sections.
* Images and image references.
* Other customer-editable fields defined by the selected template.

The editor must load the current saved content, validate changes, save them reliably, and show success or error feedback.

The editing interface must not modify the shared template definition when a customer changes their content.

A user must not need to recreate the Site to edit its content.

A user must not need to publish the Site before editing it.

### FR-07: Portfolio Project Management

The Site owner must be able to create, view, edit, and delete portfolio projects.

A project should support fields such as:

* Title.
* Description.
* Project category.
* Location, when relevant.
* Cover image.
* Additional images or gallery.
* Optional project-specific metadata supported by the template.
* Arabic and English content where the bilingual project experience requires it.

The dashboard must provide clear project management controls.

Validation must prevent invalid data from breaking public pages.

Deletion must be authorized and must affect only the relevant customer's project.

Changes must be reflected in the appropriate public website version according to the publication model.

### FR-08: Image Management and Pexels Integration

The project already has, or is expected to have, an image integration associated with Pexels. Verify the existing provider, package, configuration, and actual implementation before making changes.

Use the existing integration when available to improve template imagery, including hero backgrounds, service illustrations, and appropriate supporting images.

Requirements:

* Prefer high-quality images relevant to the selected business category.
* Use images that match the surrounding content and design.
* Use a consistent image treatment and aspect ratio within each section.
* Provide meaningful alternative text where appropriate.
* Handle failed image loads gracefully.
* Avoid making successful site generation dependent on an optional image search service.
* Respect provider requirements, attribution rules, API limits, and applicable usage terms.
* Never expose API credentials in client-side code or documentation.
* Do not claim a project image represents an actual customer project unless it does.

Pexels or another configured image service may supply illustrative imagery, but customer project images and illustrative template imagery must remain distinguishable.

### FR-09: Publication and Updates

The application must separate editable content from the publicly published version when required by the current architecture.

Expected behavior:

* A newly created Site can be edited before its first publication.
* A Site owner can preview unpublished changes.
* Publishing makes the current validated version available publicly.
* Editing a published Site must not automatically expose unfinished changes.
* The existing published version remains available while subsequent edits are in progress, if the architecture supports separate published snapshots.
* Publishing an update refreshes the public website.
* Failed publishing must not falsely report success.
* Public routes must render the correct Site and published content.

Inspect the existing implementation before deciding whether to use explicit draft documents, snapshots, version identifiers, or another suitable persistence strategy. Select the simplest reliable design consistent with the current architecture.

### FR-10: Arabic and English

The product and generated websites must support Arabic and English.

This includes:

* Dashboard and management interfaces.
* Site creation and content editing.
* Public website pages and sections.
* Template content.
* Services and portfolio projects.
* Navigation, labels, buttons, and relevant system messages.
* Form validation and error states.

Requirements:

* Arabic pages use the correct right-to-left direction.
* English pages use the correct left-to-right direction.
* Layout, navigation, spacing, typography, and alignment must work in both directions.
* Language switching must preserve the correct Site and route context.
* Customer-editable text must not be overwritten when changing language.
* Missing translations must have a defined, consistent fallback policy.
* Language-specific content must be modeled explicitly rather than inferred from text direction alone.

Follow the existing internationalization architecture and routing conventions.

### FR-11: Public Website Access

Each published Site must have a stable public route using the existing routing model.

The system must:

* Resolve the correct Site.
* Verify that the Site is published before presenting it as a public website.
* Render the correct template and published content.
* Support Arabic and English routes or language switching according to the existing routing design.
* Handle missing, deleted, and unpublished Sites gracefully.
* Prevent one tenant's data from being rendered on another tenant's website.

Do not introduce custom domains, a new subdomain architecture, or a new routing scheme unless already required by the project.

### FR-12: Persistence and Data Integrity

Persist customer-owned Site data and portfolio projects using the existing MongoDB architecture.

Use stable identifiers and explicit ownership relationships.

At minimum:

* Each Site belongs to one authenticated user.
* A user can own at most one Site.
* Portfolio projects belong to a specific Site.
* Site content, project data, and publication data are scoped to the correct tenant.
* Updates and deletions validate ownership server-side.
* The database must enforce the one-Site-per-user invariant using an appropriate unique constraint or index and safe creation logic.
* Concurrent creation attempts must not produce duplicate Sites.
* Data must survive page refreshes and new sessions when persistence is expected.
* Shared templates must not store mutable customer-specific content.

The implementation must follow the existing MongoDB and data-access conventions.

### FR-13: Multi-Tenant Security

The application is multi-tenant.

The authenticated user's identity is the basis for accessing owned resources.

For every protected operation:

* Validate the user's session or trusted server-side identity.
* Load the resource using an ownership-aware query or validate its ownership explicitly.
* Never trust a client-supplied `userId` as proof of authorization.
* Prevent cross-tenant reads, edits, and deletions.
* Apply the same ownership rules to Site creation, content editing, project management, and publishing.
* Avoid leaking sensitive information through error messages.

Use the actual authentication and database architecture. Do not introduce unnecessary tenant abstractions if user ownership already provides the required model.

### FR-14: User Experience and Visual Quality

The product must feel complete, consistent, and usable.

The dashboard and public templates must:

* Have clear loading, empty, success, and error states.
* Avoid dead buttons and nonfunctional controls.
* Provide clear navigation between Site management tasks.
* Have responsive layouts.
* Use consistent design tokens and visual patterns.
* Include accessible labels, keyboard navigation, and suitable contrast.
* Use the existing `lucide-react` icon library consistently.
* Avoid oversized dependencies or unnecessary UI abstractions.
* Provide a meaningful experience when optional fields or images are absent.

### FR-15: Reliability and Production Readiness

The MVP must be deployable using the project's existing production architecture.

Required quality expectations include:

* Reproducible build and configuration.
* Correct environment variable handling.
* Server-side validation and authorization.
* Reliable database operations.
* Appropriate API error handling.
* No unhandled critical runtime failures in the tested flows.
* No known critical cross-tenant access vulnerabilities.
* Regression tests for critical business rules.
* A verified production build.
* Documented deployment prerequisites and remaining operational limitations.

Do not claim the application is production-ready solely because it builds successfully.

## 7. Data Model Requirements

The following is a logical model, not a mandatory database schema. Inspect the current MongoDB models and reuse appropriate existing structures.

### User

Represents an authenticated customer.

### Site

Expected logical properties include:

* Stable Site ID.
* Owner User ID.
* Selected template identifier.
* Site status.
* Editable company and website content.
* Supported language configuration.
* Draft or publication metadata, where applicable.
* Creation and update timestamps.

### Portfolio Project

Expected logical properties include:

* Stable project ID.
* Owning Site ID.
* Title and description.
* Category and optional metadata.
* Image references.
* Language-specific fields where required.
* Creation and update timestamps.

### Template Definition

Expected properties include:

* Stable template identifier.
* Template metadata.
* Page and section structure.
* Default content or content schema.
* Layout and visual configuration.
* Supported languages.

The template definition is reusable and must not be modified by ordinary customer content updates.

### Publication Data

Use the simplest suitable representation for the current architecture.

If draft and published content are stored separately, define how they remain consistent with the editable Site and how publishing updates the public version atomically or safely.

Document the selected model and its rationale before implementing significant persistence changes.

## 8. MVP Scope

### Included

* Existing authentication flow.
* One Site per user.
* Site creation using existing templates.
* Company information and content management.
* Portfolio project create, edit, and delete.
* Rich, reusable company profile templates.
* Arabic and English support.
* Template imagery using the configured image integration.
* Site preview and publishing.
* Editing and publishing subsequent updates.
* MongoDB persistence.
* Multi-tenant ownership enforcement.
* Critical automated tests and end-to-end verification.
* Production build and deployment readiness checks.

### Excluded Unless Already Required

* Multiple Sites per user.
* Ecommerce, payments, shopping carts, and inventory.
* A general-purpose drag-and-drop visual page builder.
* Arbitrary user-defined page layouts.
* Custom domains and a new domain-routing architecture.
* Complex team collaboration and role management.
* Advanced analytics or marketing automation.
* A new billing or subscription system.

Do not expand the MVP without documenting the reason, impact, and required approval.

## 9. Nonfunctional Requirements

### Maintainability

Follow the existing project architecture and `CODE_RULES.md`. Keep the implementation simple, modular where useful, and easy for future AI agents to understand.

### Performance

Avoid unnecessary database queries, repeated template processing, excessive image loading, and avoidable client-side JavaScript. Verify performance issues before adding caching or optimization layers.

### Security

Enforce authentication, ownership, input validation, safe error handling, and appropriate secret management.

### Accessibility

Provide semantic page structures, usable forms, keyboard-accessible controls, meaningful image alternatives, and appropriate contrast.

### Reliability

Critical workflows must handle network failures, invalid responses, persistence failures, and incomplete user input without corrupting data or falsely reporting success.

## 10. Product Acceptance Criteria

The MVP is accepted only when all mandatory criteria below are verified.

### PA-01: Account and Ownership

A user can register, log in, and access their own dashboard. Attempts to access another user's private resources are denied.

### PA-02: One Site per User

A user can create one Site. Further creation attempts are rejected safely, including concurrent attempts.

### PA-03: Site Creation

A user can enter company information, select an available template, create a Site, and open its editing interface without being required to publish first.

### PA-04: Content Editing

A user can edit and save supported company content, revisit the editor, and see the saved values.

### PA-05: Portfolio Management

A user can add, edit, and delete portfolio projects. Changes are persisted and isolated to the owning Site.

### PA-06: Template Quality

Both existing templates render complete, coherent, responsive company profile experiences with meaningful sections and suitable imagery rather than nearly empty pages.

### PA-07: Bilingual Experience

The dashboard and public website support Arabic and English with correct language-specific content and RTL/LTR layout.

### PA-08: Publication

A user can preview a Site, publish it, edit it later, and publish updates. Public visitors see the appropriate published version.

### PA-09: API and Data Integrity

Critical API contracts, persistence behavior, validation, and error handling are covered by relevant tests.

### PA-10: Production Readiness

The production build passes, critical user journeys are tested, and no known critical security or data-isolation defect remains unresolved.

Any acceptance criterion that cannot be verified must be explicitly reported as blocked or unverified. Do not silently waive mandatory requirements.

## 11. Technical Constraints

* Inspect and preserve the existing Next.js architecture and established project conventions.
* Use the existing MongoDB integration and data-access patterns.
* Use the existing authentication implementation unless a verified blocker requires change.
* Keep templates represented as reusable JSON-compatible definitions or the project's existing equivalent.
* Use the existing `lucide-react` icon library.
* Inspect and reuse the existing Pexels integration if present and configured.
* Preserve existing routing and internationalization conventions unless a documented decision justifies changing them.
* Read and comply with `AGENTS.md` and `CODE_RULES.md`.
* Do not introduce unnecessary dependencies, services, or architectural complexity.

## 12. Open Technical Decisions

Resolve these through repository inspection and documented decisions rather than assumptions:

* Exact Site, Project, and Template schema.
* Existing public URL and language-routing strategy.
* Current draft and published data model.
* Current image storage and image-provider integration.
* Template section schema and rendering mechanism.
* Existing caching and publication invalidation strategy.
* Current test framework and browser automation capabilities.
* Deployment configuration and required environment variables.

## 13. Definition of Product Success

The MVP succeeds when a business owner can independently register, create a professional company profile website, edit its content, manage its portfolio, preview it, publish it, and update it later in Arabic or English.

The platform must enforce one Site per user, isolate tenant data, render both existing templates as complete websites, and pass the required production-readiness checks.

**This document defines the intended product behavior. Architecture and implementation decisions must be verified against the existing repository and documented separately.**



