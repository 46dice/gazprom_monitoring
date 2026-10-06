import { createStrictContext } from "@/shared/lib/helpers/createStrictContext";
import { useStrictContext } from "@/shared/lib/hooks/useStrictContext";

export type AddChartDeps = { addChart: () => void };

export const addChartInjector = createStrictContext<AddChartDeps>();
export const useDi = () => useStrictContext(addChartInjector);
