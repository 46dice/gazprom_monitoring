export type Aggregation = "count" | "sum" | "avg" | "min" | "max";

/** Как группировать значения оси X: дата → год. */
export type TimeGrain = "year";

export interface AxisField {
  columnId: string;
  grain?: TimeGrain;
  /**
   * Только для текстовой оси X: какие значения показывать (нормализованные, normalizeText).
   * null/нет — автоматически TOP_CATEGORIES самых частых.
   */
  values?: string[] | null;
  /** Невыбранные значения свернуть в один пункт «Прочие». По умолчанию — да. */
  showOther?: boolean;
  /**
   * Текстовое поле (категории → столбики). Ставится при броске по типу столбца, а не по ячейкам:
   * в «Марке стали» есть марки «20», записанные числом, — ось от этого не должна становиться числовой.
   * Нет (старые конфиги) — решается по большинству ячеек.
   */
  categorical?: boolean;
}

/** Сколько значений текстовой оси показывать, пока пользователь не выбрал сам. */
export const TOP_CATEGORIES = 15;

export interface SeriesFilter {
  columnId: string;
  /** Нормализованное значение (normalizeText) — по нему сравниваем. */
  value: string;
  /** Как показывать: «Годен». */
  label: string;
}

/** Линия на оси Y. */
export interface Series {
  id: string;
  /** null — «Количество» строк, иначе числовой столбец-мера. */
  columnId: string | null;
  aggregation: Aggregation;
  filter: SeriesFilter | null;
  /**
   * Свой столбец для оси X вместо общего — для графиков вида «Выпуск и ввод»:
   * обе линии по годам, но одна считает по «Году выпуска», другая — по «Году ввода».
   */
  xColumnId: string | null;
  label: string;
  /** Линия — год (средний/мин/макс год): без разделителя тысяч и шкала не от нуля. */
  isYear?: boolean;
  /** Номер цвета палитры 1…8. Закреплён за линией: соседние добавили/удалили — цвет не меняется. */
  colorSlot: number;
}

export interface ChartConfig {
  id: string;
  title: string;
  /** Ровно одно поле или ничего. */
  xAxis: AxisField | null;
  /** Несколько линий. */
  yAxis: Series[];
  /** Из какого стартового графика создан — для «сбросить». */
  presetId: string | null;
}

/** Что модели нужно знать о поле, без импорта сущности column. */
export interface FieldInfo {
  id: string;
  title: string;
  role: "dimension" | "measure";
  /** Год — на Y без «Суммы». */
  isYear?: boolean;
  dataType: "number" | "string" | "date";
}

/** Что бросили на ось: поле или виртуальная мера «Количество строк». */
export type DropField = FieldInfo | { kind: "count" };

export type AxisSlot = "x" | "y";

/**
 * Точка графика: x + значение каждой линии по её id; null — разрыв линии.
 * x-число (год, дата по годам) — линия; x-строка (завод, вид дефекта) — столбики.
 */
export type ChartPoint = { x: number | string; isOther?: boolean } & Record<string, number | string | boolean | null | undefined>;

/** Текстовая ось X → столбики; числа и годы → линия. */
export const isCategoricalPoints = (points: ChartPoint[]): boolean =>
  points.length > 0 && points.every((p) => typeof p.x === "string");

export const MAX_SERIES = 8;
