CREATE TYPE "public"."contact_method_kind_enum" AS ENUM('email', 'phone', 'address', 'other');--> statement-breakpoint
CREATE TYPE "public"."icon_enum" AS ENUM('palette', 'desktop', 'pen-ruler', 'paintbrush', 'chart-area', 'bullhorn');--> statement-breakpoint
CREATE TABLE "about_section" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_key" text NOT NULL,
	"button_text" text,
	"button_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "about_section_section_key_unique" UNIQUE("section_key")
);
--> statement-breakpoint
CREATE TABLE "admin_email_verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"purpose" text NOT NULL,
	"email" text NOT NULL,
	"display_name" text NOT NULL,
	"password_hash" text NOT NULL,
	"code_salt" text NOT NULL,
	"code_hash" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"created_by_user_id" integer,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admin_profiles" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"bio" text,
	"preferences" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admin_sessions" (
	"session_id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "app_config" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"recaptcha_site_key" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "config_singleton" CHECK ("app_config"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE "contact_methods" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" "contact_method_kind_enum" DEFAULT 'other' NOT NULL,
	"title" text NOT NULL,
	"value" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contact_section" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_key" text NOT NULL,
	"form_title" text,
	"button_text" text,
	"button_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "contact_section_section_key_unique" UNIQUE("section_key")
);
--> statement-breakpoint
CREATE TABLE "experience_section" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_key" text NOT NULL,
	"button_text" text,
	"button_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "experience_section_section_key_unique" UNIQUE("section_key")
);
--> statement-breakpoint
CREATE TABLE "experiences" (
	"id" serial PRIMARY KEY NOT NULL,
	"from_year" integer NOT NULL,
	"to_year" integer,
	"job_title" text NOT NULL,
	"company" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "footer" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"company_name" text DEFAULT 'Your Company',
	"privacy_policy" text,
	"terms_of_service" text,
	"disclaimer" text,
	"copyright_text" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "footer_singleton" CHECK ("footer"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE "header_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"default_title" text DEFAULT 'Welcome',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "header_settings_singleton" CHECK ("header_settings"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE "hero_section" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_key" text NOT NULL,
	"location" text,
	"subtitle_one" text,
	"subtitle_two" text,
	"logo_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "hero_section_section_key_unique" UNIQUE("section_key")
);
--> statement-breakpoint
CREATE TABLE "hero_titles" (
	"id" serial PRIMARY KEY NOT NULL,
	"hero_section_id" integer NOT NULL,
	"title" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "page_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_key" text NOT NULL,
	"navigation_title" text NOT NULL,
	"title" text,
	"overlay_title" text,
	"sort_order" integer DEFAULT 0,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "page_sections_section_key_unique" UNIQUE("section_key")
);
--> statement-breakpoint
CREATE TABLE "portfolio_profile" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"name" text,
	"job_title" text,
	"biography" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "portfolio_profile_singleton" CHECK ("portfolio_profile"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE "profile_facts" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" integer NOT NULL,
	"title" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_roles" (
	"project_id" integer NOT NULL,
	"role" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "project_roles_project_id_role_pk" PRIMARY KEY("project_id","role")
);
--> statement-breakpoint
CREATE TABLE "project_technologies" (
	"project_id" integer NOT NULL,
	"technology_id" integer NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "project_technologies_project_id_technology_id_pk" PRIMARY KEY("project_id","technology_id")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"description" text,
	"image" text,
	"link" text,
	"github_url" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"icon" "icon_enum",
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sidebar" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"profile_image_url" text,
	"profile_image_alt" text,
	"profile_title" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "sidebar_singleton" CHECK ("sidebar"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"portfolio_title" text,
	"portfolio_overlay_title" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "general_settings_singleton" CHECK ("site_settings"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"skill" text NOT NULL,
	"level" integer,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "social_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" text NOT NULL,
	"url" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "technologies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" text,
	"title" text NOT NULL,
	"subtitle" text,
	"rating" integer,
	"body" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "testimonials_rating_range" CHECK ("testimonials"."rating" BETWEEN 1 AND 5)
);
--> statement-breakpoint
ALTER TABLE "about_section" ADD CONSTRAINT "about_section_section_key_page_sections_section_key_fk" FOREIGN KEY ("section_key") REFERENCES "public"."page_sections"("section_key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_email_verifications" ADD CONSTRAINT "admin_email_verifications_created_by_user_id_admin_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_profiles" ADD CONSTRAINT "admin_profiles_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_section" ADD CONSTRAINT "contact_section_section_key_page_sections_section_key_fk" FOREIGN KEY ("section_key") REFERENCES "public"."page_sections"("section_key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experience_section" ADD CONSTRAINT "experience_section_section_key_page_sections_section_key_fk" FOREIGN KEY ("section_key") REFERENCES "public"."page_sections"("section_key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero_section" ADD CONSTRAINT "hero_section_section_key_page_sections_section_key_fk" FOREIGN KEY ("section_key") REFERENCES "public"."page_sections"("section_key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero_titles" ADD CONSTRAINT "hero_titles_hero_section_id_hero_section_id_fk" FOREIGN KEY ("hero_section_id") REFERENCES "public"."hero_section"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_roles" ADD CONSTRAINT "project_roles_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_technologies" ADD CONSTRAINT "project_technologies_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_technologies" ADD CONSTRAINT "project_technologies_technology_id_technologies_id_fk" FOREIGN KEY ("technology_id") REFERENCES "public"."technologies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "admin_email_verifications_email_purpose_uq" ON "admin_email_verifications" USING btree ("email","purpose");--> statement-breakpoint
CREATE INDEX "admin_sessions_user_id_idx" ON "admin_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "project_roles_project_id_idx" ON "project_roles" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "project_roles_role_idx" ON "project_roles" USING btree ("role");--> statement-breakpoint
CREATE INDEX "project_technologies_project_id_idx" ON "project_technologies" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "project_technologies_technology_id_idx" ON "project_technologies" USING btree ("technology_id");--> statement-breakpoint
CREATE UNIQUE INDEX "technologies_name_idx" ON "technologies" USING btree ("name");