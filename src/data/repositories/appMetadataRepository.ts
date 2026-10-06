import { getDatabase } from "@/data/connection";
import type { SqlDatabase } from "@/data/sqlDatabase";
import { mapAppMetadataRow } from "@/data/mappers/appMetadataMapper";
import type { AppMetadata } from "@/types/app";

type AppMetadataRow = Parameters<typeof mapAppMetadataRow>[0];

export class AppMetadataRepository {
  constructor(
    private readonly databaseFactory: () => Promise<SqlDatabase> = getDatabase,
  ) {}

  async list(): Promise<AppMetadata[]> {
    const database = await this.databaseFactory();
    const rows = await database.select<AppMetadataRow[]>(
      "SELECT key, value, updated_at FROM app_metadata ORDER BY key ASC",
    );

    return rows.map(mapAppMetadataRow);
  }
}
