# Database architecture

How the PostgreSQL database is structured, how data gets in and out, and which
layer guards what. The column-level reference is in
[database-schema.md](./database-schema.md); this document shows the big picture.

Diagrams use [Mermaid](https://mermaid.js.org/) and render on GitHub and in VS Code.

## 1. System overview

Every read and write goes through Drizzle (`src/lib/db`). Admin changes are
Next.js server actions guarded by `requireAuth()`. The public site reads a single
JSON payload from `/api/all`.

```mermaid
%%{init: {'theme':'base','themeVariables':{'primaryColor':'#dbeafe','primaryTextColor':'#0f172a','primaryBorderColor':'#2563eb','secondaryColor':'#e0f2fe','tertiaryColor':'#f1f5f9','lineColor':'#64748b','textColor':'#0f172a','mainBkg':'#dbeafe','nodeBorder':'#2563eb','clusterBkg':'#f1f5f9','clusterBorder':'#94a3b8','titleColor':'#0f172a','edgeLabelBackground':'#e2e8f0'}}}%%
flowchart LR
    subgraph Browser
        V[Visitor<br/>public site]
        A[Admin<br/>/admin/*]
    end

    subgraph Next["Next.js app"]
        direction TB
        UI["Components<br/>useAllData() via SWR"]
        API["Public API routes<br/>/api/all, /api/hero, /api/about, ...<br/>(read only)"]
        ACT["Server actions<br/>src/actions/*<br/>requireAuth() first"]
        LIB["Domain helpers<br/>sections.ts, contact-methods.ts,<br/>projects.ts, section-config.ts,<br/>validation.ts"]
        AUTH["auth.ts<br/>sessions, email codes"]
        DRZ["Drizzle ORM<br/>src/lib/db/schema.ts"]
    end

    PG[("PostgreSQL 16<br/>portfo_db")]

    V --> UI --> API
    A -->|forms / FormData| ACT
    A -->|login, signup| AUTH
    ACT --> LIB
    API --> LIB
    ACT --> AUTH
    LIB --> DRZ
    API --> DRZ
    AUTH --> DRZ
    DRZ --> PG

    ACT -. "revalidatePath()" .-> API
```

## 2. Entity relationships

Tables are grouped by purpose. Only foreign keys are drawn; `page_sections`
carries the per-section settings in its `config` column instead of separate
tables.

### Page layout and contact methods

```mermaid
%%{init: {'theme':'base','themeVariables':{'primaryColor':'#dbeafe','primaryTextColor':'#0f172a','primaryBorderColor':'#2563eb','lineColor':'#64748b','textColor':'#0f172a','mainBkg':'#dbeafe','nodeBorder':'#2563eb','edgeLabelBackground':'#e2e8f0','attributeBackgroundColorOdd':'#f8fafc','attributeBackgroundColorEven':'#e2e8f0','tertiaryColor':'#f1f5f9'}}}%%
erDiagram
    %% ---------- Page layout ----------
    PAGE_SECTIONS {
        int id PK
        text kind UK "hero | about | experience | services | projects | testimonials | contact"
        text navigation_title
        text title
        int sort_order
        bool is_enabled
        jsonb config "typed per kind, object only"
    }
    HERO_TITLES {
        int id PK
        int section_id FK
        text title
        int sort_order
    }
    CONTACT_METHODS {
        int id PK
        text kind "email | phone | address | other"
        text title
        text value
        int sort_order
    }
    CONTACT_METHOD_SECTIONS {
        int contact_method_id PK, FK
        int section_id PK, FK
    }

    PAGE_SECTIONS ||--o{ HERO_TITLES : "hero titles (cascade)"
    PAGE_SECTIONS ||--o{ CONTACT_METHOD_SECTIONS : "shown in (cascade)"
    CONTACT_METHODS ||--o{ CONTACT_METHOD_SECTIONS : "links (cascade)"

```

### Projects

```mermaid
%%{init: {'theme':'base','themeVariables':{'primaryColor':'#dbeafe','primaryTextColor':'#0f172a','primaryBorderColor':'#2563eb','lineColor':'#64748b','textColor':'#0f172a','mainBkg':'#dbeafe','nodeBorder':'#2563eb','edgeLabelBackground':'#e2e8f0','attributeBackgroundColorOdd':'#f8fafc','attributeBackgroundColorEven':'#e2e8f0','tertiaryColor':'#f1f5f9'}}}%%
erDiagram
    %% ---------- Projects ----------
    PROJECT_CATEGORIES {
        int id PK
        text name UK "case-insensitive"
        text slug UK
    }
    PROJECTS {
        int id PK
        text slug UK "stable URL segment"
        text title
        int category_id FK
        text image "asset URL"
        text link "http(s) URL"
        text github_url "http(s) URL"
        int sort_order
    }
    PROJECT_ROLES {
        int project_id PK, FK
        text role PK
        int sort_order
    }
    TECHNOLOGIES {
        int id PK
        text name UK "case-insensitive"
    }
    PROJECT_TECHNOLOGIES {
        int project_id PK, FK
        int technology_id PK, FK
        int sort_order
    }

    PROJECT_CATEGORIES ||--o{ PROJECTS : "category (restrict)"
    PROJECTS ||--o{ PROJECT_ROLES : "roles (cascade)"
    PROJECTS ||--o{ PROJECT_TECHNOLOGIES : "stack (cascade)"
    TECHNOLOGIES ||--o{ PROJECT_TECHNOLOGIES : "used by (cascade)"

```

Standalone content tables have no foreign keys and are attached to a page
section only by the application (see section 3):

| Table | Holds | Notable constraints |
| --- | --- | --- |
| `profile` | name, job title, biography | singleton (`id = 1`) |
| `profile_facts` | number + title pairs for the About section | |
| `experiences` | jobs | years 1900-2100, end year not before start; `to_year` null = present |
| `skills` | skill + level | level 0-100 |
| `services` | title, description, icon | icon in `SERVICE_ICONS` |
| `testimonials` | quotes | rating 1-5, image URL pattern |
| `social_links` | platform + URL | unique platform in `SOCIAL_PLATFORMS`, URL pattern |
| `site_config` | footer text, recaptcha key | singleton (`id = 1`) |

### Admin and authentication

```mermaid
%%{init: {'theme':'base','themeVariables':{'primaryColor':'#dbeafe','primaryTextColor':'#0f172a','primaryBorderColor':'#2563eb','lineColor':'#64748b','textColor':'#0f172a','mainBkg':'#dbeafe','nodeBorder':'#2563eb','edgeLabelBackground':'#e2e8f0','attributeBackgroundColorOdd':'#f8fafc','attributeBackgroundColorEven':'#e2e8f0','tertiaryColor':'#f1f5f9'}}}%%
erDiagram
    ADMIN_USERS {
        int id PK
        text email UK "lower(email)"
        text password_hash "scrypt"
        bool is_active
    }
    ADMIN_PROFILES {
        int user_id PK, FK
        text display_name
        jsonb preferences
    }
    ADMIN_SESSIONS {
        text session_id PK "hash of cookie value"
        int user_id FK
        timestamptz expires_at
    }
    ADMIN_EMAIL_VERIFICATIONS {
        text id PK
        text purpose "initial | additional | password_reset | password_change"
        text email
        int attempts
        timestamptz consumed_at
        int created_by_user_id FK
        timestamptz expires_at
    }

    ADMIN_USERS ||--o| ADMIN_PROFILES : "profile (cascade)"
    ADMIN_USERS ||--o{ ADMIN_SESSIONS : "sessions (cascade)"
    ADMIN_USERS o|--o{ ADMIN_EMAIL_VERIFICATIONS : "created by (cascade)"
```

## 3. Which tables feed which section

`page_sections` is the hub: one row per `kind` that holds the section's title,
nav label, order, visibility, and its own `config`. The API assembles each
section's payload from those rows plus the content tables.

```mermaid
%%{init: {'theme':'base','themeVariables':{'primaryColor':'#dbeafe','primaryTextColor':'#0f172a','primaryBorderColor':'#2563eb','secondaryColor':'#e0f2fe','tertiaryColor':'#f1f5f9','lineColor':'#64748b','textColor':'#0f172a','mainBkg':'#dbeafe','nodeBorder':'#2563eb','clusterBkg':'#f1f5f9','clusterBorder':'#94a3b8','titleColor':'#0f172a','edgeLabelBackground':'#e2e8f0'}}}%%
flowchart TB
    PS[("page_sections<br/>one row per kind<br/>title, order, enabled, config")]

    subgraph hero["hero"]
        HC["config: location, subtitleOne,<br/>subtitleTwo, logoUrl"]
        HT[("hero_titles")]
    end
    subgraph about["about"]
        AC["config: buttonText, buttonUrl"]
        PR[("profile")]
        PF[("profile_facts")]
        CMA[("contact_methods<br/>via contact_method_sections")]
    end
    subgraph exp["experience"]
        EC["config: buttonText, buttonUrl"]
        EX[("experiences")]
        SK[("skills")]
    end
    subgraph svc["services"]
        SV[("services")]
    end
    subgraph prj["projects"]
        PJ[("projects")]
        PCAT[("project_categories")]
        PRL[("project_roles")]
        PTC[("project_technologies<br/>+ technologies")]
    end
    subgraph tst["testimonials"]
        TS[("testimonials")]
    end
    subgraph con["contact"]
        CC["config: formTitle, buttonText,<br/>buttonUrl"]
        CMC[("contact_methods<br/>via contact_method_sections")]
    end

    PS --- HC
    PS --- AC
    PS --- EC
    PS --- CC
    PS -- "FK section_id" --> HT
    PS -- "FK section_id" --> CMA
    PS -- "FK section_id" --> CMC

    SITE[("site_config<br/>footer + recaptcha key")]
    SOC[("social_links")]
```

`site_config` feeds the `footer` and `config` parts of the payload. `social_links`
is stored but not currently returned by the API.

## 4. Read path: from tables to the page

```mermaid
%%{init: {'theme':'base','themeVariables':{'primaryColor':'#dbeafe','primaryTextColor':'#0f172a','primaryBorderColor':'#2563eb','lineColor':'#64748b','textColor':'#0f172a','actorBkg':'#dbeafe','actorTextColor':'#0f172a','actorBorder':'#2563eb','actorLineColor':'#64748b','signalColor':'#0f172a','signalTextColor':'#0f172a','labelBoxBkgColor':'#bfdbfe','labelBoxBorderColor':'#2563eb','labelTextColor':'#0f172a','loopTextColor':'#0f172a','noteBkgColor':'#fef9c3','noteTextColor':'#0f172a','noteBorderColor':'#ca8a04','sequenceNumberColor':'#ffffff'}}}%%
sequenceDiagram
    autonumber
    participant B as Browser (SWR)
    participant R as GET /api/all
    participant H as Helpers
    participant DB as PostgreSQL

    rect rgb(226, 232, 240)
    B->>R: fetch api/all
    par parallel queries (Promise.all)
        R->>DB: profile, profile_facts
        R->>DB: hero_titles JOIN page_sections(kind='hero')
        R->>DB: contact methods + their section links
        R->>DB: services, experiences, skills, testimonials
        R->>DB: projects JOIN project_categories
        R->>DB: project_technologies JOIN technologies, project_roles
        R->>DB: site_config
        R->>DB: page_sections (ordered)
    end
    R->>H: readSectionConfig(kind, row.config)
    Note over H: keeps known keys only,<br/>fills missing keys with null
    R->>R: group tech and roles by project,<br/>split methods per section
    R-->>B: AllDataResponse (JSON)
    B->>B: render enabled sections<br/>in stored sortOrder
    end
```

Section order and visibility come from `page_sections`, so `app/page.tsx` renders
the components in the order stored in the database and skips disabled kinds.

## 5. Write path: admin edits

Each admin form calls a server action. The action authenticates, validates and
normalizes input, writes inside a transaction when several tables are involved,
then revalidates the cached paths.

```mermaid
%%{init: {'theme':'base','themeVariables':{'primaryColor':'#dbeafe','primaryTextColor':'#0f172a','primaryBorderColor':'#2563eb','lineColor':'#64748b','textColor':'#0f172a','actorBkg':'#dbeafe','actorTextColor':'#0f172a','actorBorder':'#2563eb','actorLineColor':'#64748b','signalColor':'#0f172a','signalTextColor':'#0f172a','labelBoxBkgColor':'#bfdbfe','labelBoxBorderColor':'#2563eb','labelTextColor':'#0f172a','loopTextColor':'#0f172a','noteBkgColor':'#fef9c3','noteTextColor':'#0f172a','noteBorderColor':'#ca8a04','sequenceNumberColor':'#ffffff'}}}%%
sequenceDiagram
    autonumber
    participant F as Admin form
    participant S as Server action
    participant V as validation.ts / section-config.ts
    participant DB as PostgreSQL

    rect rgb(226, 232, 240)
    F->>S: FormData
    S->>S: requireAuth() (cookie -> hashed session -> user)
    S->>V: optionalText / optionalUrl / sanitizeSectionConfig
    alt invalid
        V-->>F: throws, nothing written
    else valid
        S->>DB: BEGIN
        S->>DB: UPDATE page_sections SET config = $sanitized WHERE kind = $kind
        S->>DB: related tables (same transaction)
        DB-->>S: CHECK / FK / UNIQUE enforced
        S->>DB: COMMIT
        S-->>F: updated record
        S->>S: revalidatePath('/', '/api/all', '/admin/...')
    end
    end
```

### Actions and what they touch

| Action module | Tables written | Notes |
| --- | --- | --- |
| `hero.ts` | `page_sections.config` (hero), `hero_titles` | titles are replaced as a list |
| `about.ts` | `page_sections.config` (about), `profile`, `profile_facts` | profile is a singleton row |
| `experience.ts` | `page_sections.config` (experience), `experiences`, `skills` | year range validated |
| `contact.ts` | `page_sections.config` (contact), `contact_methods`, `contact_method_sections` | method + section links in one transaction |
| `services.ts` | `services` | icon checked against `SERVICE_ICONS` |
| `testimonials.ts` | `testimonials` | rating 1-5, image URL validated |
| `projects.ts` | `projects`, `project_categories`, `project_roles`, `technologies`, `project_technologies` | see section 7 |
| `header.ts` | `page_sections` (title, nav title, order, enabled) | used by every Section settings card and by Page layout; at least one section must stay enabled |
| `footer.ts`, `config.ts` | `site_config` | singleton row |
| `profile.ts`, `auth.ts` | `admin_*` tables | see section 8 |

## 5a. Admin panel layout

The admin is organised the same way as the data: every section page has the same
first card, **Section settings**, which edits that section's `page_sections` row
(navigation label, title, visibility). Below it come the section's own `config`
form and its content records. **Page layout** only changes order and visibility.

| Admin page | Section settings (`page_sections`) | Config form (`config`) | Content records |
| --- | --- | --- | --- |
| `/admin/hero` | `hero` | location, subtitles, logo | `hero_titles` |
| `/admin/about` | `about` | button | `profile`, `profile_facts`, **contact methods** |
| `/admin/experience` | `experience` | resume button | `experiences`, `skills` |
| `/admin/services` | `services` | none | `services` |
| `/admin/projects` | `projects` | none | `projects`, `project_categories` |
| `/admin/testimonials` | `testimonials` | none | `testimonials` |
| `/admin/contact` | `contact` | form title, button | **contact methods** |
| `/admin/header` | all kinds | none | order and visibility only |

Contact methods appear on both the About and Contact pages because they are shared
records; the checkboxes on each method decide which sections show it.

The section actions (`getHero`, `getAbout`, `getContact`, `getExperience`,
`getServices`, `getTestimonials`, `getProjectsOverview`) return the same shape,
`{ section, config?, ...content }`, where `section` is the `page_sections` metadata.

Naming is the same in the database, the admin and the API: `experiences` are the
jobs, `skills` are the skills, and the API key and route are `experience`
(`/api/experience`, `data.experience.experiences`, `data.experience.skills`).

Project categories are chosen from the existing rows (`CategorySelect`); typing a
new name creates a category on save.

## 6. Section settings (`page_sections.config`)

Settings that used to live in four tables are now one JSONB object per section.
The TypeScript type per kind is the contract; the database only guarantees that
`config` is a JSON object.

```mermaid
%%{init: {'theme':'base','themeVariables':{'primaryColor':'#dbeafe','primaryTextColor':'#0f172a','primaryBorderColor':'#2563eb','secondaryColor':'#e0f2fe','tertiaryColor':'#f1f5f9','lineColor':'#64748b','textColor':'#0f172a','mainBkg':'#dbeafe','nodeBorder':'#2563eb','clusterBkg':'#f1f5f9','clusterBorder':'#94a3b8','titleColor':'#0f172a','edgeLabelBackground':'#e2e8f0'}}}%%
flowchart LR
    IN["Form input"] --> SAN["sanitizeSectionConfig(kind, input)<br/>trim, empty to null,<br/>URL pattern check,<br/>drop unknown keys"]
    SAN --> UPD["UPDATE page_sections<br/>SET config WHERE kind"]
    UPD --> CHK{"CHECK<br/>jsonb_typeof(config) = 'object'"}
    CHK --> STORE[("config jsonb")]
    STORE --> RD["readSectionConfig(kind, stored)<br/>defaults for missing keys"]
    RD --> OUT["API response / admin form"]
```

| Kind | Config keys |
| --- | --- |
| `hero` | `location`, `subtitleOne`, `subtitleTwo`, `logoUrl` |
| `about` | `buttonText`, `buttonUrl` |
| `experience` | `buttonText`, `buttonUrl` |
| `contact` | `formTitle`, `buttonText`, `buttonUrl` |
| `services`, `projects`, `testimonials` | none |

Code finds a section by `kind` through the typed constants in
`src/lib/db/constants.ts` (`getSection(kind)`, `updateSectionConfig(kind, ...)`,
`requireSectionId(kind)`), so queries never contain free-form section names.

## 7. Projects, categories, slugs, technologies

```mermaid
%%{init: {'theme':'base','themeVariables':{'primaryColor':'#dbeafe','primaryTextColor':'#0f172a','primaryBorderColor':'#2563eb','secondaryColor':'#e0f2fe','tertiaryColor':'#f1f5f9','lineColor':'#64748b','textColor':'#0f172a','mainBkg':'#dbeafe','nodeBorder':'#2563eb','clusterBkg':'#f1f5f9','clusterBorder':'#94a3b8','titleColor':'#0f172a','edgeLabelBackground':'#e2e8f0'}}}%%
flowchart TB
    FORM["Project form<br/>title, category name, roles, tech, URLs"] --> PARSE["parseProjectForm()<br/>required title and category,<br/>URL validation"]
    PARSE --> TX{{"transaction"}}

    TX --> CAT["findOrCreateCategory(name)<br/>case-insensitive match,<br/>else insert with unique slug"]
    TX --> SLUG["createProjectSlug(title)<br/>only on create:<br/>slug, slug-2, slug-3 ...<br/>never changed by later edits"]
    CAT --> P[("projects<br/>category_id FK, slug UK")]
    SLUG --> P

    TX --> ROLES["replace project_roles<br/>(ordered list)"]
    TX --> TECH["upsert technologies<br/>lower(name) unique,<br/>replace project_technologies"]
    TX --> PRUNE["pruneEmptyCategories()<br/>after update or delete"]

    P --- ROLES
    P --- TECH
    PRUNE --> C[("project_categories")]
    CAT --> C
```

Public URLs:

- `/projects/<projects.slug>` is the project page.
- `/projects/category/<project_categories.slug>` lists a category.

Both are looked up directly by their unique slug instead of re-deriving it from
the title.

## 8. Contact methods across sections

A contact method is one record that can be displayed by the About section, the
Contact section, or both. Display order is global (`contact_methods.sort_order`).

```mermaid
%%{init: {'theme':'base','themeVariables':{'primaryColor':'#dbeafe','primaryTextColor':'#0f172a','primaryBorderColor':'#2563eb','secondaryColor':'#e0f2fe','tertiaryColor':'#f1f5f9','lineColor':'#64748b','textColor':'#0f172a','mainBkg':'#dbeafe','nodeBorder':'#2563eb','clusterBkg':'#f1f5f9','clusterBorder':'#94a3b8','titleColor':'#0f172a','edgeLabelBackground':'#e2e8f0'}}}%%
flowchart LR
    M1["Email"] --> L1(("about"))
    M1 --> L2(("contact"))
    M2["Phone"] --> L1
    M2 --> L2
    M3["Location"] --> L2
    M4["Hidden method"]:::hidden

    L1 --> API1["/api/about<br/>contact_information"]
    L2 --> API2["/api/contact<br/>methods"]

    classDef hidden stroke-dasharray: 4 4
```

Stored as rows in `contact_method_sections (contact_method_id, section_id)`.
A method with no rows is hidden everywhere. Deleting a method or a section removes
its links (`ON DELETE CASCADE`).

## 9. Admin authentication data

```mermaid
%%{init: {'theme':'base','themeVariables':{'primaryColor':'#dbeafe','primaryTextColor':'#0f172a','primaryBorderColor':'#2563eb','secondaryColor':'#e0f2fe','tertiaryColor':'#f1f5f9','lineColor':'#64748b','textColor':'#0f172a','mainBkg':'#dbeafe','nodeBorder':'#2563eb','edgeLabelBackground':'#e2e8f0','labelColor':'#0f172a','stateBkg':'#dbeafe','stateLabelColor':'#0f172a','transitionLabelColor':'#0f172a','transitionColor':'#64748b','specialStateColor':'#64748b'}}}%%
stateDiagram-v2
    [*] --> Requested: beginAdminEmailVerification<br/>(or password reset / change)
    Requested --> Requested: resend after 60 s cooldown
    Requested --> Expired: 10 minutes pass
    Requested --> Locked: 5 wrong codes (attempts)
    Requested --> Consumed: correct code, consumed_at set
    Consumed --> UserCreated: initial / additional<br/>admin_users + admin_profiles
    Consumed --> PasswordUpdated: reset / change<br/>other sessions revoked
    UserCreated --> SessionActive: login()<br/>random cookie, SHA hash stored
    SessionActive --> [*]: logout or 7 day expiry
```

```mermaid
%%{init: {'theme':'base','themeVariables':{'primaryColor':'#dbeafe','primaryTextColor':'#0f172a','primaryBorderColor':'#2563eb','secondaryColor':'#e0f2fe','tertiaryColor':'#f1f5f9','lineColor':'#64748b','textColor':'#0f172a','mainBkg':'#dbeafe','nodeBorder':'#2563eb','clusterBkg':'#f1f5f9','clusterBorder':'#94a3b8','titleColor':'#0f172a','edgeLabelBackground':'#e2e8f0'}}}%%
flowchart LR
    COOKIE["Browser cookie<br/>admin_session = random 32 bytes"] -->|hashSessionId| H["session_id (hash)"]
    H --> S[("admin_sessions<br/>user_id, expires_at")]
    S --> U[("admin_users<br/>is_active, password_hash")]
    U --> P[("admin_profiles")]
    VER[("admin_email_verifications<br/>unique pending per<br/>lower(email) + purpose")] -. creates .-> U
```

Only a hash of the cookie value is stored, so a database leak does not expose
usable sessions. Indexes on `admin_sessions.expires_at` and
`admin_email_verifications.expires_at` support expiry cleanup queries.

## 10. Where each rule is enforced

```mermaid
%%{init: {'theme':'base','themeVariables':{'primaryColor':'#dbeafe','primaryTextColor':'#0f172a','primaryBorderColor':'#2563eb','secondaryColor':'#e0f2fe','tertiaryColor':'#f1f5f9','lineColor':'#64748b','textColor':'#0f172a','mainBkg':'#dbeafe','nodeBorder':'#2563eb','clusterBkg':'#f1f5f9','clusterBorder':'#94a3b8','titleColor':'#0f172a','edgeLabelBackground':'#e2e8f0'}}}%%
flowchart TB
    subgraph L1["1. UI"]
        U1["select lists, required fields"]
    end
    subgraph L2["2. Server action"]
        U2["requireAuth()<br/>requiredText / optionalText / optionalUrl<br/>sanitizeSectionConfig<br/>year and rating parsing"]
    end
    subgraph L3["3. TypeScript types"]
        U3["SectionKind, ServiceIcon, ContactMethodKind,<br/>SocialPlatform, ... from constants.ts"]
    end
    subgraph L4["4. PostgreSQL"]
        U4["NOT NULL, PK, FK<br/>UNIQUE (kind, slugs, lower(email), platform)<br/>CHECK value sets, URL patterns, slug pattern,<br/>year ranges, rating, level, singleton id = 1"]
    end

    L1 --> L2 --> L3 --> L4
    CONST["constants.ts<br/>single source of truth"] -. generates .-> L3
    CONST -. generates CHECKs .-> L4
    CONST -. used by .-> L2
```

The value sets and URL/slug regex patterns are defined once in
`src/lib/db/constants.ts`, and are used both to build the `CHECK` constraints and to
type and validate application code, so the layers cannot disagree.

## 11. Schema lifecycle and operations

```mermaid
%%{init: {'theme':'base','themeVariables':{'primaryColor':'#dbeafe','primaryTextColor':'#0f172a','primaryBorderColor':'#2563eb','secondaryColor':'#e0f2fe','tertiaryColor':'#f1f5f9','lineColor':'#64748b','textColor':'#0f172a','mainBkg':'#dbeafe','nodeBorder':'#2563eb','clusterBkg':'#f1f5f9','clusterBorder':'#94a3b8','titleColor':'#0f172a','edgeLabelBackground':'#e2e8f0'}}}%%
flowchart LR
    SCH["src/lib/db/schema.ts"] -->|drizzle-kit generate| MIG["drizzle/0000_baseline.sql<br/>+ snapshot"]
    MIG -->|db:migrate / db:push| NEW[("new database")]
    OLD[("database from the previous schema")] -->|"npm run db:upgrade<br/>scripts/sql/upgrade-section-config.sql<br/>one transaction"| NEW2[("current schema,<br/>data preserved")]

    SEED["npm run db:seed"] --> LOCAL[("local DB")]
    CLEAR["npm run db:clear --confirm<br/>TRUNCATE content tables,<br/>keeps admin_* tables"] --> LOCAL
    LOCAL -->|"npm run db:sync:prod --confirm<br/>replace content, reset sequences"| PROD[("production DB")]
```

| Command | Effect |
| --- | --- |
| `npm run db:push` | create or sync the schema from `schema.ts` (new databases) |
| `npm run db:upgrade` | migrate a pre-consolidation database in place; refuses to run twice |
| `npm run db:seed` | insert sample portfolio content, sections with config and links |
| `npm run db:clear` | truncate content tables and reset identity sequences; admin accounts are kept |
| `npm run db:sync:prod` | copy local content tables to production in one transaction; admin tables are never copied |

## 12. Cascade and delete behaviour

| Deleting | Also removes | Blocked when |
| --- | --- | --- |
| a `page_sections` row | its `hero_titles`, `contact_method_sections` | |
| a `contact_methods` row | its `contact_method_sections` | |
| a `projects` row | its `project_roles`, `project_technologies` | |
| a `technologies` row | its `project_technologies` links | |
| a `project_categories` row | | any project still uses it (`RESTRICT`) |
| an `admin_users` row | profile, sessions, verifications it created | |
