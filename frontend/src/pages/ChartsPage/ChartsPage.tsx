import { useChartsStore } from "@/entities/chart/store/ChartsProvider";
import { useDatasetStore } from "@/entities/dataset/store/DatasetProvider";
import { AddChartFeature } from "@/features/addChartFeature/AddChartFeature";
import { addChartInjector } from "@/features/addChartFeature/di";
import { ResizableSidebar } from "@/features/resizableSidebarFeature/ResizableSidebar";
import { Spinner } from "@/shared/ui/spinner";
import { TwoColumnGrid } from "@/shared/ui/TwoColumnGrid";
import { AxisDndContainer } from "./AxisDndContainer";
import { ChartCardContainer } from "./ChartCardContainer";
import { FieldsPanelContainer } from "./FieldsPanelContainer";

export function ChartsPage() {
  const charts = useChartsStore((s) => s.charts);
  const addChart = useChartsStore((s) => s.addChart);
  const status = useDatasetStore((s) => s.status);
  const error = useDatasetStore((s) => s.error);

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-sm text-muted-foreground">
        <Spinner />
        Загрузка данных из Excel…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-1 text-center text-sm">
        <p className="font-medium text-destructive">Не удалось загрузить данные</p>
        <p className="text-muted-foreground">{error}. Проверьте, что бэкенд запущен и файл на месте.</p>
      </div>
    );
  }

  return (
    // Один DndContext на панель и все графики: тянут слева, бросают в карточку.
    <AxisDndContainer>
      <div className="flex items-start gap-4">
        <ResizableSidebar>
          <FieldsPanelContainer />
        </ResizableSidebar>

        <section className="min-w-0 flex-1" aria-label="Графики">
          <TwoColumnGrid>
            {charts.map((chart) => (
              <ChartCardContainer key={chart.id} chartId={chart.id} />
            ))}
            {/* Последняя ячейка сетки — плитка «+» того же размера, что и график. */}
            <addChartInjector.Provider value={{ addChart }}>
              <AddChartFeature />
            </addChartInjector.Provider>
          </TwoColumnGrid>
        </section>
      </div>
    </AxisDndContainer>
  );
}
