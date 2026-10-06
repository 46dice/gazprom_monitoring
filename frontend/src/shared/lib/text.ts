/**
 * Ключ для сравнения строк: в Excel одно и то же значение пишут по-разному
 * («Годен», «годен», «Годен »). Показываем исходное написание, сравниваем — по ключу.
 */
export const normalizeText = (value: string): string => value.trim().replace(/\s+/g, " ").toLowerCase();
