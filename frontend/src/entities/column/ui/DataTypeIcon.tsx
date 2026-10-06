import { IconCalendar, IconLetterCase, IconNumber123 } from "@tabler/icons-react";
import type { DataType } from "../model/types";

const ICONS = {
  number: IconNumber123,
  string: IconLetterCase,
  date: IconCalendar,
} satisfies Record<DataType, unknown>;

const LABELS: Record<DataType, string> = {
  number: "Число",
  string: "Строка",
  date: "Дата",
};

type Props = { dataType: DataType; className?: string };

export const DataTypeIcon = ({ dataType, className }: Props) => {
  const Icon = ICONS[dataType];
  return <Icon className={className} size={16} aria-label={LABELS[dataType]} />;
};
