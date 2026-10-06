/** Значение ячейки Excel после разбора на бэкенде; даты — строкой ISO (YYYY-MM-DD). */
export type CellValue = string | number | null;

/**
 * Строка таблицы — массив в порядке столбцов (так её отдаёт бэкенд).
 * Индекс столбца по ключу даёт ColumnIndex.
 */
export type Row = readonly CellValue[];

/** Ключ столбца («Группа / Подстолбец») → позиция в Row. */
export type ColumnIndex = Readonly<Record<string, number>>;
