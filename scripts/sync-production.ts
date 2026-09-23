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
  "sidebar",
  "social_media",
  "general_settings",
  "hero_section",
  "hero_titles",
  "about_section",
  "about_contact_info",
  "about_details",
  "services_section",
  "service_items",
  "summary_section",
  "summary_jobs",
  "summary_experiences",
  "testimonials_section",
  "testimonial_items",
  "projects_section",
  "project_items",
  "contact_section",
  "footer",
  "config",
  "header_sections",
  "header_settings",
  "footer_section",
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
        await transaction.unsafe(
          `SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM ${quoteIdentifier(table)}`,
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
