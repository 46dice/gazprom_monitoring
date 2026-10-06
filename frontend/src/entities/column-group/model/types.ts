/** Ссылка на подстолбец: id совпадает с Column.id сущности column. */
export interface SubColumnRef {
  id: string;
  /** Имя подстолбца («магистрали»). */
  title: string;
}

/** Столбец-родитель из двухуровневой шапки: «Марка стали» → магистрали / ответвления. */
export interface ColumnGroup {
  /** Название группы — уникально в шапке файла. */
  id: string;
  title: string;
  subColumns: SubColumnRef[];
}
