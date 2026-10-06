import type { ExampleRecord, ExampleRecordStatus } from "@/types/app";

export type ExampleRecordRow = {
  id: string;
  title: string;
  summary: string;
  status: string;
  created_at: string;
  updated_at: string;
};

function normalizeStatus(status: string): ExampleRecordStatus {
  if (status === "paused" || status === "archived") {
    return status;
  }
  return "active";
}

export function mapExampleRecordRow(row: ExampleRecordRow): ExampleRecord {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    status: normalizeStatus(row.status),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
