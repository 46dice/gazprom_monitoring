import { useState } from "react";
import { IconAdjustmentsHorizontal, IconX } from "@tabler/icons-react";
import { Button } from "@/shared/ui/button";
import { useDi } from "./di";
import { XValuesDialog } from "./XValuesDialog";

/** Чип текстового поля на оси X: клик — выбрать значения, ✕ — убрать поле с оси. */
export function XValuesFeature() {
  const { title, selected, topCount, remove } = useDi();
  const [open, setOpen] = useState(false);
  const badge = selected === null ? `топ-${topCount}` : `выбрано ${selected.length}`;

  return (
    <>
      <span className="inline-flex min-w-0 max-w-full items-center rounded-md bg-muted text-xs">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex min-w-0 items-center gap-1.5 rounded-md py-1 pl-2 hover:underline focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          title={`${title} — выбрать значения`}
        >
          <IconAdjustmentsHorizontal size={14} className="shrink-0 text-muted-foreground" aria-hidden />
          <span className="truncate">{title}</span>
          <span className="shrink-0 text-muted-foreground">· {badge}</span>
        </button>
        <Button variant="ghost" size="icon-xs" onClick={remove} aria-label={`Убрать с оси: ${title}`}>
          <IconX />
        </Button>
      </span>
      {open && <XValuesDialog onClose={() => setOpen(false)} />}
    </>
  );
}
