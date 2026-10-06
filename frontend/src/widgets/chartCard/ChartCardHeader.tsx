import type { ReactNode } from "react";
import { CardAction, CardHeader, CardTitle } from "@/shared/ui/card";
import { Spinner } from "@/shared/ui/spinner";

type Props = {
  title: string;
  /** Заменяет простой текст заголовка (редактируемое название и т. п.). */
  titleSlot?: ReactNode;
  isRefreshing: boolean;
  actions?: ReactNode;
};

export const ChartCardHeader = ({ title, titleSlot, isRefreshing, actions }: Props) => {
  return (
    <CardHeader>
      <CardTitle className="flex min-w-0 items-center gap-2">
        {titleSlot ?? (
          <span className="truncate" title={title}>
            {title}
          </span>
        )}
        {isRefreshing && <Spinner className="size-3.5 shrink-0 text-muted-foreground" aria-label="Обновляем" />}
      </CardTitle>
      {actions && <CardAction className="flex gap-1">{actions}</CardAction>}
    </CardHeader>
  );
};
