import "dotenv/config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";

const isProduction = process.env.NODE_ENV === "production";
const connectionVariable = isProduction ? "DB_URL_PROD" : "DB_URL_LOCAL";
const connectionString = process.env[connectionVariable];

if (!connectionString) {
  throw new Error(`❌ ${connectionVariable} environment variable is not set`);
}

const upgradeFile = resolve(__dirname, "sql", "upgrade-section-config.sql");

const client = postgres(connectionString, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
  onnotice: () => {},
});

async function upgradeDatabase() {
  console.log(`⬆️ Upgrading schema using ${connectionVariable}...`);

  try {
    // The file wraps everything in BEGIN/COMMIT, so a failure rolls back.
    await client.unsafe(readFileSync(upgradeFile, "utf8"));
    console.log("✅ Schema upgraded. Section settings now live in page_sections.config.");
  } catch (error) {
    console.error("❌ Upgrade failed; no changes were applied:", error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

upgradeDatabase();
