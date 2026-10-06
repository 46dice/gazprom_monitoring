import type { FieldInfo } from "@/entities/chart/model/types";
import type { Column } from "@/entities/column/model/types";

/** Сущность chart не знает про column — страница передаёт ей только нужные признаки поля. */
export const toFieldInfo = (column: Column): FieldInfo => ({
  id: column.id,
  title: column.title,
  role: column.role,
  isYear: column.isYear,
  dataType: column.dataType,
});
