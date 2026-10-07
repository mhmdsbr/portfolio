import "dotenv/config";
import postgres, { type ParameterOrJSON } from "postgres";

const localConnectionString = process.env.DB_URL_LOCAL;
const productionConnectionString = process.env.DB_URL_PROD;

if (!localConnectionString) {
  throw new Error("❌ DB_URL_LOCAL environment variable is not set");
}

if (!productionConnectionString) {
  throw new Error("❌ DB_URL_PROD environment variable is not set");
}

if (!process.argv.includes("--confirm")) {
  throw new Error(
    "❌ This replaces all production portfolio data. Re-run with --confirm to continue.",
  );
}

const tables = [
  "page_sections",
  "sidebar",
  "portfolio_profile",
  "social_links",
  "site_settings",
  "hero_section",
  "hero_titles",
  "about_section",
  "contact_methods",
  "profile_facts",
  "services",
  "experience_section",
  "experiences",
  "skills",
  "testimonials",
  "projects",
  "project_roles",
  "technologies",
  "project_technologies",
  "contact_section",
  "footer",
  "app_config",
  "header_settings",
] as const;

const quoteIdentifier = (identifier: string) =>
  `"${identifier.replaceAll('"', '""')}"`;

const localClient = postgres(localConnectionString, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

const productionClient = postgres(productionConnectionString, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

async function syncProduction() {
  console.log("⚠️ Replacing production portfolio data with local data...");

  try {
    const tableRows = await Promise.all(
      tables.map(async (table) => ({
        table,
        rows: await localClient.unsafe<Record<string, unknown>[]>(
          `SELECT * FROM ${quoteIdentifier(table)}`,
        ),
      })),
    );

    await productionClient.begin(async (transaction) => {
      await transaction.unsafe(
        `TRUNCATE TABLE ${tables.map(quoteIdentifier).join(", ")} RESTART IDENTITY CASCADE`,
      );

      for (const { table, rows } of tableRows) {
        if (rows.length === 0) continue;

        const columns = Object.keys(rows[0]);
        const columnList = columns.map(quoteIdentifier).join(", ");
        const placeholders = rows
          .map(
            (_, rowIndex) =>
              `(${columns
                .map((_, columnIndex) => `$${rowIndex * columns.length + columnIndex + 1}`)
                .join(", ")})`,
          )
          .join(", ");
        const values = rows.flatMap((row) =>
          columns.map((column) => row[column]),
        ) as ParameterOrJSON<never>[];

        await transaction.unsafe(
          `INSERT INTO ${quoteIdentifier(table)} (${columnList}) VALUES ${placeholders}`,
          values,
        );
      }

      for (const table of tables) {
        const [{ sequence }] = await transaction<{ sequence: string | null }[]>`
          SELECT pg_get_serial_sequence(${table}, 'id') AS sequence
        `;
        if (!sequence) continue;
        await transaction.unsafe(
          `SELECT setval($1::regclass, COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM ${quoteIdentifier(table)}`,
          [sequence],
        );
      }
    });

    console.log(
      `✅ Production database synchronized (${tableRows.reduce((count, item) => count + item.rows.length, 0)} rows copied).`,
    );
  } catch (error) {
    console.error("❌ Error synchronizing production database:", error);
    process.exitCode = 1;
  } finally {
    await Promise.all([localClient.end(), productionClient.end()]);
  }
}

syncProduction();
