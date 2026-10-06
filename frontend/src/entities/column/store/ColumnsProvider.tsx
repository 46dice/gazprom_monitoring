import { useEffect, useState, type ReactNode } from "react";
import { useStore, type StoreApi } from "zustand";
import { createStrictContext } from "@/shared/lib/helpers/createStrictContext";
import { useStrictContext } from "@/shared/lib/hooks/useStrictContext";
import { createColumnsStore, type ColumnsState, type ColumnsStoreDeps } from "./createColumnsStore";

const ColumnsCtx = createStrictContext<StoreApi<ColumnsState>>();

export const useColumnsStore = <T,>(selector: (state: ColumnsState) => T): T =>
  useStore(useStrictContext(ColumnsCtx), selector);

export const createColumnsProvider = (deps: ColumnsStoreDeps) => {
  const ColumnsProvider = ({ children }: { children: ReactNode }) => {
    const [store] = useState(() => createColumnsStore(deps));

    useEffect(() => store.getState().start(), [store]);

    return <ColumnsCtx.Provider value={store}>{children}</ColumnsCtx.Provider>;
  };

  return ColumnsProvider;
};
