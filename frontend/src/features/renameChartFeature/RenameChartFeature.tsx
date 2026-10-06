import { useState } from "react";
import { IconPencil } from "@tabler/icons-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useDi } from "./di";

/** Название графика, которое правится на месте: Enter или уход фокуса — сохранить, Esc — отменить. */
export function RenameChartFeature() {
  const { title, renameChart } = useDi();
  const [draft, setDraft] = useState<string | null>(null);

  if (draft !== null) {
    const save = () => {
      renameChart(draft);
      setDraft(null);
    };

    return (
      <Input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onFocus={(e) => e.target.select()}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") setDraft(null);
        }}
        aria-label="Название графика"
        maxLength={120}
        className="h-7 text-base font-medium"
      />
    );
  }

  return (
    <div className="group/title flex min-w-0 items-center gap-1">
      <button
        type="button"
        onClick={() => setDraft(title)}
        className="truncate rounded-sm text-left hover:underline focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        title={`${title} — нажмите, чтобы переименовать`}
      >
        {title}
      </button>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => setDraft(title)}
        aria-label={`Переименовать график «${title}»`}
        className="opacity-0 group-hover/title:opacity-100 focus-visible:opacity-100"
      >
        <IconPencil />
      </Button>
    </div>
  );
}
