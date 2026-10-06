import type { ColumnIndex, Row } from "@/shared/lib/types";
import type { ChartModel, SeriesDraft } from "../model/ChartModel";
import type {
  Aggregation,
  AxisField,
  AxisSlot,
  ChartConfig,
  ChartPoint,
  DropField,
  Series,
} from "../model/types";
import type { ChartsRepository } from "../repository/types";

/** Модель меняет конфиги, репозиторий сохраняет — каждое изменение сразу в хранилище. */
export class ChartsService {
  constructor(
    private readonly repository: ChartsRepository,
    private readonly model: ChartModel,
  ) {}

  getCharts(): ChartConfig[] {
    const stored = this.repository.load();
    return stored ? this.model.migrate(stored) : this.model.createPresets();
  }

  addChart(charts: ChartConfig[]): ChartConfig[] {
    return this.persist(this.model.add(charts));
  }

  removeChart(charts: ChartConfig[], chartId: string): ChartConfig[] {
    return this.persist(this.model.remove(charts, chartId));
  }

  resetChart(charts: ChartConfig[], chartId: string): ChartConfig[] {
    return this.persist(this.model.reset(charts, chartId));
  }

  renameChart(charts: ChartConfig[], chartId: string, title: string): ChartConfig[] {
    return this.persist(this.model.rename(charts, chartId, title));
  }

  setXAxis(charts: ChartConfig[], chartId: string, field: AxisField | null): ChartConfig[] {
    return this.persist(this.model.setXAxis(charts, chartId, field));
  }

  addSeries(charts: ChartConfig[], chartId: string, draft: SeriesDraft): ChartConfig[] {
    return this.persist(this.model.addSeries(charts, chartId, draft));
  }

  updateSeries(
    charts: ChartConfig[],
    chartId: string,
    seriesId: string,
    patch: Partial<Omit<Series, "id" | "colorSlot">>,
  ): ChartConfig[] {
    return this.persist(this.model.updateSeries(charts, chartId, seriesId, patch));
  }

  removeSeries(charts: ChartConfig[], chartId: string, seriesId: string): ChartConfig[] {
    return this.persist(this.model.removeSeries(charts, chartId, seriesId));
  }

  setXValues(charts: ChartConfig[], chartId: string, values: string[] | null, showOther: boolean): ChartConfig[] {
    return this.persist(this.model.setXValues(charts, chartId, values, showOther));
  }

  dropField(
    charts: ChartConfig[],
    chartId: string,
    slot: AxisSlot,
    field: DropField,
    aggregation?: Aggregation,
  ): ChartConfig[] {
    return this.persist(this.model.dropField(charts, chartId, slot, field, aggregation));
  }

  canDrop(chart: ChartConfig, field: DropField, slot: AxisSlot): boolean {
    return this.model.canDrop(chart, field, slot);
  }

  canAddSeries(chart: ChartConfig): boolean {
    return this.model.canAddSeries(chart);
  }

  getAggregations(columnId: string | null, isYear?: boolean): Aggregation[] {
    return this.model.getAggregations(columnId, isYear);
  }

  buildPoints(chart: ChartConfig, rows: readonly Row[], columnIndex: ColumnIndex): ChartPoint[] {
    return this.model.buildPoints(chart, rows, columnIndex);
  }

  getMissingColumns(chart: ChartConfig, columnIndex: ColumnIndex): string[] {
    return this.model.getMissingColumns(chart, columnIndex);
  }

  private persist(charts: ChartConfig[]): ChartConfig[] {
    this.repository.save(charts);
    return charts;
  }
}
