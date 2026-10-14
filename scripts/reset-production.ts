import "dotenv/config";
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline/promises";

const connectionString = process.env.DB_URL_PROD;

if (!connectionString) {
  throw new Error("❌ DB_URL_PROD environment variable is not set");
}

const baselineFile = resolve(__dirname, "..", "drizzle", "0000_baseline.sql");
const backupDir = resolve(__dirname, "..", "backups");
const skipBackup = process.argv.includes("--no-backup");
const databaseName = new URL(connectionString).pathname.slice(1);

// Drops every object in the public schema (tables, views, sequences, functions, types)
// instead of the schema itself, which managed hosts often do not let the app user recreate.
const resetSql = `
SET client_min_messages = warning;
DO $reset$
DECLARE
  item record;
BEGIN
  FOR item IN SELECT matviewname AS name FROM pg_matviews WHERE schemaname = 'public' LOOP
    EXECUTE format('DROP MATERIALIZED VIEW IF EXISTS public.%I CASCADE', item.name);
  END LOOP;
  FOR item IN SELECT viewname AS name FROM pg_views WHERE schemaname = 'public' LOOP
    EXECUTE format('DROP VIEW IF EXISTS public.%I CASCADE', item.name);
  END LOOP;
  FOR item IN SELECT tablename AS name FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE', item.name);
  END LOOP;
  FOR item IN SELECT sequencename AS name FROM pg_sequences WHERE schemaname = 'public' LOOP
    EXECUTE format('DROP SEQUENCE IF EXISTS public.%I CASCADE', item.name);
  END LOOP;
  FOR item IN
    SELECT p.oid::regprocedure AS signature
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    LEFT JOIN pg_depend d ON d.objid = p.oid AND d.deptype = 'e'
    WHERE n.nspname = 'public' AND d.objid IS NULL
  LOOP
    EXECUTE format('DROP ROUTINE IF EXISTS %s CASCADE', item.signature);
  END LOOP;
  FOR item IN
    SELECT t.typname AS name
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    LEFT JOIN pg_depend d ON d.objid = t.oid AND d.deptype = 'e'
    WHERE n.nspname = 'public' AND t.typtype IN ('e', 'd', 'c', 'r') AND d.objid IS NULL
      AND (t.typtype <> 'c' OR EXISTS (SELECT 1 FROM pg_class c WHERE c.oid = t.typrelid AND c.relkind = 'c'))
  LOOP
    EXECUTE format('DROP TYPE IF EXISTS public.%I CASCADE', item.name);
  END LOOP;
END
$reset$;
DROP SCHEMA IF EXISTS drizzle CASCADE;
`;

function run(command: string, args: string[], input?: string) {
  const result = spawnSync(command, args, {
    input,
    stdio: [input === undefined ? "inherit" : "pipe", "inherit", "inherit"],
    env: { ...process.env, NODE_NO_WARNINGS: "1" },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} exited with code ${result.status}`);
  }
}

async function confirmDatabaseName() {
  if (!process.stdin.isTTY) {
    throw new Error("❌ Run this from an interactive terminal so you can confirm the reset.");
  }
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await prompt.question(
      `\n⚠️ This deletes ALL tables and data (including admin accounts) in "${databaseName}" ` +
        `and recreates the schema from drizzle/0000_baseline.sql.\n` +
        `Type the database name to continue: `,
    );
    return answer.trim() === databaseName;
  } finally {
    prompt.close();
  }
}

async function resetProduction() {
  try {
    if (!(await confirmDatabaseName())) {
      console.log("Aborted; production was not changed.");
      return;
    }

    if (!skipBackup) {
      mkdirSync(backupDir, { recursive: true });
      const backupFile = resolve(
        backupDir,
        `${databaseName}-${new Date().toISOString().replace(/[:.]/g, "-")}.sql`,
      );
      console.log(`\n💾 Backing up production to ${backupFile}...`);
      run("pg_dump", ["--no-owner", "--no-privileges", "--file", backupFile, connectionString!]);
    }

    console.log("\n🧨 Dropping the existing schema and applying the baseline...");
    // One transaction: if any statement fails, nothing is dropped or created.
    run(
      "psql",
      [
        connectionString!,
        "--no-psqlrc",
        "--quiet",
        "--single-transaction",
        "--set",
        "ON_ERROR_STOP=1",
        "--file",
        "-",
        "--file",
        baselineFile,
      ],
      resetSql,
    );

    console.log("\n✅ Production schema recreated. Run `npm run db:sync:prod` to copy local content.");
  } catch (error) {
    console.error("\n❌ Production reset failed; no schema changes were committed:", error);
    process.exitCode = 1;
  }
}

resetProduction();
