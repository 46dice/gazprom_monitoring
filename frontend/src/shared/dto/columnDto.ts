export type DataTypeDTO = "number" | "string" | "date";

/** Столбец Excel, как его отдаёт GET /api/dataset. */
export interface ColumnDTO {
  /** «Группа / Подстолбец» или просто «Группа» — стабилен при вставке столбцов в файл. */
  key: string;
  header_group: string;
  header_sub: string | null;
  data_type: DataTypeDTO;
}
