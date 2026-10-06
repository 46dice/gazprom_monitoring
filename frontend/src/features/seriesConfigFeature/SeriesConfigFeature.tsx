import { useMemo, useState } from "react";
import type { Series } from "@/entities/chart/model/types";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { useDi, type SeriesPatch } from "./di";
import { SeriesChip } from "./SeriesChip";

const NO_FILTER = "__none__";

type Props = { series: Series };

export function SeriesConfigFeature({ series }: Props) {
  const { removeSeries } = useDi();
  const [open, setOpen] = useState(false);

  return (
    <>
      <SeriesChip series={series} onEdit={() => setOpen(true)} onRemove={() => removeSeries(series.id)} />
      {open && <SeriesConfigDialog series={series} onClose={() => setOpen(false)} />}
    </>
  );
}

function SeriesConfigDialog({ series, onClose }: { series: Series; onClose: () => void }) {
  const { filterColumns, getCategoryValues, updateSeries } = useDi();

  const [label, setLabel] = useState(series.label);
  const [labelTouched, setLabelTouched] = useState(false);
  const [filterColumnId, setFilterColumnId] = useState(series.filter?.columnId ?? NO_FILTER);
  const [filterValue, setFilterValue] = useState(series.filter?.value ?? "");

  const categoryValues = useMemo(
    () => (filterColumnId === NO_FILTER ? [] : getCategoryValues(filterColumnId)),
    [filterColumnId, getCategoryValues],
  );

  const save = () => {
    const value = categoryValues.find((v) => v.value === filterValue);
    const patch: SeriesPatch = {
      filter: filterColumnId !== NO_FILTER && value ? { columnId: filterColumnId, value: value.value, label: value.label } : null,
      // Подпись не трогали — модель пересоберёт её из фильтра.
      ...(labelTouched && { label }),
    };
    updateSeries(series.id, patch);
    onClose();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      {/* Названия столбцов длинные («Местонахождение / Подземный, надземный») — окно шире стандартного. */}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Настройка</DialogTitle>
          <DialogDescription>{series.columnId ?? "Количество строк"}</DialogDescription>
        </DialogHeader>

        {/* minmax(0,1fr): без него селект с длинным значением распирает окно. */}
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-3 text-sm">
          <label htmlFor="series-label" className="text-muted-foreground">
            Название
          </label>
          <Input
            id="series-label"
            value={label}
            onChange={(e) => {
              setLabel(e.target.value);
              setLabelTouched(true);
            }}
          />

          <span className="text-muted-foreground">Считать только строки, где</span>
          <Select
            items={[{ value: NO_FILTER, label: "Все строки" }, ...filterColumns.map((c) => ({ value: c.id, label: c.title }))]}
            value={filterColumnId}
            onValueChange={(v) => {
              setFilterColumnId(String(v ?? NO_FILTER));
              setFilterValue("");
            }}
          >
            {/* id столбца — его полное название: показываем целиком при наведении, если обрезано. */}
            <SelectTrigger className="w-full min-w-0" title={filterColumnId === NO_FILTER ? undefined : filterColumnId}>
              <SelectValue className="block min-w-0 truncate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_FILTER}>Все строки</SelectItem>
              {filterColumns.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {filterColumnId !== NO_FILTER && (
            <>
              <span className="text-muted-foreground">равно</span>
              <Select
                items={categoryValues.map((v) => ({ value: v.value, label: `${v.label} (${v.count.toLocaleString("ru-RU")})` }))}
                value={filterValue || null}
                onValueChange={(v) => setFilterValue(String(v ?? ""))}
              >
                <SelectTrigger className="w-full min-w-0">
                  <SelectValue placeholder="Выберите значение" className="block min-w-0 truncate" />
                </SelectTrigger>
                <SelectContent>
                  {categoryValues.map((v) => (
                    <SelectItem key={v.value} value={v.value}>
                      {v.label} ({v.count.toLocaleString("ru-RU")})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={save} disabled={filterColumnId !== NO_FILTER && !filterValue}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
