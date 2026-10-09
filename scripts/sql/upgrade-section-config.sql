-- Upgrades a database created from the previous schema (hero_section,
-- about_section, experience_section and contact_section tables, enum types,
-- free-text project categories) to the current schema in 0000_baseline.sql,
-- preserving all portfolio data. Runs in one transaction; run it once with
-- `npm run db:upgrade`.
BEGIN;

DO $$
BEGIN
  IF to_regclass('public.hero_section') IS NULL THEN
    RAISE EXCEPTION 'Nothing to upgrade: public.hero_section does not exist. '
      'The database is already upgraded or was not created from the previous schema.';
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 1. Section settings move into page_sections.config; section_key becomes kind
-- ---------------------------------------------------------------------------
ALTER TABLE "page_sections"
  ADD COLUMN "kind" text,
  ADD COLUMN "config" jsonb DEFAULT '{}'::jsonb NOT NULL;
UPDATE "page_sections" SET "kind" = "section_key";
ALTER TABLE "page_sections" ALTER COLUMN "kind" SET NOT NULL;

UPDATE "page_sections" p SET "config" = jsonb_strip_nulls(jsonb_build_object(
  'location', NULLIF(btrim(h."location"), ''),
  'subtitleOne', NULLIF(btrim(h."subtitle_one"), ''),
  'subtitleTwo', NULLIF(btrim(h."subtitle_two"), ''),
  'logoUrl', NULLIF(btrim(h."logo_url"), '')
)) FROM "hero_section" h WHERE p."kind" = h."section_key";

UPDATE "page_sections" p SET "config" = jsonb_strip_nulls(jsonb_build_object(
  'buttonText', NULLIF(btrim(s."button_text"), ''),
  'buttonUrl', NULLIF(btrim(s."button_url"), '')
)) FROM "about_section" s WHERE p."kind" = s."section_key";

UPDATE "page_sections" p SET "config" = jsonb_strip_nulls(jsonb_build_object(
  'buttonText', NULLIF(btrim(s."button_text"), ''),
  'buttonUrl', NULLIF(btrim(s."button_url"), '')
)) FROM "experience_section" s WHERE p."kind" = s."section_key";

UPDATE "page_sections" p SET "config" = jsonb_strip_nulls(jsonb_build_object(
  'formTitle', NULLIF(btrim(s."form_title"), ''),
  'buttonText', NULLIF(btrim(s."button_text"), ''),
  'buttonUrl', NULLIF(btrim(s."button_url"), '')
)) FROM "contact_section" s WHERE p."kind" = s."section_key";

-- hero_titles now reference page_sections.id
ALTER TABLE "hero_titles" ADD COLUMN "section_id" integer;
UPDATE "hero_titles" t SET "section_id" = p."id"
  FROM "page_sections" p WHERE p."kind" = t."hero_section_key";
ALTER TABLE "hero_titles" ALTER COLUMN "section_id" SET NOT NULL;
ALTER TABLE "hero_titles" DROP COLUMN "hero_section_key";

DROP TABLE "hero_section", "about_section", "experience_section", "contact_section";
ALTER TABLE "page_sections" DROP COLUMN "section_key";

ALTER TABLE "page_sections"
  ADD CONSTRAINT "page_sections_kind_chk" CHECK ("page_sections"."kind" IN ('hero', 'about', 'experience', 'services', 'projects', 'testimonials', 'contact')),
  ADD CONSTRAINT "page_sections_config_object_chk" CHECK (jsonb_typeof("page_sections"."config") = 'object');
CREATE UNIQUE INDEX "page_sections_kind_uq" ON "page_sections" USING btree ("kind");
ALTER TABLE "hero_titles" ADD CONSTRAINT "hero_titles_section_id_page_sections_id_fk"
  FOREIGN KEY ("section_id") REFERENCES "public"."page_sections"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "hero_titles_section_id_idx" ON "hero_titles" USING btree ("section_id");

-- ---------------------------------------------------------------------------
-- 2. Contact methods are linked to the sections that display them
-- ---------------------------------------------------------------------------
CREATE TABLE "contact_method_sections" (
  "contact_method_id" integer NOT NULL,
  "section_id" integer NOT NULL,
  CONSTRAINT "contact_method_sections_pk" PRIMARY KEY("contact_method_id","section_id")
);
ALTER TABLE "contact_method_sections" ADD CONSTRAINT "contact_method_sections_contact_method_id_contact_methods_id_fk"
  FOREIGN KEY ("contact_method_id") REFERENCES "public"."contact_methods"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "contact_method_sections" ADD CONSTRAINT "contact_method_sections_section_id_page_sections_id_fk"
  FOREIGN KEY ("section_id") REFERENCES "public"."page_sections"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "contact_method_sections_section_id_idx" ON "contact_method_sections" USING btree ("section_id");

-- Both sections displayed every method before, so keep that behavior.
INSERT INTO "contact_method_sections" ("contact_method_id", "section_id")
SELECT m."id", p."id" FROM "contact_methods" m
CROSS JOIN "page_sections" p WHERE p."kind" IN ('about', 'contact');

-- ---------------------------------------------------------------------------
-- 3. Enum types become text columns with CHECK constraints
-- ---------------------------------------------------------------------------
ALTER TABLE "contact_methods" ALTER COLUMN "kind" DROP DEFAULT;
ALTER TABLE "contact_methods" ALTER COLUMN "kind" TYPE text USING "kind"::text;
ALTER TABLE "contact_methods" ALTER COLUMN "kind" SET DEFAULT 'other';
ALTER TABLE "contact_methods" ADD CONSTRAINT "contact_methods_kind_chk"
  CHECK ("contact_methods"."kind" IN ('email', 'phone', 'address', 'other'));

ALTER TABLE "services" ALTER COLUMN "icon" TYPE text USING "icon"::text;
ALTER TABLE "services" ADD CONSTRAINT "services_icon_chk"
  CHECK ("services"."icon" IN ('palette', 'desktop', 'pen-ruler', 'paintbrush', 'chart-area', 'bullhorn'));

DROP INDEX IF EXISTS "admin_email_verifications_email_purpose_active_uq";
ALTER TABLE "admin_email_verifications" ALTER COLUMN "purpose" TYPE text USING "purpose"::text;
CREATE UNIQUE INDEX "admin_email_verifications_email_purpose_active_uq"
  ON "admin_email_verifications" USING btree (lower("email"),"purpose") WHERE "admin_email_verifications"."consumed_at" IS NULL;
ALTER TABLE "admin_email_verifications" ADD CONSTRAINT "admin_email_verifications_purpose_chk"
  CHECK ("admin_email_verifications"."purpose" IN ('initial', 'additional', 'password_reset', 'password_change'));

DROP TYPE IF EXISTS "public"."contact_method_kind_enum";
DROP TYPE IF EXISTS "public"."icon_enum";
DROP TYPE IF EXISTS "public"."admin_verification_purpose_enum";

-- ---------------------------------------------------------------------------
-- 4. Social links: constrained platform and URL
-- ---------------------------------------------------------------------------
UPDATE "social_links" SET "platform" = lower(btrim("platform")), "url" = btrim("url");
ALTER TABLE "social_links"
  ADD CONSTRAINT "social_links_platform_chk" CHECK ("social_links"."platform" IN ('behance', 'dribbble', 'facebook', 'github', 'instagram', 'linkedin', 'mail', 'medium', 'telegram', 'twitter', 'whatsapp', 'youtube')),
  ADD CONSTRAINT "social_links_url_chk" CHECK ("social_links"."url" ~ '^(https?://|/|#|mailto:|tel:)\S+$');
CREATE UNIQUE INDEX "social_links_platform_uq" ON "social_links" USING btree ("platform");

-- ---------------------------------------------------------------------------
-- 5. Project categories, project slugs, and URL checks
-- ---------------------------------------------------------------------------
CREATE TABLE "project_categories" (
  "id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "project_categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "project_categories_slug_chk" CHECK ("project_categories"."slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

-- One category per case-insensitive name; slugs mirror projectSlug() and are
-- de-duplicated with -2, -3, ... suffixes in first-use order.
INSERT INTO "project_categories" ("name", "slug")
SELECT "name",
  CASE WHEN row_number() OVER (PARTITION BY "base" ORDER BY "first_id") = 1
       THEN "base"
       ELSE "base" || '-' || row_number() OVER (PARTITION BY "base" ORDER BY "first_id")
  END
FROM (
  SELECT "name", "first_id",
    COALESCE(NULLIF(btrim(regexp_replace(lower("name"), '[^a-z0-9]+', '-', 'g'), '-'), ''), 'category') AS "base"
  FROM (
    SELECT (array_agg(btrim("category") ORDER BY "id"))[1] AS "name", min("id") AS "first_id"
    FROM "projects" GROUP BY lower(btrim("category"))
  ) AS grouped
) AS slugged
ORDER BY "first_id";

CREATE UNIQUE INDEX "project_categories_slug_uq" ON "project_categories" USING btree ("slug");
CREATE UNIQUE INDEX "project_categories_name_lower_uq" ON "project_categories" USING btree (lower("name"));

ALTER TABLE "projects" ADD COLUMN "category_id" integer, ADD COLUMN "slug" text;
UPDATE "projects" p SET "category_id" = c."id"
  FROM "project_categories" c WHERE lower(c."name") = lower(btrim(p."category"));

-- Keep today's public URLs: slugs are derived from titles exactly as before.
UPDATE "projects" p SET "slug" = s."slug" FROM (
  SELECT "id",
    CASE WHEN row_number() OVER (PARTITION BY "base" ORDER BY "id") = 1
         THEN "base"
         ELSE "base" || '-' || row_number() OVER (PARTITION BY "base" ORDER BY "id")
    END AS "slug"
  FROM (
    SELECT "id", COALESCE(NULLIF(btrim(regexp_replace(lower(btrim("title")), '[^a-z0-9]+', '-', 'g'), '-'), ''), 'project') AS "base"
    FROM "projects"
  ) AS bases
) AS s WHERE p."id" = s."id";

ALTER TABLE "projects" ALTER COLUMN "category_id" SET NOT NULL, ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "projects" DROP COLUMN "category";

-- Empty strings are stored as NULL from now on.
UPDATE "projects" SET
  "image" = NULLIF(btrim("image"), ''),
  "link" = NULLIF(btrim("link"), ''),
  "github_url" = NULLIF(btrim("github_url"), '');
UPDATE "testimonials" SET "image_url" = NULLIF(btrim("image_url"), '');

ALTER TABLE "projects"
  ADD CONSTRAINT "projects_category_id_project_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."project_categories"("id") ON DELETE restrict ON UPDATE no action,
  ADD CONSTRAINT "projects_slug_chk" CHECK ("projects"."slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  ADD CONSTRAINT "projects_image_chk" CHECK ("projects"."image" ~ '^(https?://|/)\S+$'),
  ADD CONSTRAINT "projects_link_chk" CHECK ("projects"."link" ~ '^https?://\S+$'),
  ADD CONSTRAINT "projects_github_url_chk" CHECK ("projects"."github_url" ~ '^https?://\S+$');
CREATE UNIQUE INDEX "projects_slug_uq" ON "projects" USING btree ("slug");
CREATE INDEX "projects_category_id_idx" ON "projects" USING btree ("category_id");
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_image_url_chk"
  CHECK ("testimonials"."image_url" ~ '^(https?://|/)\S+$');
DROP INDEX IF EXISTS "project_roles_role_idx";

-- ---------------------------------------------------------------------------
-- 6. Stricter experience years
-- ---------------------------------------------------------------------------
ALTER TABLE "experiences" DROP CONSTRAINT IF EXISTS "experiences_year_range_chk";
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_year_range_chk"
  CHECK ("experiences"."from_year" BETWEEN 1900 AND 2100 AND ("experiences"."to_year" IS NULL OR "experiences"."to_year" BETWEEN "experiences"."from_year" AND 2100));

COMMIT;
