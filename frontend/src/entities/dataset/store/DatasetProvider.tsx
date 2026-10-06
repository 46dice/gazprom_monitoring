import { useEffect, useState, type ReactNode } from "react";
import { useStore, type StoreApi } from "zustand";
import { createStrictContext } from "@/shared/lib/helpers/createStrictContext";
import { useStrictContext } from "@/shared/lib/hooks/useStrictContext";
import { createDatasetStore, type DatasetState, type DatasetStoreDeps } from "./createDatasetStore";

const DatasetCtx = createStrictContext<StoreApi<DatasetState>>();

export const useDatasetStore = <T,>(selector: (state: DatasetState) => T): T =>
  useStore(useStrictContext(DatasetCtx), selector);

export const createDatasetProvider = (deps: DatasetStoreDeps) => {
  const DatasetProvider = ({ children }: { children: ReactNode }) => {
    // Стор создаётся один раз на жизнь провайдера.
    const [store] = useState(() => createDatasetStore(deps));

    // Загрузка и подписка на SSE; отписка закрывает соединение, если подписчиков не осталось.
    useEffect(() => store.getState().start(), [store]);

    return <DatasetCtx.Provider value={store}>{children}</DatasetCtx.Provider>;
  };

  return DatasetProvider;
};
