import type { AppMetadata } from "@/types/app";

type AppMetadataRow = {
  key: string;
  value: string;
  updated_at: string;
};

export function mapAppMetadataRow(row: AppMetadataRow): AppMetadata {
  return {
    key: row.key,
    value: row.value,
    updatedAt: row.updated_at,
  };
}
