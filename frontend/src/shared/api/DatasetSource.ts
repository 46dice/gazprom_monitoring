import type { DatasetDTO, DatasetVersionDTO } from "@/shared/dto/datasetDto";
import type { HttpClient } from "./HttpClient";

type VersionListener = (version: number) => void;

/**
 * Единственный источник данных Excel на всё приложение.
 * Бэкенд отдаёт столбцы и строки одним ответом, а читают его три сущности
 * (column, column-group, dataset) — поэтому запрос и SSE-соединение здесь общие.
 */
export class DatasetSource {
  private cache: DatasetDTO | null = null;
  private pending: Promise<DatasetDTO> | null = null;
  /** Последняя версия, о которой мы знаем: из ответа или из SSE. */
  private knownVersion: number | null = null;
  private readonly listeners = new Set<VersionListener>();
  private events: EventSource | null = null;

  constructor(
    private readonly http: HttpClient,
    private readonly endpoint = "dataset",
  ) {}

  getDataset(): Promise<DatasetDTO> {
    if (this.cache && this.cache.version === this.knownVersion) {
      return Promise.resolve(this.cache);
    }

    // Три репозитория просят данные одновременно — запрос один (~0,6 МБ gzip).
    this.pending ??= this.http
      .get<DatasetDTO>(this.endpoint)
      .then((dataset) => {
        this.cache = dataset;
        this.knownVersion = dataset.version;
        return dataset;
      })
      .finally(() => {
        this.pending = null;
      });

    return this.pending;
  }

  /** Подписка на изменение файла. Соединение открывается с первым подписчиком и закрывается с последним. */
  subscribe(listener: VersionListener): () => void {
    this.listeners.add(listener);
    this.open();

    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) this.close();
    };
  }

  private open() {
    if (this.events) return;

    // Переподключение после обрыва EventSource делает сам; сервер сразу пришлёт текущую версию.
    this.events = new EventSource(this.http.url(`${this.endpoint}/events`));
    this.events.addEventListener("dataset-changed", (event) => {
      const { version } = JSON.parse(event.data) as DatasetVersionDTO;

      // Первое событие после подключения обычно совпадает с уже загруженной версией.
      // Сравниваем на неравенство, а не «больше»: файл могут заменить копией со старым mtime.
      if (version === this.knownVersion) return;

      this.knownVersion = version;
      this.listeners.forEach((listener) => listener(version));
    });
  }

  private close() {
    this.events?.close();
    this.events = null;
  }
}
