import { createStore } from "zustand/vanilla";
import type { CategoryValue, Dataset } from "../model/types";
import type { DatasetService } from "../services/DatasetService";

export type DatasetStatus = "idle" | "loading" | "ready" | "error";

export type DatasetState = {
  dataset: Dataset | null;
  status: DatasetStatus;
  /** Файл изменился, новые данные грузятся, а старые пока на экране (перечитывание ~10 с). */
  isRefreshing: boolean;
  error: string | null;

  load: () => Promise<void>;
  /** Загрузить и следить за файлом. Возвращает остановку — для useEffect провайдера. */
  start: () => () => void;
  /** Чистая функция: dataset — аргументом. limit не задан — 50 самых частых. */
  getCategoryValues: (dataset: Dataset | null, columnKey: string, limit?: number) => CategoryValue[];
};

export type DatasetStoreDeps = { datasetService: DatasetService };

export const createDatasetStore = ({ datasetService }: DatasetStoreDeps) => {
  // SSE может прислать несколько версий подряд — ответ более раннего запроса не должен затереть свежий.
  let requestId = 0;

  return createStore<DatasetState>()((set, get) => ({
    dataset: null,
    status: "idle",
    isRefreshing: false,
    error: null,

    load: async () => {
      const id = ++requestId;
      const hasData = get().dataset !== null;
      set(hasData ? { isRefreshing: true } : { status: "loading", error: null });

      try {
        const dataset = await datasetService.getDataset();
        if (id !== requestId) return;
        set({ dataset, status: "ready", isRefreshing: false, error: null });
      } catch (e) {
        if (id !== requestId) return;
        const error = e instanceof Error ? e.message : String(e);
        // Если данные уже были — оставляем их на экране и показываем ошибку рядом.
        set(hasData ? { isRefreshing: false, error } : { status: "error", error });
      }
    },

    start: () => {
      void get().load();
      return datasetService.subscribeToChanges(() => void get().load());
    },

    getCategoryValues: (dataset, columnKey, limit) => datasetService.getCategoryValues(dataset, columnKey, limit),
  }));
};
