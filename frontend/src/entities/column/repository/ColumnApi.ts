import type { DatasetSource } from "@/shared/api/DatasetSource";
import type { ColumnDTO } from "@/shared/dto/columnDto";
import type { ColumnsRepository } from "./types";

/** Своей ручки у столбцов нет — берём их из общего ответа GET /api/dataset. */
export class ColumnApi implements ColumnsRepository {
  constructor(private readonly source: DatasetSource) {}

  async getColumns(): Promise<ColumnDTO[]> {
    const { columns } = await this.source.getDataset();
    return columns;
  }

  subscribe(onChange: (version: number) => void): () => void {
    return this.source.subscribe(onChange);
  }
}
