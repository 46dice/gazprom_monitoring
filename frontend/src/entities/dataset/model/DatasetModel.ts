import type { DatasetDTO } from "@/shared/dto/datasetDto";
import type { ColumnIndex } from "@/shared/lib/types";
import { normalizeText } from "@/shared/lib/text";
import type { CategoryValue, Dataset } from "./types";

export class DatasetModel {
  mapDtoToDataset(dto: DatasetDTO): Dataset {
    const columnIndex: ColumnIndex = Object.fromEntries(
      dto.columns.map((column, index) => [column.key, index]),
    );

    return {
      meta: {
        fileName: dto.file_name,
        version: dto.version,
        updatedAt: new Date(dto.version),
        rowCount: dto.rows.length,
      },
      rows: dto.rows,
      columnIndex,
    };
  }

  /**
   * Различные значения строкового столбца, самые частые — первыми.
   * Варианты написания («Годен» / «годен») склеиваются в одно значение.
   */
  getCategoryValues(dataset: Dataset, columnKey: string, limit = 50): CategoryValue[] {
    const index = dataset.columnIndex[columnKey];
    if (index === undefined) return [];

    const groups = new Map<string, { count: number; spellings: Map<string, number> }>();
    for (const row of dataset.rows) {
      // Число в текстовом столбце — тоже значение (марка стали «20» записана в Excel числом).
      const cell = typeof row[index] === "number" ? String(row[index]) : row[index];
      if (typeof cell !== "string" || !cell.trim()) continue;

      const key = normalizeText(cell);
      const group = groups.get(key) ?? { count: 0, spellings: new Map<string, number>() };
      group.count += 1;
      group.spellings.set(cell, (group.spellings.get(cell) ?? 0) + 1);
      groups.set(key, group);
    }

    return [...groups.entries()]
      .map(([value, { count, spellings }]) => ({ value, label: mostFrequent(spellings), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
}

function mostFrequent(counts: Map<string, number>): string {
  let best = "";
  let bestCount = -1;
  for (const [text, count] of counts) {
    if (count > bestCount) {
      best = text;
      bestCount = count;
    }
  }
  return best;
}
