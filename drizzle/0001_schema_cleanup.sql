ALTER TABLE "site_settings" DROP CONSTRAINT "general_settings_singleton";
DROP TABLE "site_settings";
DROP TABLE "header_settings";

UPDATE "admin_users" SET "email" = lower("email");
UPDATE "admin_email_verifications" SET "email" = lower("email");
ALTER TABLE "admin_users" DROP CONSTRAINT "admin_users_email_unique";
CREATE UNIQUE INDEX "admin_users_email_lower_uq" ON "admin_users" (lower("email"));
DROP INDEX IF EXISTS "admin_email_verifications_email_purpose_uq";
CREATE UNIQUE INDEX "admin_email_verifications_email_purpose_lower_uq"
  ON "admin_email_verifications" (lower("email"), "purpose");

DROP INDEX IF EXISTS "project_roles_project_id_idx";
DROP INDEX IF EXISTS "project_technologies_project_id_idx";

DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'page_sections', 'sidebar', 'portfolio_profile', 'social_links',
    'hero_section', 'hero_titles', 'about_section', 'contact_methods',
    'profile_facts', 'services', 'experience_section', 'experiences',
    'skills', 'testimonials', 'projects', 'contact_section', 'footer',
    'app_config', 'admin_users', 'admin_profiles'
  ] LOOP
    EXECUTE format(
      'UPDATE %I SET created_at = COALESCE(created_at, now()), updated_at = COALESCE(updated_at, now())',
      table_name
    );
  END LOOP;

  FOREACH table_name IN ARRAY ARRAY[
    'project_roles', 'technologies', 'project_technologies',
    'admin_sessions', 'admin_email_verifications'
  ] LOOP
    EXECUTE format(
      'UPDATE %I SET created_at = COALESCE(created_at, now())',
      table_name
    );
  END LOOP;
END $$;

UPDATE "page_sections" SET "sort_order" = 0 WHERE "sort_order" IS NULL;
UPDATE "social_links" SET "sort_order" = 0 WHERE "sort_order" IS NULL;
UPDATE "hero_titles" SET "sort_order" = 0 WHERE "sort_order" IS NULL;
UPDATE "contact_methods" SET "sort_order" = 0 WHERE "sort_order" IS NULL;
UPDATE "profile_facts" SET "sort_order" = 0 WHERE "sort_order" IS NULL;
UPDATE "services" SET "sort_order" = 0 WHERE "sort_order" IS NULL;
UPDATE "experiences" SET "sort_order" = 0 WHERE "sort_order" IS NULL;
UPDATE "skills" SET "sort_order" = 0 WHERE "sort_order" IS NULL;
UPDATE "testimonials" SET "sort_order" = 0 WHERE "sort_order" IS NULL;
UPDATE "projects" SET "sort_order" = 0 WHERE "sort_order" IS NULL;
UPDATE "project_roles" SET "sort_order" = 0 WHERE "sort_order" IS NULL;
UPDATE "project_technologies" SET "sort_order" = 0 WHERE "sort_order" IS NULL;

ALTER TABLE "page_sections"
  ALTER COLUMN "sort_order" SET NOT NULL,
  ALTER COLUMN "created_at" TYPE timestamptz USING "created_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "updated_at" TYPE timestamptz USING "updated_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "updated_at" SET DEFAULT now();
ALTER TABLE "page_sections" ALTER COLUMN "created_at" SET NOT NULL, ALTER COLUMN "updated_at" SET NOT NULL;

ALTER TABLE "sidebar"
  ALTER COLUMN "created_at" TYPE timestamptz USING "created_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "updated_at" TYPE timestamptz USING "updated_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "updated_at" SET DEFAULT now();
ALTER TABLE "sidebar" ALTER COLUMN "created_at" SET NOT NULL, ALTER COLUMN "updated_at" SET NOT NULL;

ALTER TABLE "portfolio_profile"
  ALTER COLUMN "created_at" TYPE timestamptz USING "created_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "updated_at" TYPE timestamptz USING "updated_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "updated_at" SET DEFAULT now();
ALTER TABLE "portfolio_profile" ALTER COLUMN "created_at" SET NOT NULL, ALTER COLUMN "updated_at" SET NOT NULL;

ALTER TABLE "social_links"
  ALTER COLUMN "sort_order" SET NOT NULL,
  ALTER COLUMN "created_at" TYPE timestamptz USING "created_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "updated_at" TYPE timestamptz USING "updated_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "updated_at" SET DEFAULT now();
ALTER TABLE "social_links" ALTER COLUMN "created_at" SET NOT NULL, ALTER COLUMN "updated_at" SET NOT NULL;

ALTER TABLE "hero_section", "hero_titles", "about_section", "contact_methods",
  "profile_facts", "services", "experience_section", "experiences", "skills",
  "testimonials", "projects", "contact_section", "footer", "app_config",
  "admin_users", "admin_profiles"
  ALTER COLUMN "created_at" TYPE timestamptz USING "created_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "updated_at" TYPE timestamptz USING "updated_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "updated_at" SET DEFAULT now();

ALTER TABLE "hero_section", "hero_titles", "about_section", "contact_methods",
  "profile_facts", "services", "experience_section", "experiences", "skills",
  "testimonials", "projects", "contact_section", "footer", "app_config",
  "admin_users", "admin_profiles"
  ALTER COLUMN "created_at" SET NOT NULL,
  ALTER COLUMN "updated_at" SET NOT NULL;

ALTER TABLE "hero_titles", "contact_methods", "profile_facts", "services",
  "experiences", "skills", "testimonials", "projects", "contact_section"
  ALTER COLUMN "sort_order" SET NOT NULL;

ALTER TABLE "project_roles", "technologies", "project_technologies",
  "admin_sessions", "admin_email_verifications"
  ALTER COLUMN "created_at" TYPE timestamptz USING "created_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "created_at" SET NOT NULL;
