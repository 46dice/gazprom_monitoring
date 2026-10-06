import type { Series } from "@/entities/chart/model/types";
import type { CategoryValue } from "@/entities/dataset/model/types";
import { createStrictContext } from "@/shared/lib/helpers/createStrictContext";
import { useStrictContext } from "@/shared/lib/hooks/useStrictContext";

export type SeriesPatch = Partial<Pick<Series, "label" | "filter">>;

/** Даёт страница для одного графика: значения категорий — из dataset, изменения — в стор chart. */
export type SeriesConfigDeps = {
  /** Строковые столбцы, по значению которых можно сузить линию. */
  filterColumns: { id: string; title: string }[];
  getCategoryValues: (columnId: string) => CategoryValue[];
  updateSeries: (seriesId: string, patch: SeriesPatch) => void;
  removeSeries: (seriesId: string) => void;
};

export const seriesConfigInjector = createStrictContext<SeriesConfigDeps>();
export const useDi = () => useStrictContext(seriesConfigInjector);
