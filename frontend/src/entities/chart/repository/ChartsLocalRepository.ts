import type { PersistStorage } from "@/shared/storages/types";
import type { ChartConfig } from "../model/types";
import type { ChartsRepository } from "./types";

const KEY = "charts";
/** Поднять при несовместимом изменении ChartConfig — старые конфиги тогда не читаются. */
const VERSION = 1;

type Stored = { version: number; charts: ChartConfig[] };

/** Конфиги графиков хранятся только в браузере: бэкенд их не хранит. */
export class ChartsLocalRepository implements ChartsRepository {
  constructor(private readonly storage: PersistStorage) {}

  load(): ChartConfig[] | null {
    const stored = this.storage.getItem<Stored>(KEY);
    return stored?.version === VERSION && Array.isArray(stored.charts) ? stored.charts : null;
  }

  save(charts: ChartConfig[]) {
    this.storage.setItem<Stored>(KEY, { version: VERSION, charts });
  }
}
