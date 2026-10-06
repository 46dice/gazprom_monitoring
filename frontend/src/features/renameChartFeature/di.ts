import { createStrictContext } from "@/shared/lib/helpers/createStrictContext";
import { useStrictContext } from "@/shared/lib/hooks/useStrictContext";

export type RenameChartDeps = {
  title: string;
  /** Пустое название модель не примет — останется прежнее. */
  renameChart: (title: string) => void;
};

export const renameChartInjector = createStrictContext<RenameChartDeps>();
export const useDi = () => useStrictContext(renameChartInjector);
