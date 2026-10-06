import type { DatasetModel } from "../model/DatasetModel";
import type { CategoryValue, Dataset } from "../model/types";
import type { DatasetRepository } from "../repository/types";

export class DatasetService {
  constructor(
    private readonly repository: DatasetRepository,
    private readonly model: DatasetModel,
  ) {}

  async getDataset(): Promise<Dataset> {
    return this.model.mapDtoToDataset(await this.repository.getDataset());
  }

  subscribeToChanges(onChange: (version: number) => void): () => void {
    return this.repository.subscribe(onChange);
  }

  getCategoryValues(dataset: Dataset | null, columnKey: string, limit?: number): CategoryValue[] {
    return dataset ? this.model.getCategoryValues(dataset, columnKey, limit) : [];
  }
}
