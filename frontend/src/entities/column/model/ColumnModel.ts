import type { ColumnDTO } from "@/shared/dto/columnDto";
import { normalizeText } from "@/shared/lib/text";
import type { Column, ColumnRole, DataType } from "./types";

export class ColumnModel {
  mapDtoToColumns(dtos: ColumnDTO[]): Column[] {
    return dtos.map((dto) => ({
      id: dto.key,
      title: dto.key,
      shortTitle: dto.header_sub ?? dto.header_group,
      group: dto.header_group,
      sub: dto.header_sub,
      dataType: dto.data_type,
      role: roleOf(dto),
      isYear: isYearColumn(dto),
    }));
  }

  /** Столбцы вне групп — для секций «Числа / Строки / Даты». Подстолбцы показывает column-group. */
  getStandalone(columns: Column[]): Column[] {
    return columns.filter((column) => column.sub === null);
  }

  groupByType(columns: Column[]): Record<DataType, Column[]> {
    const result: Record<DataType, Column[]> = { number: [], string: [], date: [] };
    for (const column of columns) result[column.dataType].push(column);
    return result;
  }

  search(columns: Column[], query: string): Column[] {
    const needle = normalizeText(query);
    if (!needle) return columns;
    return columns.filter((column) => normalizeText(column.title).includes(needle));
  }
}

/**
 * Любое число — мера, его можно положить на Y. Годы («Год выпуска», «Год ввода в эксплуатацию») —
 * тоже: «средний / самый ранний / самый поздний год» осмысленны. Бессмысленна только сумма годов —
 * её убирает ChartModel.getAggregations по пометке isYear.
 */
function roleOf(dto: ColumnDTO): ColumnRole {
  return dto.data_type === "number" ? "measure" : "dimension";
}

/** Флаги «2021»…«2026» — не годы, а 1/пусто (их сумма — число обследованных). */
function isYearColumn(dto: ColumnDTO): boolean {
  // Не \b: в JS он понимает границу слова только для латиницы.
  return dto.data_type === "number" && /^год(\s|$)/iu.test(dto.header_group.trim());
}
