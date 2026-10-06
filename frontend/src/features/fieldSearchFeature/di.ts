import { createStrictContext } from "@/shared/lib/helpers/createStrictContext";
import { useStrictContext } from "@/shared/lib/hooks/useStrictContext";

export type FieldSearchDeps = {
  query: string;
  setQuery: (query: string) => void;
};

export const fieldSearchInjector = createStrictContext<FieldSearchDeps>();
export const useDi = () => useStrictContext(fieldSearchInjector);
