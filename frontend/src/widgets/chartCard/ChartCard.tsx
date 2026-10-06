import { ChartView } from "@/entities/chart/ui/ChartView";
import { Card, CardContent, CardFooter } from "@/shared/ui/card";
import { ChartCardHeader } from "./ChartCardHeader";
import { ChartEmptyState } from "./ChartEmptyState";
import { useDi } from "./di";

/** Карточка одного графика. Данные и действия — из di, их раздаёт страница. */
export function ChartCard() {
  const { chart, points, xTitle, missingColumns, isRefreshing, titleSlot, headerActions, axisSlots } = useDi();
  const configured = chart.xAxis !== null && chart.yAxis.length > 0;

  return (
    <Card className="h-full gap-3">
      <ChartCardHeader title={chart.title} titleSlot={titleSlot} isRefreshing={isRefreshing} actions={headerActions} />

      <CardContent className="min-h-0 flex-1">
        {points.length === 0 ? (
          <ChartEmptyState reason={configured ? "no-data" : "not-configured"} />
        ) : (
          <ChartView points={points} series={chart.yAxis} />
        )}
      </CardContent>

      <CardFooter className="flex-col items-stretch gap-1 text-xs text-muted-foreground">
        {axisSlots ?? <span className="truncate">X: {xTitle ?? "—"}</span>}
        {missingColumns.length > 0 && (
          <span className="text-destructive">Нет в файле: {missingColumns.join(", ")}</span>
        )}
      </CardFooter>
    </Card>
  );
}
