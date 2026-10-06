import type { DatasetSource } from "@/shared/api/DatasetSource";
import type { ColumnDTO } from "@/shared/dto/columnDto";
import type { ColumnGroupsRepository } from "./types";

/** Группы строятся из шапки — тех же columns общего ответа GET /api/dataset. */
export class ColumnGroupApi implements ColumnGroupsRepository {
  constructor(private readonly source: DatasetSource) {}

  async getColumns(): Promise<ColumnDTO[]> {
    const { columns } = await this.source.getDataset();
    return columns;
  }

  subscribe(onChange: (version: number) => void): () => void {
    return this.source.subscribe(onChange);
  }
}
