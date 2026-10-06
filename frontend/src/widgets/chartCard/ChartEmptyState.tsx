import { IconChartLine } from "@tabler/icons-react";

type Props = { reason: "not-configured" | "no-data" };

const TEXT: Record<Props["reason"], string> = {
  "not-configured": "Перетащите поле на ось X и хотя бы одно — на ось Y",
  "no-data": "Для выбранных полей в файле нет данных",
};

export const ChartEmptyState = ({ reason }: Props) => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
      <IconChartLine size={28} aria-hidden />
      <p className="max-w-64">{TEXT[reason]}</p>
    </div>
  );
};
