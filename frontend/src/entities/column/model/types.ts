export type DataType = "number" | "string" | "date";

/** Измерение — группировать по нему (ось X); мера — агрегировать (ось Y). */
export type ColumnRole = "dimension" | "measure";

export interface Column {
  /** Ключ из шапки Excel («Группа / Подстолбец») — на него ссылаются конфиги графиков. */
  id: string;
  /** Полное название для подписей вне группы. */
  title: string;
  /** Короткое: подстолбец внутри группы («магистрали»), иначе — как title. */
  shortTitle: string;
  group: string;
  /** null — столбец сам по себе, не подстолбец группы. */
  sub: string | null;
  dataType: DataType;
  role: ColumnRole;
  /** Год («Год выпуска», «Год ввода…»): на Y — среднее/мин/макс, без суммы (сумма годов бессмысленна). */
  isYear: boolean;
}
