import { useState } from "react";
import { IconTrash } from "@tabler/icons-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useDi } from "./di";

/** Удаление с подтверждением: настройки графика хранятся только в браузере и не восстанавливаются. */
export function RemoveChartFeature() {
  const { removeChart, title } = useDi();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon-sm" onClick={() => setOpen(true)} aria-label={`Удалить график «${title}»`} title="Удалить">
        <IconTrash />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить график?</DialogTitle>
            <DialogDescription>«{title}» и его настройки будут удалены.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={removeChart}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
