import type { ColumnDTO } from "@/shared/dto/columnDto";

export type ColumnsRepository = {
  getColumns(): Promise<ColumnDTO[]>;
  subscribe(onChange: (version: number) => void): () => void;
};
