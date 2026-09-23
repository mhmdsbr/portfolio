import "dotenv/config";
import postgres from "postgres";

const isProduction = process.env.NODE_ENV === "production";
const connectionVariable = isProduction ? "DB_URL_PROD" : "DB_URL_LOCAL";
const connectionString = process.env[connectionVariable];

if (!connectionString) {
  throw new Error(`❌ ${connectionVariable} environment variable is not set`);
}

if (!process.argv.includes("--confirm")) {
  throw new Error(
    "❌ This operation deletes all portfolio data. Re-run with --confirm to continue.",
  );
}

const tables = [
  "social_media",
  "hero_titles",
  "about_contact_info",
  "about_details",
  "service_items",
  "summary_jobs",
  "summary_experiences",
  "testimonial_items",
  "project_items",
  "header_sections",
  "hero_section",
  "about_section",
  "services_section",
  "summary_section",
  "testimonials_section",
  "projects_section",
  "contact_section",
  "sidebar",
  "general_settings",
  "footer",
  "config",
  "header_settings",
  "footer_section",
] as const;

const client = postgres(connectionString, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

async function clearDatabase() {
  console.log("⚠️ Clearing all portfolio data...");

  try {
    await client.unsafe(
      `TRUNCATE TABLE ${tables.map((table) => `"${table}"`).join(", ")} RESTART IDENTITY CASCADE`,
    );
    console.log(`✅ Cleared ${tables.length} portfolio tables.`);
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

clearDatabase();
