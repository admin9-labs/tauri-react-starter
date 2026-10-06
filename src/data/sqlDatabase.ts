export type SqlValue = string | number | null;

export type SqlDatabase = {
  execute(
    query: string,
    bindValues?: SqlValue[],
  ): Promise<{ rowsAffected: number }>;
  select<Rows extends object[]>(
    query: string,
    bindValues?: SqlValue[],
  ): Promise<Rows>;
};
