import { useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

const MIN_WIDTH = 240;
const MAX_WIDTH = 640;
const DEFAULT_WIDTH = 288;
const KEY_STEP = 16;

const clamp = (width: number) => Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, width));

/**
 * Боковая панель, ширину которой тянут мышью за правый край — длинные названия полей
 * перестают обрезаться. Двойной клик — ширина по умолчанию, стрелки — с клавиатуры.
 */
export function ResizableSidebar({ children }: { children: ReactNode }) {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);

  const startResize = (event: ReactPointerEvent) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = width;
    setIsResizing(true);
    // Курсор и запрет выделения — на всю страницу, пока тянут: мышь уходит за пределы разделителя.
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMove = (e: PointerEvent) => setWidth(clamp(startWidth + e.clientX - startX));
    const onUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") setWidth((w) => clamp(w + KEY_STEP));
    if (event.key === "ArrowLeft") setWidth((w) => clamp(w - KEY_STEP));
  };

  return (
    <aside className="sticky top-4 shrink-0" style={{ width }}>
      <div className="max-h-[calc(100vh-6rem)] overflow-y-auto rounded-xl border border-border bg-card p-3">{children}</div>

      {/* Разделитель стоит в зазоре между панелью и графиками. */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Ширина панели полей"
        aria-valuenow={width}
        aria-valuemin={MIN_WIDTH}
        aria-valuemax={MAX_WIDTH}
        tabIndex={0}
        onPointerDown={startResize}
        onDoubleClick={() => setWidth(DEFAULT_WIDTH)}
        onKeyDown={onKeyDown}
        title="Потяните, чтобы изменить ширину. Двойной клик — по умолчанию"
        className="group absolute top-0 -right-3 flex h-full w-3 cursor-col-resize justify-center focus-visible:outline-none"
      >
        <span
          className={`h-full w-0.5 rounded-full transition-colors group-hover:bg-primary/60 group-focus-visible:bg-primary ${isResizing ? "bg-primary" : "bg-transparent"}`}
        />
      </div>
    </aside>
  );
}
