ALTER TABLE "hero_titles" DROP CONSTRAINT IF EXISTS "hero_titles_hero_section_id_hero_section_id_fk";--> statement-breakpoint
ALTER TABLE "hero_titles" ADD COLUMN "hero_section_key" text;--> statement-breakpoint
UPDATE "hero_titles" titles SET "hero_section_key" = sections."section_key"
FROM "hero_section" sections WHERE titles."hero_section_id" = sections."id";--> statement-breakpoint
ALTER TABLE "hero_titles" ALTER COLUMN "hero_section_key" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hero_titles" DROP COLUMN "hero_section_id";--> statement-breakpoint
ALTER TABLE "hero_titles" ADD CONSTRAINT "hero_titles_hero_section_key_hero_section_section_key_fk"
  FOREIGN KEY ("hero_section_key") REFERENCES "public"."hero_section"("section_key") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint

ALTER TABLE "page_sections" DROP COLUMN IF EXISTS "overlay_title";--> statement-breakpoint
ALTER TABLE "hero_section" DROP CONSTRAINT IF EXISTS "hero_section_pkey";--> statement-breakpoint
ALTER TABLE "hero_section" DROP CONSTRAINT IF EXISTS "hero_section_section_key_unique";--> statement-breakpoint
ALTER TABLE "hero_section" DROP COLUMN IF EXISTS "id";--> statement-breakpoint
ALTER TABLE "hero_section" ADD CONSTRAINT "hero_section_section_key_pk" PRIMARY KEY ("section_key");--> statement-breakpoint
ALTER TABLE "about_section" DROP CONSTRAINT IF EXISTS "about_section_pkey";--> statement-breakpoint
ALTER TABLE "about_section" DROP CONSTRAINT IF EXISTS "about_section_section_key_unique";--> statement-breakpoint
ALTER TABLE "about_section" DROP COLUMN IF EXISTS "id";--> statement-breakpoint
ALTER TABLE "about_section" ADD CONSTRAINT "about_section_section_key_pk" PRIMARY KEY ("section_key");--> statement-breakpoint
ALTER TABLE "experience_section" DROP CONSTRAINT IF EXISTS "experience_section_pkey";--> statement-breakpoint
ALTER TABLE "experience_section" DROP CONSTRAINT IF EXISTS "experience_section_section_key_unique";--> statement-breakpoint
ALTER TABLE "experience_section" DROP COLUMN IF EXISTS "id";--> statement-breakpoint
ALTER TABLE "experience_section" ADD CONSTRAINT "experience_section_section_key_pk" PRIMARY KEY ("section_key");--> statement-breakpoint
ALTER TABLE "contact_section" DROP CONSTRAINT IF EXISTS "contact_section_pkey";--> statement-breakpoint
ALTER TABLE "contact_section" DROP CONSTRAINT IF EXISTS "contact_section_section_key_unique";--> statement-breakpoint
ALTER TABLE "contact_section" DROP COLUMN IF EXISTS "id";--> statement-breakpoint
ALTER TABLE "contact_section" ADD CONSTRAINT "contact_section_section_key_pk" PRIMARY KEY ("section_key");--> statement-breakpoint

ALTER TABLE "portfolio_profile" RENAME TO "profile";--> statement-breakpoint
ALTER TABLE "profile" RENAME CONSTRAINT "portfolio_profile_singleton" TO "profile_singleton_chk";--> statement-breakpoint
ALTER TABLE "footer" ADD COLUMN "recaptcha_site_key" text;--> statement-breakpoint
UPDATE "footer" SET "recaptcha_site_key" = config."recaptcha_site_key"
FROM "app_config" config WHERE "footer"."id" = config."id";--> statement-breakpoint
DROP TABLE "app_config";--> statement-breakpoint
ALTER TABLE "footer" RENAME TO "site_config";--> statement-breakpoint
ALTER TABLE "site_config" RENAME CONSTRAINT "footer_singleton" TO "site_config_singleton_chk";--> statement-breakpoint
DROP TABLE "sidebar";
