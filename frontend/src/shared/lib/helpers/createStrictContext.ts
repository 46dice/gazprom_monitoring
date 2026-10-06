import { createContext } from "react";

/** Контекст без значения по умолчанию: читать его можно только через useStrictContext. */
export const createStrictContext = <T>() => createContext<T | null>(null);
