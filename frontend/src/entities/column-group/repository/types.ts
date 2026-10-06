import type { ColumnDTO } from "@/shared/dto/columnDto";

export type ColumnGroupsRepository = {
  getColumns(): Promise<ColumnDTO[]>;
  subscribe(onChange: (version: number) => void): () => void;
};
