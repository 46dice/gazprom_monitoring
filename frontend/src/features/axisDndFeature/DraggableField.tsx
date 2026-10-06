import type { ReactNode } from "react";
import { useDraggable } from "@dnd-kit/core";
import { IconGripVertical } from "@tabler/icons-react";
import { cn } from "@/shared/lib/utils";
import { dragId, type DragPayload } from "./types";

type Props = {
  payload: DragPayload;
  children: ReactNode;
  className?: string;
};

/** Делает любое поле перетаскиваемым: сам чип ничего не знает о drag-and-drop. */
export const DraggableField = ({ payload, children, className }: Props) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: dragId(payload), data: payload });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      aria-roledescription="перетаскиваемое поле"
      className={cn(
        "group/drag flex min-w-0 flex-1 cursor-grab items-center rounded-md hover:bg-muted active:cursor-grabbing",
        isDragging && "opacity-40",
        className,
      )}
    >
      <IconGripVertical size={14} className="shrink-0 text-muted-foreground/50 group-hover/drag:text-muted-foreground" aria-hidden />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
};
