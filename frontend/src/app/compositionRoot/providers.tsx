import type { ReactNode } from "react";
import { ChartModel } from "@/entities/chart/model/ChartModel";
import { ChartsLocalRepository } from "@/entities/chart/repository/ChartsLocalRepository";
import { ChartsService } from "@/entities/chart/services/ChartsService";
import { createChartsProvider } from "@/entities/chart/store/ChartsProvider";
import { ColumnGroupModel } from "@/entities/column-group/model/ColumnGroupModel";
import { ColumnGroupApi } from "@/entities/column-group/repository/ColumnGroupApi";
import { ColumnGroupsService } from "@/entities/column-group/services/ColumnGroupsService";
import { createColumnGroupsProvider } from "@/entities/column-group/store/ColumnGroupsProvider";
import { ColumnModel } from "@/entities/column/model/ColumnModel";
import { ColumnApi } from "@/entities/column/repository/ColumnApi";
import { ColumnsService } from "@/entities/column/services/ColumnsService";
import { createColumnsProvider } from "@/entities/column/store/ColumnsProvider";
import { DatasetModel } from "@/entities/dataset/model/DatasetModel";
import { DatasetApi } from "@/entities/dataset/repository/DatasetApi";
import { DatasetService } from "@/entities/dataset/services/DatasetService";
import { createDatasetProvider } from "@/entities/dataset/store/DatasetProvider";
import { DatasetSource } from "@/shared/api/DatasetSource";
import { HttpClient } from "@/shared/api/HttpClient";
import { LocalStoragePersister } from "@/shared/storages/LocalStoragePersister";

// Composition root: единственное место, где создаются экземпляры.
// /api проксирует Vite (vite.config.ts) — адреса бэкенда в коде нет.
const http = new HttpClient("/api");
// Один источник на три сущности: один запрос GET /api/dataset и одно SSE-соединение.
const datasetSource = new DatasetSource(http);
const storage = new LocalStoragePersister();

const DatasetProvider = createDatasetProvider({
  datasetService: new DatasetService(new DatasetApi(datasetSource), new DatasetModel()),
});
const ColumnsProvider = createColumnsProvider({
  columnsService: new ColumnsService(new ColumnApi(datasetSource), new ColumnModel()),
});
const ColumnGroupsProvider = createColumnGroupsProvider({
  columnGroupsService: new ColumnGroupsService(new ColumnGroupApi(datasetSource), new ColumnGroupModel()),
});
const ChartsProvider = createChartsProvider({
  chartsService: new ChartsService(new ChartsLocalRepository(storage), new ChartModel()),
});

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <DatasetProvider>
    <ColumnsProvider>
      <ColumnGroupsProvider>
        <ChartsProvider>{children}</ChartsProvider>
      </ColumnGroupsProvider>
    </ColumnsProvider>
  </DatasetProvider>
);
