import { createStrictContext } from "@/shared/lib/helpers/createStrictContext";
import { useStrictContext } from "@/shared/lib/hooks/useStrictContext";

export type ResetChartDeps = {
  resetChart: () => void;
  /** Стартовый график — к пресету, свой — очистить оси. Влияет только на подпись. */
  isPreset: boolean;
};

export const resetChartInjector = createStrictContext<ResetChartDeps>();
export const useDi = () => useStrictContext(resetChartInjector);
