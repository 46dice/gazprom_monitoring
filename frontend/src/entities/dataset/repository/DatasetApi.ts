import type { DatasetSource } from "@/shared/api/DatasetSource";
import type { DatasetDTO } from "@/shared/dto/datasetDto";
import type { DatasetRepository } from "./types";

/** Общий DatasetSource: тот же запрос и то же SSE, что у column и column-group. */
export class DatasetApi implements DatasetRepository {
  constructor(private readonly source: DatasetSource) {}

  getDataset(): Promise<DatasetDTO> {
    return this.source.getDataset();
  }

  subscribe(onChange: (version: number) => void): () => void {
    return this.source.subscribe(onChange);
  }
}
