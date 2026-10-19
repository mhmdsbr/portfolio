# Development guide

Practical recipes for extending this portfolio without bypassing its existing
architecture. Examples use skills because they already have an admin editor,
repository, public read model and animated public component.

## Contents

- [Local development](#1-local-development)
- [Architecture and import boundaries](#2-architecture-and-import-boundaries)
- [Adding a public component](#3-adding-a-public-component)
- [Adding an animation](#4-adding-an-animation)
- [Adding an admin page or editor](#5-adding-an-admin-page-or-editor)
- [Adding or changing an input](#6-adding-or-changing-an-input)
- [Adding a new public page section](#7-adding-a-new-public-page-section)
- [Adding a repository or service](#8-adding-a-repository-or-service)
- [Database changes and operational scripts](#9-database-changes-and-operational-scripts)
- [Validation and review checklist](#10-validation-and-review-checklist)

## 1. Local development

The current application uses Next.js App Router, React, TypeScript, Tailwind,
Drizzle/PostgreSQL, GSAP and Lenis. The older React/WordPress description at the
top of the README is not the architecture of the current application.

1. Install dependencies using `npm ci` when setting up a checkout with its lockfile.
2. Configure `DB_URL_LOCAL` in your local `.env`; never commit credentials.
3. Apply the schema to your intended development database with `npm run db:push`.
4. Optionally run `npm run db:seed` to populate sample portfolio content.
5. Configure server-only SMTP variables before creating an admin:
   `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`.
6. Run `npm run dev`, then open `/admin/login`. With no admin accounts it redirects
   to the one-time signup page.

An empty **content** database is supported by the admin: section services create
missing `page_sections` rows idempotently. This does not create sample content
or admin accounts, and does not replace applying the database schema.

Before changing Next.js APIs or routing behavior, read the relevant guide in
`node_modules/next/dist/docs/`. The installed version may differ from examples
found online. Follow the repository's [AGENTS.md](../AGENTS.md).

## 2. Architecture and import boundaries

```text
Public read:
  Server Component page -> public-content service -> repositories -> database
                       -> typed props -> public UI

Admin read:
  Server Component page -> authenticated action -> service -> repositories
                       -> typed props -> admin form

Admin write:
  Client form -> Server Action -> authenticate + parse/validate
              -> service -> repositories -> database
              -> revalidate affected admin paths -> UI refresh
```

| Location | Responsibility |
|---|---|
| [src/app](../src/app) | Routes, layouts, Server Components, initial data loading. |
| [Public components](../src/client/components/public) | Presentation from props; atoms, molecules, organisms and layouts. |
| [Admin components](../src/client/components/admin) | Forms, editing state, navigation and action feedback. |
| [Client hooks](../src/client/hooks) | Reusable client behavior, including animations and CRUD state. |
| [Server Actions](../src/server/actions/admin) | Authentication, parsing untrusted input, invoking services, revalidation. |
| [Schemas](../src/server/schemas) | Zod validation and normalization of action input. |
| [Services](../src/server/services) | Business rules, read-model assembly and transaction orchestration. |
| [Repositories](../src/server/repos) | Database queries and persistence helpers. |
| [Database schema](../src/server/db/schema.ts) | Tables, indexes, constraints and database row types. |
| [Shared code](../src/shared) | Environment-safe constants and types shared across boundaries. |

Follow the import rules in [eslint.config.mjs](../eslint.config.mjs):

- Client code may import Server Actions, but not server services, repositories,
  schemas, auth helpers or the database client.
- Public/common UI must not depend on admin actions or admin components.
- Shared code must not depend on client or server modules.
- Server code must not depend on client modules.
- Database client imports belong in repositories and permitted setup/tooling code.
  Services use the executor helper rather than importing the client.

Pages/layouts are Server Components by default. Use `"use client"` when a
component needs state, event handlers, browser APIs or client hooks. Keep data
loading on the server and pass only appropriate client-visible props.

## 3. Adding a public component

### A. Reuse the right level

- **Atom:** small reusable visual element such as a badge or heading.
- **Molecule:** composition such as a shared section layout.
- **Organism:** a portfolio section such as Skills or Projects.
- **Layout:** page-level composition.

Search for existing components before introducing a new variant or abstraction.
Use existing typography, spacing and component conventions.

### B. Wire data from the server

1. Define/update the public response type in
   [public-content types](../src/shared/types/public-content.ts).
2. Add the repository read if needed, then map database fields into that response
   in [public-content.ts](../src/server/services/public-content.ts).
3. Include the payload in `getPublicAll()` when it belongs on the home page.
4. Pass that payload to the component from [the home page](../src/app/page.tsx).
5. Render an intentional empty state; do not assume seeded rows exist.

Do not fetch admin endpoints from a public component or pass complete database
rows when the component only needs a small public projection.

`getPublicAll()` fetches shared section metadata, contact methods and site settings
once per call, alongside independent content reads. Reuse its mapping helpers when
extending a response rather than re-fetching shared data. Project detail and
category pages use `getPublicHeader()` instead of fetching the whole homepage
payload for navigation. Unused standalone section loaders have been removed.
Keep new loaders focused, and do not introduce cross-request caching without
defining an invalidation policy.

### C. Existing example: Skills

Trace:

1. `skillRepo.list()` reads ordered rows.
2. `getPublicAll()` uses `mapExperience()` to map them to `{ skill, level }`.
3. The home page renders `<Skills skills={data.experience.skills} />` inside the
   experience renderer.
4. [Skills](../src/client/components/public/organisms/skills/skills.tsx) renders
   badges or the empty state.

Skills is a component within the existing **experience** page section, not a
separate `SectionKind`. Adding a component to an existing section does not require
a new database section kind.

For remote images rendered with Next Image, check the permitted hosts in
[next.config.ts](../next.config.ts). Add only the intended host/path pattern.

## 4. Adding an animation

Keep animation logic in [hooks/animations](../src/client/hooks/animations), not
embedded in the section's rendering code.

1. Create a named `use...Animation` or `use...Animations` hook.
2. Pass element refs from the component rather than querying the whole document.
3. Scope selectors and GSAP context to the section.
4. Respect `prefers-reduced-motion`; content must remain visible without animation.
5. Clean up ScrollTriggers, tweens, event listeners and animation frames on unmount.
6. If targets can change after mounting, explicitly handle those dependencies and
   revert old animations before rebuilding them.
7. Keep markup, data loading and animation responsibilities separate.

Use [useSkillsAnimations](../src/client/hooks/animations/useSkillsAnimations.ts)
as the example for scoped `useGSAP`, rain animation and pointer interaction.
Its component retains the ref and calls the hook.

Lenis is used for page scrolling. Nested native scroll areas, such as an admin
list, should use `data-lenis-prevent`; the shared CRUD list already handles this.
Check existing behavior before adding a second scroll controller.

Verify mouse/pen behavior, reduced motion, touch scrolling, scrolling backward,
resizing, and navigation away/back. For pinned animations, also check neighboring
sections and ScrollTrigger refresh behavior.

## 5. Adding an admin page or editor

An admin page is not automatically a new public page section.

### A. Add the backend first

1. Add a Zod schema in [schemas](../src/server/schemas).
2. Reuse or add repository methods.
3. Add a service for the feature's rules and data loading.
4. Add authenticated Server Actions under [actions/admin](../src/server/actions/admin).
5. Use `requireAuth()` for reads and `withAuthAction()` for the standard content
   mutation pattern. Do not rely only on the admin layout guard.
6. Parse IDs and form values on the server; HTML `required`, `min` and `max` are
   UX aids, not authorization or validation.
7. Revalidate all affected admin pages after a successful mutation.

Example from the existing skill-creation action:

```ts
export async function createSkill(formData: FormData) {
  return withAuthAction(async () => {
    const row = await service.createSkill(parseForm(skillSchema, formData));
    revalidateContent("/admin/experience");
    return row;
  })();
}
```

The containing action module uses `"use server"`. Reuse the imports and structure
in [experience actions](../src/server/actions/admin/experience.ts).
The action returns an `ActionResult`; the UI must check `success` before treating
the operation as successful. Authentication flows have their own established
result shapes; do not change them incidentally.

### B. Add the route and UI

1. Create `src/app/admin/<feature>/page.tsx` as a Server Component.
2. Load data through the authenticated action.
3. Pass props to the client form in `src/client/components/admin/forms/<feature>/`.
4. Add UI prop types using the neighboring form's conventions.
5. Add a navigation entry in [AdminSidebar](../src/client/components/admin/AdminSidebar.tsx).
6. Include section presentation controls only when the editor manages a
   `page_sections` section.

See [the experience admin page](../src/app/admin/experience/page.tsx) for composition
of multiple editors within one page.

### C. Reuse the list editor

For an ordered CRUD list, use
[useCrudList](../src/client/hooks/crudList/index.ts) and
[SortableCrudList](../src/client/components/admin/crud/SortableCrudList.tsx).

The hook expects `create`, `update`, `remove` and `reorder` actions. It handles
editing state, feedback, refresh and reverting a failed optimistic reorder.

Follow [SkillsForm](../src/client/components/admin/forms/experience/SkillsForm.tsx):
provide create fields, edit fields and item rendering. Keep field names aligned
with the Zod schema. Give drag-and-drop lists unique `droppableId` values.

For a page containing independent forms, follow
[ProfileSettingsForm](../src/client/components/admin/forms/profile-settings/ProfileSettingsForm.tsx):
keep the page component as a composition of focused panels, with each panel owning
its state, submission handlers and feedback. Keep shared field styling in one
local module rather than duplicating it. Do not reset one form's pending
verification when another form saves or refreshes.

## 6. Adding or changing an input

Trace the field through every layer, not just the form:

```text
Database column or section config
  -> input schema -> action -> service -> repository write
  -> admin read/prop types -> create and edit inputs
  -> public response mapping -> public component
  -> seed data / documentation / validation
```

### A. Table-backed field

1. Add/change the column and constraints in the Drizzle schema.
2. Generate and inspect the database migration when SQL changes are required.
3. Update the feature's Zod schema and inferred input type.
4. Check service destructuring and repository projections; a new field can be
   accidentally dropped even when it is present in `FormData`.
5. Add the field to **both create and edit** forms with the correct `name`.
6. Update form prop types, public response types/mappings, and rendering if exposed.
7. Update seed values and database documentation.

### B. Optional inputs

Reuse [schema helpers](../src/server/schemas/common.ts):

| Input | Helper |
|---|---|
| Required text | `requiredText(label)` |
| Optional text | `optionalText` |
| Optional integer | `optionalInteger(label, bounds)` |
| Required integer | `requiredInteger(label, bounds)` |
| URL/path | `optionalUrl(label, kind)` |
| Positive item ID | `positiveId` |
| Unique ordered IDs | `idListSchema` |

If an input becomes optional:

- Allow `NULL` in SQL when that is its storage representation.
- Normalize empty strings to `null` using the appropriate helper.
- Carry `number | null` or `string | null` through relevant types.
- Remove HTML `required` in both create and edit fields.
- Use `value ?? ""` for an optional numeric input, rather than `value || ""`,
  so a valid zero is preserved.
- Distinguish zero, blank and invalid values in the public display.
- Apply the schema change to every deployed database; a code change alone does
  not remove a production `NOT NULL` constraint.

### C. Section-specific settings in JSON config

For a setting belonging to an existing section:

1. Add the typed field to [SectionConfigMap](../src/shared/types/section-config.ts).
2. Add its default to `SECTION_CONFIG_DEFAULTS` in
   [constants](../src/shared/constants.ts).
3. Update the action's input schema, settings form and service payload.
4. Use `updateSectionConfig()` and map the setting into the public response.
5. Update seed config when appropriate.

**Important:** [readSectionConfig](../src/server/helpers/section-config.ts)
currently normalizes default keys to nonempty strings or `null`. It is not a
generic validator for booleans, numbers, arrays or nested objects. Extend its
typed normalization deliberately before adding those kinds of config fields.

`updateSectionConfig()` replaces the entire config. A partial settings form must
preserve unrelated fields explicitly rather than unintentionally resetting them.
Adding a JSON key alone usually needs no SQL column migration, but still needs
defaults, validation, compatible readers and suitable handling of existing data.

## 7. Adding a new public page section

Only follow this recipe when the feature needs its own layout ordering,
navigation title and visibility toggle.

1. Add its kind to `SECTION_KINDS` in shared constants. `SectionKind` is derived
   from that list.
2. Add the corresponding `SectionConfigMap` entry, config defaults and
   `SECTION_DEFAULT_NAVIGATION_TITLES` entry.
3. Update config normalization if the new settings require new value types.
4. Generate/apply the database change: the allowed section kinds also drive the
   `page_sections` SQL CHECK constraint.
5. Implement persistence, schemas, admin services/actions and editor as needed.
   Use `requireSection(kind)` for admin loading rather than assuming a seeded row.
6. Add public response types, the public loader and the `getPublicAll()` payload.
7. Add the component and its entry to the home page's typed `sectionRenderers`.
8. Add the admin route/sidebar entry if it has a dedicated editor.
9. Add seed metadata and any associated content.
10. Verify header navigation, page-layout listing, enable/disable and reorder.

The admin's `insertMissingSections()` derives its insert list from `SECTION_KINDS`.
Existing rows are preserved. Public reads remain read-only and tolerate missing
rows; opening the public site does not initialize section records.

If contact methods should also be attachable to the new section, explicitly
extend `CONTACT_METHOD_SECTION_KINDS`, the association UI/validation and public
mapping. Merely adding a `SectionKind` does not extend that feature automatically.

## 8. Adding a repository or service

### Repository

First check whether an existing persistence helper fits:

- Simple ordered table with `id` and `sortOrder`: use `createOrderedRepo()` and
  export it from [collections.ts](../src/server/repos/collections.ts).
- Singleton: inspect [singletons.ts](../src/server/repos/singletons.ts).
- Joins or specialized persistence: add a focused repository module.

Follow neighboring repos:

- Import the schema and Drizzle query helpers.
- Accept `executor: DbExecutor = defaultExecutor` where methods may participate
  in an outer transaction.
- Infer database row/input types from the schema.
- Return rows, explicit missing results or deletion outcomes; keep user-facing
  errors and business policy in the service.
- Do not add a second database connection or hide query errors.
- Use stable ordering where UI order matters.

### Service and transaction boundaries

Services compose repository calls and enforce business rules. Reuse
`assertFound`, `ValidationError` and `NotFoundError` from
[shared service helpers](../src/server/services/shared.ts).

When a service grows to cover multiple independent workflows, split along those
boundaries. The [verification service](../src/server/services/admin-verification.ts)
keeps a stable entry point while its
[flow modules](../src/server/services/admin-verification) own signup, self-service
reset, admin-assisted reset and password change. Share common rules without
merging intentionally different cooldown, delivery-failure or session policies.

For an atomic multi-table operation:

```ts
return runInTransaction(async (transaction) => {
  const categoryId = await projects.findOrCreateCategory(transaction, category);
  const created = await projects.insertProject(transaction, fields, categoryId);
  await projects.replaceProjectRoles(transaction, created.id, roles);
  await projects.replaceProjectTechnologies(transaction, created.id, tech);
  return created;
});
```

This is the existing project creation pattern in
[projects.ts](../src/server/services/projects.ts).
Pass the **same transaction** to every participating repository method. Avoid a
default-executor query accidentally escaping the transaction.

Reordering needs action-level input validation and service/repository checks
against stored IDs. Decide explicitly whether an order must cover all rows or
only a subset; existing collection helpers do not establish one universal policy.

Do not copy type assertions from generic infrastructure into feature code when
schema-derived types or guards can express the relationship directly.

## 9. Database changes and operational scripts

The runtime database client and Drizzle config select `DB_URL_PROD` only when
`NODE_ENV=production`; otherwise they select `DB_URL_LOCAL`.
Inspect the intended target before running any database command.

| Command | Purpose / caution |
|---|---|
| `npm run db:generate` | Generate migration files from the schema and snapshots. Review SQL before applying. |
| `npm run db:migrate` | Apply generated migrations to the selected database; requires a compatible migration history. |
| `npm run db:push` | Reconcile the selected database directly with the schema. Inspect proposed changes; do not assume it creates a migration history. |
| `npm run db:studio` | Inspect the selected database. |
| `npm run db:seed` | Populate sample data; not a schema upgrade. Inspect the seed before running against existing data. |
| `npm run db:clear` | Destructively clear content and admin data, including sessions and verification challenges. |
| `npm run db:sync:prod` | Copy data from local to production; it does **not** upgrade production schema. Inspect the script's destructive behavior first. |
| `npm run db:reset:prod` | Destructive full production schema/data rebuild with confirmation and backup by default. Requires `psql` and `pg_dump`. Not a normal incremental upgrade. |

Avoid casually editing an already-applied baseline. Prefer a forward migration
for existing deployments; changing baseline SQL does not update an existing
database. If intentionally maintaining a rebuild baseline, keep SQL, snapshots
and journal metadata consistent and test both fresh setup and upgrade paths.

When adding a table, check all operational surfaces:

- Seed insertion order and foreign keys.
- Clear/truncate table lists.
- Production-sync table lists, ordering and identity handling.
- Rebuild/migration SQL and metadata.
- [Database schema documentation](./database-schema.md) and
  [architecture diagrams](./database-architecture.md).

Use a disposable local test database for destructive validation. Never clear or
reset production merely to test a feature.

## 10. Validation and review checklist

### Commands

Run the smallest relevant checks first:

```bash
npx eslint src/path/to/changed-file.ts src/path/to/changed-component.tsx
npx tsc --noEmit
git diff --check
```

Use `npm run build` when routing, server/client boundaries or bundling changes
need full validation. A production build selects the production environment;
configure a safe database target if any build-time path connects to it.

Current tooling caveats:

- `npm run lint` still invokes `next lint`, removed in Next.js 16. Use the ESLint
  CLI directly until that script is updated.
- There is no configured automated test runner/test script in the current
  package manifest. Do not describe manual checks as an automated regression suite.
- Stale generated `.next/types` may reference deleted routes. Report those errors
  explicitly and regenerate Next types through the installed tooling as needed;
  do not edit generated validators or silently filter compiler failures.

### Behavior checks

- [ ] Empty content database: admin editors load; first-admin signup still works.
- [ ] Valid create/update persists after refresh.
- [ ] Blank optional values, zero and invalid numeric/URL input behave correctly.
- [ ] Both create and edit forms submit every intended field.
- [ ] Unauthenticated action calls are rejected independently of route access.
- [ ] Errors show actionable feedback; failed writes do not appear successful.
- [ ] Multi-table writes roll back together on failure.
- [ ] Delete/reorder and related admin pages stay consistent.
- [ ] Public mapping exposes only intended data and handles missing content.
- [ ] New sections participate in navigation, ordering and visibility.
- [ ] Animations honor reduced motion and clean up across navigation.
- [ ] Local and deployed database schemas agree with the application's types.
- [ ] Seed, clear, sync and schema documentation cover new storage.

For account-related changes, use the cases in
[Authentication flows](./authentication-flows.md), especially consumed/expired
codes, cooldowns, wrong-code limits, inactive accounts and session revocation.
