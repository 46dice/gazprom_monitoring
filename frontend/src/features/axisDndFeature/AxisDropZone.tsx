import type { ReactNode } from "react";
import { useDndContext, useDroppable } from "@dnd-kit/core";
import { cn } from "@/shared/lib/utils";
import { useDi } from "./di";
import type { DragPayload, DropTarget } from "./types";

type Props = {
  target: DropTarget;
  /** Что уже лежит на оси (чипы полей/линий). */
  children?: ReactNode;
  placeholder: string;
};

const SLOT_LABEL = { x: "X", y: "Y" } as const;

/** Слот оси. Во время перетаскивания подсвечивается: можно сюда — рамка цвета primary, нельзя — приглушён. */
export const AxisDropZone = ({ target, children, placeholder }: Props) => {
  const { canAccept } = useDi();
  const { active } = useDndContext();
  const { setNodeRef, isOver } = useDroppable({ id: `${target.chartId}:${target.slot}`, data: target });

  const payload = active?.data.current as DragPayload | undefined;
  const accepts = payload ? canAccept(payload, target) : null;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-8 w-full flex-wrap items-center gap-1 rounded-md border border-dashed border-border px-1.5 py-1 transition-colors",
        accepts === true && "border-primary bg-primary/5",
        accepts === true && isOver && "bg-primary/15",
        accepts === false && "opacity-40",
      )}
    >
      <span className="w-4 shrink-0 text-center text-xs font-semibold text-muted-foreground">{SLOT_LABEL[target.slot]}</span>
      {children ?? <span className="text-xs text-muted-foreground">{placeholder}</span>}
    </div>
  );
};
