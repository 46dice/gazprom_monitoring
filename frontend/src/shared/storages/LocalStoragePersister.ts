import type { PersistStorage } from "./types";

/**
 * localStorage может быть недоступен (приватный режим, запрет сайта, переполнение) —
 * тогда приложение работает без сохранения, а не падает.
 */
export class LocalStoragePersister implements PersistStorage {
  getItem<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  setItem<T>(key: string, value: T) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Не сохранилось — настройки проживут до перезагрузки страницы.
    }
  }

  removeItem(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {
      // см. setItem
    }
  }
}
