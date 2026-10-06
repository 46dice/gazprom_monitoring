import { useState, type ReactNode } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { IconGripVertical } from "@tabler/icons-react";
import { useDi } from "./di";
import { SubColumnPickerModal } from "./SubColumnPickerModal";
import type { DragPayload, DropTarget } from "./types";

type Picker = { groupId: string; groupTitle: string; target: DropTarget };

const ANNOUNCEMENTS = {
  onDragStart: () => "Поле взято. Перенесите его на ось X или Y графика.",
  onDragOver: () => "",
  onDragEnd: ({ over }: { over: unknown }) => (over ? "Поле добавлено на ось." : "Перетаскивание отменено."),
  onDragCancel: () => "Перетаскивание отменено.",
};

/** Общий DndContext для панели полей и всех графиков: тянут слева, бросают в карточку. */
export function AxisDndProvider({ children }: { children: ReactNode }) {
  const { canAccept, drop } = useDi();
  const [active, setActive] = useState<DragPayload | null>(null);
  const [picker, setPicker] = useState<Picker | null>(null);

  // distance: клик по «+» группы или по чипу не должен начинать перетаскивание.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  );

  const onDragStart = (event: DragStartEvent) => setActive(event.active.data.current as DragPayload);

  const onDragEnd = ({ active: dragged, over }: DragEndEvent) => {
    setActive(null);
    const payload = dragged.data.current as DragPayload | undefined;
    const target = over?.data.current as DropTarget | undefined;
    if (!payload || !target || !canAccept(payload, target)) return;

    if (payload.kind === "group") {
      setPicker({ groupId: payload.groupId, groupTitle: payload.title, target });
      return;
    }
    drop(payload, target);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActive(null)}
      accessibility={{
        announcements: ANNOUNCEMENTS,
        screenReaderInstructions: { draggable: "Пробел — взять поле, стрелки — переместить, пробел — положить, Esc — отмена." },
      }}
    >
      {children}

      <DragOverlay dropAnimation={null}>
        {active && (
          <div className="flex items-center gap-1 rounded-md border border-border bg-popover px-2 py-1 text-sm shadow-md">
            <IconGripVertical size={14} className="text-muted-foreground" aria-hidden />
            {active.title}
          </div>
        )}
      </DragOverlay>

      {picker && <SubColumnPickerModal {...picker} onClose={() => setPicker(null)} />}
    </DndContext>
  );
}
