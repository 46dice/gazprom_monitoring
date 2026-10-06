import { useState } from "react";
import { IconArrowsMaximize } from "@tabler/icons-react";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { useDi } from "./di";

/** График в окне почти на весь экран — когда в карточке не читаются подписи и значения. */
export function ExpandChartFeature() {
  const { title, canExpand, renderChart } = useDi();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setOpen(true)}
        disabled={!canExpand}
        aria-label={`Развернуть график «${title}» на весь экран`}
        title="Развернуть на весь экран"
      >
        <IconArrowsMaximize />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-[90vh] w-[95vw] flex-col sm:max-w-[95vw]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {/* Recharts тянется по высоте родителя — у контейнера она должна быть явной. */}
          <div className="min-h-0 flex-1">{open && renderChart()}</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
