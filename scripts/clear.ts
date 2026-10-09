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

// Keep authentication data intact when clearing portfolio content.
// RESTART IDENTITY also resets the generated identity sequences.
const portfolioTables = [
  "social_links",
  "hero_titles",
  "contact_methods",
  "profile_facts",
  "services",
  "experiences",
  "skills",
  "testimonials",
  "project_roles",
  "project_technologies",
  "projects",
  "technologies",
  "hero_section",
  "about_section",
  "experience_section",
  "contact_section",
  "page_sections",
  "profile",
  "site_config",
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
      `TRUNCATE TABLE ${portfolioTables
        .map((table) => `"${table}"`)
        .join(", ")} RESTART IDENTITY CASCADE`,
    );
    console.log(
      `✅ Cleared ${portfolioTables.length} portfolio tables and reset identity sequences.`,
    );
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

clearDatabase();
