import { IconX } from "@tabler/icons-react";
import { Button } from "@/shared/ui/button";

type Props = {
  title: string;
  onRemove: () => void;
};

/** Поле, лежащее на оси X, с кнопкой «убрать». */
export const AxisFieldChip = ({ title, onRemove }: Props) => {
  return (
    <span className="inline-flex min-w-0 max-w-full items-center gap-1 rounded-md bg-muted py-0.5 pr-0.5 pl-2 text-xs">
      <span className="truncate" title={title}>
        {title}
      </span>
      <Button variant="ghost" size="icon-xs" onClick={onRemove} aria-label={`Убрать с оси: ${title}`}>
        <IconX />
      </Button>
    </span>
  );
};
