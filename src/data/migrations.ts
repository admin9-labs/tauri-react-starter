export const DATABASE_URL = "sqlite:desktop-starter.db";

export type MigrationDescriptor = {
  version: number;
  description: string;
};

export const migrationDescriptors = [
  {
    version: 1,
    description: "create_app_metadata",
  },
  {
    version: 2,
    description: "create_example_records",
  },
] as const satisfies readonly MigrationDescriptor[];
