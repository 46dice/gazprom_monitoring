import { useEffect, useState, type ReactNode } from "react";
import { useStore, type StoreApi } from "zustand";
import { createStrictContext } from "@/shared/lib/helpers/createStrictContext";
import { useStrictContext } from "@/shared/lib/hooks/useStrictContext";
import {
  createColumnGroupsStore,
  type ColumnGroupsState,
  type ColumnGroupsStoreDeps,
} from "./createColumnGroupsStore";

const ColumnGroupsCtx = createStrictContext<StoreApi<ColumnGroupsState>>();

export const useColumnGroupsStore = <T,>(selector: (state: ColumnGroupsState) => T): T =>
  useStore(useStrictContext(ColumnGroupsCtx), selector);

export const createColumnGroupsProvider = (deps: ColumnGroupsStoreDeps) => {
  const ColumnGroupsProvider = ({ children }: { children: ReactNode }) => {
    const [store] = useState(() => createColumnGroupsStore(deps));

    useEffect(() => store.getState().start(), [store]);

    return <ColumnGroupsCtx.Provider value={store}>{children}</ColumnGroupsCtx.Provider>;
  };

  return ColumnGroupsProvider;
};
