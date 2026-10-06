import type { CellValue } from "@/shared/lib/types";
import type { ColumnDTO } from "./columnDto";

/** GET /api/dataset */
export interface DatasetDTO {
  /** mtime файла в миллисекундах. */
  version: number;
  file_name: string;
  columns: ColumnDTO[];
  /** Каждая строка — массив в порядке columns. */
  rows: CellValue[][];
}

/** data события dataset-changed в GET /api/dataset/events */
export interface DatasetVersionDTO {
  version: number;
}
