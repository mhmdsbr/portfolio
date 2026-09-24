import "dotenv/config";
import postgres from "postgres";

const isProduction = process.env.NODE_ENV === "production";
const connectionVariable = isProduction ? "DB_URL_PROD" : "DB_URL_LOCAL";
const connectionString = process.env[connectionVariable];

if (!connectionString) {
  throw new Error(`❌ ${connectionVariable} environment variable is not set`);
}

const client = postgres(connectionString, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

async function setupDatabase() {
  try {
    await client`CREATE SCHEMA IF NOT EXISTS public`;
    console.log("✅ PostgreSQL public schema is ready.");
  } catch (error) {
    console.error("❌ Failed to create the PostgreSQL public schema:", error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

setupDatabase();
