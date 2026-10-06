import type { CategoryValue } from "@/entities/dataset/model/types";
import { createStrictContext } from "@/shared/lib/helpers/createStrictContext";
import { useStrictContext } from "@/shared/lib/hooks/useStrictContext";

/** Даёт страница для одного графика с текстовой осью X. */
export type XValuesDeps = {
  /** Подпись поля оси X. */
  title: string;
  /** Все значения столбца X с числом строк, самые частые первыми. Тяжело — звать при открытии окна. */
  getValues: () => CategoryValue[];
  /** Выбранные значения (нормализованные); null — автоматически топ самых частых. */
  selected: string[] | null;
  showOther: boolean;
  topCount: number;
  apply: (values: string[] | null, showOther: boolean) => void;
  /** Убрать поле с оси X. */
  remove: () => void;
};

export const xValuesInjector = createStrictContext<XValuesDeps>();
export const useDi = () => useStrictContext(xValuesInjector);
