import type { ColumnModel } from "../model/ColumnModel";
import type { Column, DataType } from "../model/types";
import type { ColumnsRepository } from "../repository/types";

export class ColumnsService {
  constructor(
    private readonly repository: ColumnsRepository,
    private readonly model: ColumnModel,
  ) {}

  async getColumns(): Promise<Column[]> {
    return this.model.mapDtoToColumns(await this.repository.getColumns());
  }

  subscribeToChanges(onChange: () => void): () => void {
    return this.repository.subscribe(onChange);
  }

  /** Столбцы вне групп, найденные по запросу, — по секциям «Числа / Строки / Даты». */
  getStandaloneByType(columns: Column[], query: string): Record<DataType, Column[]> {
    return this.model.groupByType(this.model.search(this.model.getStandalone(columns), query));
  }
}
