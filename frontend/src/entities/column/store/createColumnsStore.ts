import { createStore } from "zustand/vanilla";
import type { Column, DataType } from "../model/types";
import type { ColumnsService } from "../services/ColumnsService";

/**
 * Статус загрузки и ошибку не дублируем: столбцы приходят тем же запросом, что и строки,
 * их показывает стор dataset.
 */
export type ColumnsState = {
  columns: Column[];
  searchQuery: string;

  setSearchQuery: (query: string) => void;
  load: () => Promise<void>;
  start: () => () => void;
  /** Чистая функция: данные — аргументами, чтобы зависимости useMemo были честными. */
  getStandaloneByType: (columns: Column[], query: string) => Record<DataType, Column[]>;
};

export type ColumnsStoreDeps = { columnsService: ColumnsService };

export const createColumnsStore = ({ columnsService }: ColumnsStoreDeps) => {
  let requestId = 0;

  return createStore<ColumnsState>()((set, get) => ({
    columns: [],
    searchQuery: "",

    setSearchQuery: (searchQuery) => set({ searchQuery }),

    load: async () => {
      const id = ++requestId;
      try {
        const columns = await columnsService.getColumns();
        if (id === requestId) set({ columns });
      } catch {
        // Ошибку того же запроса показывает стор dataset; старые столбцы оставляем.
      }
    },

    start: () => {
      void get().load();
      return columnsService.subscribeToChanges(() => void get().load());
    },

    getStandaloneByType: (columns, query) => columnsService.getStandaloneByType(columns, query),
  }));
};
