import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const isProduction = process.env.NODE_ENV === "production";
const connectionVariable = isProduction ? "DB_URL_PROD" : "DB_URL_LOCAL";
const connectionString = process.env[connectionVariable];

if (!connectionString) {
  throw new Error(
    `❌ ${connectionVariable} environment variable is not set`,
  );
}

// Parse the URL to log useful info
try {
  const url = new URL(connectionString);
  console.log(
    `📊 Connecting to PostgreSQL at ${url.hostname}:${url.port}`,
  );
  console.log(`📋 Database: ${url.pathname.slice(1)}`);
  console.log(`👤 User: ${url.username}`);
} catch (error) {
  console.error("❌ Invalid DB_URL format:", error);
  throw error;
}

// Create PostgreSQL client
const client = postgres(connectionString, {
  max: isProduction ? 1 : 10,
  idle_timeout: 20,
  connect_timeout: 10,
  onnotice: (notice) => {
    console.log("📝 PostgreSQL Notice:", notice.message);
  },
});

// Create Drizzle instance
export const db = drizzle(client, {
  schema,
  logger: !isProduction,
});

// Test connection helper
export async function testConnection() {
  try {
    await client`SELECT 1`;
    console.log("✅ Database connection successful!");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

export * from "./schema";
