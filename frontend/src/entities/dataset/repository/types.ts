import type { DatasetDTO } from "@/shared/dto/datasetDto";

export type DatasetRepository = {
  getDataset(): Promise<DatasetDTO>;
  /** Вызывает onChange, когда файл изменился. Возвращает отписку. */
  subscribe(onChange: (version: number) => void): () => void;
};
