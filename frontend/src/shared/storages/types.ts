/** Хранилище «ключ → JSON». Реализацию выбирает composition root. */
export type PersistStorage = {
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
};
