import { useState, type ReactNode } from "react";
import { useStore, type StoreApi } from "zustand";
import { createStrictContext } from "@/shared/lib/helpers/createStrictContext";
import { useStrictContext } from "@/shared/lib/hooks/useStrictContext";
import { createChartsStore, type ChartsState, type ChartsStoreDeps } from "./createChartsStore";

const ChartsCtx = createStrictContext<StoreApi<ChartsState>>();

export const useChartsStore = <T,>(selector: (state: ChartsState) => T): T =>
  useStore(useStrictContext(ChartsCtx), selector);

export const createChartsProvider = (deps: ChartsStoreDeps) => {
  const ChartsProvider = ({ children }: { children: ReactNode }) => {
    const [store] = useState(() => createChartsStore(deps));
    return <ChartsCtx.Provider value={store}>{children}</ChartsCtx.Provider>;
  };

  return ChartsProvider;
};
