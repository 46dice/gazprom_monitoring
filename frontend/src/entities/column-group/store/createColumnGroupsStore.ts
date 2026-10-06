import { createStore } from "zustand/vanilla";
import type { ColumnGroup } from "../model/types";
import type { ColumnGroupsService } from "../services/ColumnGroupsService";

/** Статус и ошибку показывает стор dataset — запрос общий. */
export type ColumnGroupsState = {
  groups: ColumnGroup[];
  /** Какие группы раскрыты «+». Id — название группы, переживает перечитывание файла. */
  expandedIds: string[];

  load: () => Promise<void>;
  start: () => () => void;
  toggleExpanded: (groupId: string) => void;
  /** Чистые функции: данные — аргументами. Поисковый запрос хранит стор column — передаёт страница. */
  getVisibleGroups: (groups: ColumnGroup[], query: string) => ColumnGroup[];
  isExpanded: (expandedIds: string[], groupId: string, query: string) => boolean;
};

export type ColumnGroupsStoreDeps = { columnGroupsService: ColumnGroupsService };

export const createColumnGroupsStore = ({ columnGroupsService }: ColumnGroupsStoreDeps) => {
  let requestId = 0;

  return createStore<ColumnGroupsState>()((set, get) => ({
    groups: [],
    expandedIds: [],

    load: async () => {
      const id = ++requestId;
      try {
        const groups = await columnGroupsService.getGroups();
        if (id === requestId) set({ groups });
      } catch {
        // См. стор dataset; старые группы оставляем.
      }
    },

    start: () => {
      void get().load();
      return columnGroupsService.subscribeToChanges(() => void get().load());
    },

    toggleExpanded: (groupId) =>
      set({ expandedIds: columnGroupsService.toggleExpanded(get().expandedIds, groupId) }),

    getVisibleGroups: (groups, query) => columnGroupsService.search(groups, query),

    isExpanded: (expandedIds, groupId, query) => columnGroupsService.isExpanded(expandedIds, groupId, query),
  }));
};
