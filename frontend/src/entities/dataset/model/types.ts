import type { ColumnIndex, Row } from "@/shared/lib/types";

export interface DatasetMeta {
  fileName: string;
  /** mtime файла в миллисекундах — по нему же сверяется событие SSE. */
  version: number;
  /** Когда файл последний раз сохраняли (из version). */
  updatedAt: Date;
  rowCount: number;
}

export interface Dataset {
  meta: DatasetMeta;
  rows: Row[];
  columnIndex: ColumnIndex;
}

/** Значение категории для фильтра линии («Подземный», «Годен» …). */
export interface CategoryValue {
  /** Нормализованный ключ — по нему фильтруем. */
  value: string;
  /** Самое частое написание в файле — его показываем. */
  label: string;
  count: number;
}
