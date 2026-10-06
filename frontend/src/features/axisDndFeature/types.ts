import type { AxisSlot } from "@/entities/chart/model/types";
import type { DataType } from "@/entities/column/model/types";

/** Что тянут из панели полей. title — для превью под курсором. */
export type DragPayload =
  | { kind: "column"; columnId: string; title: string }
  | { kind: "group"; groupId: string; title: string }
  | { kind: "count"; title: string };

/** Поле, которое можно положить сразу, без окна выбора подстолбца. */
export type DirectPayload = Exclude<DragPayload, { kind: "group" }>;

export type DropTarget = { chartId: string; slot: AxisSlot };

export type SubColumnOption = {
  id: string;
  title: string;
  dataType: DataType;
  /** Нельзя на эту ось (не мера для Y) — показываем, но выбрать нельзя. */
  disabled: boolean;
};

export const dragId = (payload: DragPayload): string =>
  payload.kind === "column" ? `column:${payload.columnId}` : payload.kind === "group" ? `group:${payload.groupId}` : "count";
