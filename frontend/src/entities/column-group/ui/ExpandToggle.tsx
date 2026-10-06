import { IconMinus, IconPlus } from "@tabler/icons-react";
import { Button } from "@/shared/ui/button";

type Props = {
  expanded: boolean;
  onToggle: () => void;
  /** Для скринридера: «Марка стали». */
  label: string;
};

/** «+» / «−» слева от группы. Отдельная кнопка, а не часть ручки перетаскивания — клик не начинает drag. */
export const ExpandToggle = ({ expanded, onToggle, label }: Props) => {
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-label={`${expanded ? "Свернуть" : "Раскрыть"} подстолбцы: ${label}`}
    >
      {expanded ? <IconMinus /> : <IconPlus />}
    </Button>
  );
};
