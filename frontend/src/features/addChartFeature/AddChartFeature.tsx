import { IconPlus } from "@tabler/icons-react";
import { useDi } from "./di";

/** Серая плитка «+» на месте следующего графика — того же размера, что и карточка (ячейка сетки). */
export function AddChartFeature() {
  const { addChart } = useDi();

  return (
    <button
      type="button"
      onClick={addChart}
      className="flex h-full w-full items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      aria-label="Добавить график"
    >
      <IconPlus size={40} stroke={1.5} />
    </button>
  );
}
