import { IconX } from "@tabler/icons-react";
import type { Series } from "@/entities/chart/model/types";
import { Button } from "@/shared/ui/button";

type Props = {
  series: Series;
  onEdit: () => void;
  onRemove: () => void;
};

/** Линия на оси Y: цвет — короткой чертой (как в легенде), текст — цветом темы, не линии. */
export const SeriesChip = ({ series, onEdit, onRemove }: Props) => {
  return (
    <span className="inline-flex min-w-0 max-w-full items-center rounded-md bg-muted text-xs">
      <button
        type="button"
        onClick={onEdit}
        className="flex min-w-0 items-center gap-1.5 rounded-md py-1 pl-2 hover:underline focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        title={`Настроить: ${series.label}`}
      >
        <span className="h-0.5 w-3 shrink-0 rounded-full" style={{ background: `var(--series-${series.colorSlot})` }} aria-hidden />
        <span className="truncate">{series.label}</span>
      </button>
      <Button variant="ghost" size="icon-xs" onClick={onRemove} aria-label={`Удалить линию: ${series.label}`}>
        <IconX />
      </Button>
    </span>
  );
};
