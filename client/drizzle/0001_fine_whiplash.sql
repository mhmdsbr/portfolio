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
ALTER TABLE "project_items" ADD CONSTRAINT "project_items_projects_id_projects_section_id_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects_section"("id") ON DELETE cascade ON UPDATE no action;