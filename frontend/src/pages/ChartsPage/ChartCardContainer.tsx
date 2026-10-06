import { useMemo } from "react";
import { TOP_CATEGORIES } from "@/entities/chart/model/types";
import { useChartsStore } from "@/entities/chart/store/ChartsProvider";
import { useColumnsStore } from "@/entities/column/store/ColumnsProvider";
import { useDatasetStore } from "@/entities/dataset/store/DatasetProvider";
import { ChartView } from "@/entities/chart/ui/ChartView";
import { AxisDropZone } from "@/features/axisDndFeature/AxisDropZone";
import { expandChartInjector } from "@/features/expandChartFeature/di";
import { ExpandChartFeature } from "@/features/expandChartFeature/ExpandChartFeature";
import { AxisFieldChip } from "@/features/axisDndFeature/AxisFieldChip";
import { renameChartInjector } from "@/features/renameChartFeature/di";
import { RenameChartFeature } from "@/features/renameChartFeature/RenameChartFeature";
import { removeChartInjector } from "@/features/removeChartFeature/di";
import { RemoveChartFeature } from "@/features/removeChartFeature/RemoveChartFeature";
import { resetChartInjector } from "@/features/resetChartFeature/di";
import { ResetChartFeature } from "@/features/resetChartFeature/ResetChartFeature";
import { seriesConfigInjector, type SeriesConfigDeps } from "@/features/seriesConfigFeature/di";
import { SeriesConfigFeature } from "@/features/seriesConfigFeature/SeriesConfigFeature";
import { xValuesInjector, type XValuesDeps } from "@/features/xValuesFeature/di";
import { XValuesFeature } from "@/features/xValuesFeature/XValuesFeature";
import { ChartCard } from "@/widgets/chartCard/ChartCard";
import { chartCardInjector, type ChartCardDeps } from "@/widgets/chartCard/di";

type Props = { chartId: string };

/** Соединяет конфиг графика (chart), строки (dataset) и столбцы (column) и раздаёт их виджету и фичам. */
export function ChartCardContainer({ chartId }: Props) {
  const chart = useChartsStore((s) => s.charts.find((c) => c.id === chartId));
  const buildPoints = useChartsStore((s) => s.buildPoints);
  const getMissingColumns = useChartsStore((s) => s.getMissingColumns);
  const removeChart = useChartsStore((s) => s.removeChart);
  const renameChart = useChartsStore((s) => s.renameChart);
  const resetChart = useChartsStore((s) => s.resetChart);
  const setXAxis = useChartsStore((s) => s.setXAxis);
  const updateSeries = useChartsStore((s) => s.updateSeries);
  const removeSeries = useChartsStore((s) => s.removeSeries);
  const setXValues = useChartsStore((s) => s.setXValues);

  const dataset = useDatasetStore((s) => s.dataset);
  const isRefreshing = useDatasetStore((s) => s.isRefreshing);
  const getCategoryValues = useDatasetStore((s) => s.getCategoryValues);
  const columns = useColumnsStore((s) => s.columns);

  // ~30 тыс. строк: пересчёт только при смене конфига или версии файла.
  const points = useMemo(
    () => (chart && dataset ? buildPoints(chart, dataset.rows, dataset.columnIndex) : []),
    [chart, dataset, buildPoints],
  );
  const missingColumns = useMemo(
    () => (chart && dataset ? getMissingColumns(chart, dataset.columnIndex) : []),
    [chart, dataset, getMissingColumns],
  );

  const seriesDeps = useMemo<SeriesConfigDeps>(
    () => ({
      filterColumns: columns.filter((c) => c.dataType === "string").map((c) => ({ id: c.id, title: c.title })),
      getCategoryValues: (columnId) => getCategoryValues(dataset, columnId),
      updateSeries: (seriesId, patch) => updateSeries(chartId, seriesId, patch),
      removeSeries: (seriesId) => removeSeries(chartId, seriesId),
    }),
    [columns, dataset, getCategoryValues, updateSeries, removeSeries, chartId],
  );

  const xAxis = chart?.xAxis ?? null;
  // Текстовое поле на X — столбики с выбором значений; годы и числа — линия, выбирать нечего.
  const xIsText = xAxis !== null && columns.find((c) => c.id === xAxis.columnId)?.dataType === "string";
  const xValuesDeps = useMemo<XValuesDeps | null>(
    () =>
      xAxis && xIsText
        ? {
            title: xAxis.columnId,
            getValues: () => getCategoryValues(dataset, xAxis.columnId, Infinity),
            selected: xAxis.values ?? null,
            showOther: xAxis.showOther !== false,
            topCount: TOP_CATEGORIES,
            apply: (values, showOther) => setXValues(chartId, values, showOther),
            remove: () => setXAxis(chartId, null),
          }
        : null,
    [chartId, xAxis, xIsText, dataset, getCategoryValues, setXValues, setXAxis],
  );

  if (!chart) return null;

  const xTitle = chart.xAxis ? `${chart.xAxis.columnId}${chart.xAxis.grain === "year" ? " (по годам)" : ""}` : null;

  const deps: ChartCardDeps = {
    chart,
    points,
    xTitle,
    missingColumns,
    isRefreshing,
    titleSlot: (
      <renameChartInjector.Provider value={{ title: chart.title, renameChart: (title) => renameChart(chart.id, title) }}>
        <RenameChartFeature />
      </renameChartInjector.Provider>
    ),
    headerActions: (
      <>
        <expandChartInjector.Provider
          value={{
            title: chart.title,
            canExpand: points.length > 0,
            renderChart: () => <ChartView points={points} series={chart.yAxis} size="full" />,
          }}
        >
          <ExpandChartFeature />
        </expandChartInjector.Provider>
        <resetChartInjector.Provider value={{ resetChart: () => resetChart(chart.id), isPreset: chart.presetId !== null }}>
          <ResetChartFeature />
        </resetChartInjector.Provider>
        <removeChartInjector.Provider value={{ removeChart: () => removeChart(chart.id), title: chart.title }}>
          <RemoveChartFeature />
        </removeChartInjector.Provider>
      </>
    ),
    axisSlots: (
      <seriesConfigInjector.Provider value={seriesDeps}>
        <AxisDropZone target={{ chartId: chart.id, slot: "x" }} placeholder="Перетащите поле — одно">
          {xValuesDeps ? (
            <xValuesInjector.Provider value={xValuesDeps}>
              <XValuesFeature />
            </xValuesInjector.Provider>
          ) : (
            xTitle && <AxisFieldChip title={xTitle} onRemove={() => setXAxis(chart.id, null)} />
          )}
        </AxisDropZone>
        <AxisDropZone target={{ chartId: chart.id, slot: "y" }} placeholder="Перетащите числовое поле или «Количество строк»">
          {chart.yAxis.length > 0 && chart.yAxis.map((s) => <SeriesConfigFeature key={s.id} series={s} />)}
        </AxisDropZone>
      </seriesConfigInjector.Provider>
    ),
  };

  return (
    <chartCardInjector.Provider value={deps}>
      <ChartCard />
    </chartCardInjector.Provider>
  );
}
