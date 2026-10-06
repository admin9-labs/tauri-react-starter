export type AppMetadata = {
  key: string;
  value: string;
  updatedAt: string;
};

export type ExampleRecordStatus = "active" | "paused" | "archived";

export type ExampleRecord = {
  id: string;
  title: string;
  summary: string;
  status: ExampleRecordStatus;
  createdAt: string;
  updatedAt: string;
};
