import { useState } from "react";
import { DataTypeIcon } from "@/entities/column/ui/DataTypeIcon";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { useDi } from "./di";
import type { DropTarget } from "./types";

type Props = {
  groupId: string;
  groupTitle: string;
  target: DropTarget;
  onClose: () => void;
};

/** Группу на ось целиком не кладём — выбирается ровно один подстолбец за раз. */
export const SubColumnPickerModal = ({ groupId, groupTitle, target, onClose }: Props) => {
  const { getSubColumnOptions, drop } = useDi();
  const options = getSubColumnOptions(groupId, target);
  const [columnId, setColumnId] = useState(() => options.find((o) => !o.disabled)?.id ?? "");

  const confirm = () => {
    if (!columnId) return;
    const title = options.find((o) => o.id === columnId)?.title ?? columnId;
    drop({ kind: "column", columnId, title }, target);
    onClose();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Выберите подстолбец</DialogTitle>
          <DialogDescription>
            {groupTitle} → ось {target.slot.toUpperCase()}
          </DialogDescription>
        </DialogHeader>

        <RadioGroup value={columnId} onValueChange={(value) => setColumnId(String(value))}>
          {options.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-2 text-sm has-disabled:cursor-not-allowed has-disabled:opacity-50"
            >
              <RadioGroupItem value={option.id} disabled={option.disabled} />
              <DataTypeIcon dataType={option.dataType} className="text-muted-foreground" />
              <span>{option.title}</span>
              {option.disabled && <span className="text-xs text-muted-foreground">— не количественный</span>}
            </label>
          ))}
        </RadioGroup>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={confirm} disabled={!columnId}>
            Добавить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
