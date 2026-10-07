# Database schema

This diagram describes the Drizzle schema in `src/lib/db/schema.ts`. Solid
relations are enforced foreign keys. Content tables without a relation are
independent in the database, even if the API currently combines them into
sections.

```mermaid
erDiagram
    PAGE_SECTIONS {
        int id PK
        text section_key UK
        text navigation_title
        text title
        text overlay_title
        int sort_order
        boolean is_enabled
    }

    HERO_SECTION {
        int id PK
        text section_key FK_UK
        text location
        text subtitle_one
        text subtitle_two
        text logo_url
    }

    ABOUT_SECTION {
        int id PK
        text section_key FK_UK
        text button_text
        text button_url
    }

    EXPERIENCE_SECTION {
        int id PK
        text section_key FK_UK
        text button_text
        text button_url
    }

    CONTACT_SECTION {
        int id PK
        text section_key FK_UK
        text form_title
        text button_text
        text button_url
    }

    HERO_TITLES {
        int id PK
        int hero_section_id FK
        text title
        int sort_order
    }

    PORTFOLIO_PROFILE {
        int id PK
        text name
        text job_title
        text biography
    }

    CONTACT_METHODS {
        int id PK
        enum kind
        text title
        text value
        int sort_order
    }

    PROFILE_FACTS {
        int id PK
        int number
        text title
        int sort_order
    }

    EXPERIENCES {
        int id PK
        int from_year
        int to_year
        text job_title
        text company
        text description
        int sort_order
    }

    SKILLS {
        int id PK
        text skill
        int level
        int sort_order
    }

    SERVICES {
        int id PK
        text title
        text description
        enum icon
        int sort_order
    }

    PROJECTS {
        int id PK
        text title
        text category
        text description
        text image
        text link
        text github_url
        int sort_order
    }

    PROJECT_ROLES {
        int project_id PK_FK
        text role PK
        int sort_order
    }

    TECHNOLOGIES {
        int id PK
        text name UK
    }

    PROJECT_TECHNOLOGIES {
        int project_id PK_FK
        int technology_id PK_FK
        int sort_order
    }

    TESTIMONIALS {
        int id PK
        text image_url
        text title
        text subtitle
        int rating "1 to 5"
        text body
        int sort_order
    }

    SIDEBAR {
        int id PK
        text profile_image_url
        text profile_image_alt
        text profile_title
    }

    SOCIAL_LINKS {
        int id PK
        text platform
        text url
        int sort_order
    }

    SITE_SETTINGS {
        int id PK
        text portfolio_title
        text portfolio_overlay_title
    }

    HEADER_SETTINGS {
        int id PK
        text default_title
    }

    FOOTER {
        int id PK
        text company_name
        text terms_policies
        text privacy_policy
        text terms_of_service
        text disclaimer
        text copyright_text
    }

    APP_CONFIG {
        int id PK
        text recaptcha_site_key
    }

    ADMIN_USERS {
        int id PK
        text email UK
        text password_hash
        boolean is_active
    }

    ADMIN_PROFILES {
        int user_id PK_FK
        text display_name
        text bio
        jsonb preferences
    }

    ADMIN_SESSIONS {
        text session_id PK
        int user_id FK
        timestamp expires_at
    }

    ADMIN_EMAIL_VERIFICATIONS {
        text id PK
        text purpose
        text email
        text display_name
        text password_hash
        int created_by_user_id FK
        timestamp expires_at
    }

    PAGE_SECTIONS ||--o| HERO_SECTION : "section_key"
    PAGE_SECTIONS ||--o| ABOUT_SECTION : "section_key"
    PAGE_SECTIONS ||--o| EXPERIENCE_SECTION : "section_key"
    PAGE_SECTIONS ||--o| CONTACT_SECTION : "section_key"
    HERO_SECTION ||--o{ HERO_TITLES : "hero_section_id"

    ADMIN_USERS ||--o| ADMIN_PROFILES : "user_id"
    ADMIN_USERS ||--o{ ADMIN_SESSIONS : "user_id"
    ADMIN_USERS o|--o{ ADMIN_EMAIL_VERIFICATIONS : "created_by_user_id"
    PROJECTS ||--o{ PROJECT_ROLES : "project_id"
    PROJECTS ||--o{ PROJECT_TECHNOLOGIES : "project_id"
    TECHNOLOGIES ||--o{ PROJECT_TECHNOLOGIES : "technology_id"
```

`PROJECTS` has a many-to-many relationship with `TECHNOLOGIES` through
`PROJECT_TECHNOLOGIES`. Project roles are ordered records owned by one project
in `PROJECT_ROLES`.

## App-level section associations

These associations are used by the current API and UI, but are **not** enforced
by foreign keys:

| Page section | Data returned with that section |
| --- | --- |
| `hero` | `hero_section`, `hero_titles` |
| `about` | `about_section`, `portfolio_profile`, `contact_methods`, `profile_facts` |
| `experience` | `experience_section`, `experiences`, `skills` |
| `services` | `services` |
| `projects` | `projects` |
| `testimonials` | `testimonials` |
| `contact` | `contact_section`, `contact_methods` |

The schema also contains independent site-level tables: `sidebar`,
`social_links`, `site_settings`, `header_settings`, `footer`, and `app_config`.
No foreign keys currently connect these tables to each other.
