CREATE TYPE "public"."icon_enum" AS ENUM('palette', 'desktop', 'pen-ruler', 'paintbrush', 'chart-area', 'bullhorn');--> statement-breakpoint
CREATE TYPE "public"."rating_enum" AS ENUM('1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars');--> statement-breakpoint
CREATE TABLE "about_contact_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"about_id" integer NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "about_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"about_id" integer NOT NULL,
	"number" integer NOT NULL,
	"title" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "about_section" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"overlay_title" text,
	"name" text,
	"job_title" text,
	"description" text,
	"button_text" text,
	"button_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "config" (
	"id" serial PRIMARY KEY NOT NULL,
	"api_base_url" text,
	"smtp_host" text,
	"smtp_port" text,
	"smtp_username" text,
	"smtp_password" text,
	"recaptcha_site_key" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contact_section" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"overlay_title" text,
	"form_title" text,
	"button_text" text,
	"button_url" text,
	"info_title" text,
	"address" text,
	"phone" text,
	"email" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "footer" (
	"id" serial PRIMARY KEY NOT NULL,
	"terms_policies" text,
	"disclaimer" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "footer_section" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" text DEFAULT 'Your Company',
	"privacy_policy" text,
	"terms_of_service" text,
	"copyright_text" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "general_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"portfolio_title" text,
	"portfolio_overlay_title" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "header_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_id" text NOT NULL,
	"title" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "header_sections_section_id_unique" UNIQUE("section_id")
);
--> statement-breakpoint
CREATE TABLE "header_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"default_title" text DEFAULT 'Welcome',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hero_section" (
	"id" serial PRIMARY KEY NOT NULL,
	"location" text,
	"subtitle_one" text,
	"subtitle_two" text,
	"logo_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hero_titles" (
	"id" serial PRIMARY KEY NOT NULL,
	"hero_id" integer NOT NULL,
	"title" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"projects_id" integer NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"description" text,
	"image" text,
	"link" text,
	"github" text,
	"tech" text[],
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects_section" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"overlay_title" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"services_id" integer NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"icon" "icon_enum",
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "services_section" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"overlay_title" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sidebar" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_image_url" text,
	"profile_image_alt" text,
	"profile_title" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "social_media" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" text NOT NULL,
	"url" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "summary_experiences" (
	"id" serial PRIMARY KEY NOT NULL,
	"summary_id" integer NOT NULL,
	"skill" text NOT NULL,
	"level" integer,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "summary_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"summary_id" integer NOT NULL,
	"from_year" integer,
	"to_year" text,
	"job_title" text NOT NULL,
	"company" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "summary_section" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"overlay_title" text,
	"button_text" text,
	"button_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "testimonial_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"testimonials_id" integer NOT NULL,
	"image_url" text,
	"title" text NOT NULL,
	"subtitle" text,
	"rating" "rating_enum",
	"content" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "testimonials_section" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"overlay_title" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "about_contact_info" ADD CONSTRAINT "about_contact_info_about_id_about_section_id_fk" FOREIGN KEY ("about_id") REFERENCES "public"."about_section"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "about_details" ADD CONSTRAINT "about_details_about_id_about_section_id_fk" FOREIGN KEY ("about_id") REFERENCES "public"."about_section"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero_titles" ADD CONSTRAINT "hero_titles_hero_id_hero_section_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero_section"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_items" ADD CONSTRAINT "project_items_projects_id_projects_section_id_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects_section"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_items" ADD CONSTRAINT "service_items_services_id_services_section_id_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services_section"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "summary_experiences" ADD CONSTRAINT "summary_experiences_summary_id_summary_section_id_fk" FOREIGN KEY ("summary_id") REFERENCES "public"."summary_section"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "summary_jobs" ADD CONSTRAINT "summary_jobs_summary_id_summary_section_id_fk" FOREIGN KEY ("summary_id") REFERENCES "public"."summary_section"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonial_items" ADD CONSTRAINT "testimonial_items_testimonials_id_testimonials_section_id_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials_section"("id") ON DELETE cascade ON UPDATE no action;