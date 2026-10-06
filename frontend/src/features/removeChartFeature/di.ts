import { createStrictContext } from "@/shared/lib/helpers/createStrictContext";
import { useStrictContext } from "@/shared/lib/hooks/useStrictContext";

export type RemoveChartDeps = { removeChart: () => void; title: string };

export const removeChartInjector = createStrictContext<RemoveChartDeps>();
export const useDi = () => useStrictContext(removeChartInjector);
