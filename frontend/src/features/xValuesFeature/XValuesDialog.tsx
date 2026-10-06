import { useMemo, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { normalizeText } from "@/shared/lib/text";
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
import { useDi } from "./di";

/** Какие значения текстовой оси X показывать столбиками; остальные — «Прочие» или скрыть. */
export function XValuesDialog({ onClose }: { onClose: () => void }) {
  const { title, getValues, selected, showOther: initialShowOther, topCount, apply } = useDi();

  // Список считается по всем строкам файла — один раз на открытие окна.
  const values = useMemo(() => getValues(), [getValues]);
  const top = useMemo(() => values.slice(0, topCount).map((v) => v.value), [values, topCount]);

  // auto — «топ самых частых»: сохраняется как null, и топ пересчитается, если файл изменится.
  const [auto, setAuto] = useState(selected === null);
  const [checked, setChecked] = useState(() => new Set(selected ?? top));
  const [showOther, setShowOther] = useState(initialShowOther);
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const needle = normalizeText(query);
    return needle ? values.filter((v) => v.value.includes(needle)) : values;
  }, [values, query]);

  const choose = (next: Set<string>, isAuto = false) => {
    setChecked(next);
    setAuto(isAuto);
  };

  const toggle = (value: string) => {
    const next = new Set(checked);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    choose(next);
  };

  const save = () => {
    apply(auto ? null : values.filter((v) => checked.has(v.value)).map((v) => v.value), showOther);
    onClose();
  };

  const nothingToShow = !auto && checked.size === 0 && !showOther;

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Значения оси X</DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>

        <div className="relative">
          <IconSearch size={16} className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Найти значение…" aria-label="Поиск значения" className="pl-8" />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-sm">
          <Button variant={auto ? "secondary" : "outline"} size="sm" onClick={() => choose(new Set(top), true)}>
            Топ-{topCount}
          </Button>
          <Button variant="outline" size="sm" onClick={() => choose(new Set(values.map((v) => v.value)))}>
            Все
          </Button>
          <Button variant="outline" size="sm" onClick={() => choose(new Set())}>
            Снять все
          </Button>
          <span className="ml-auto text-xs text-muted-foreground tabular-nums">
            выбрано {checked.size} из {values.length}
          </span>
        </div>

        <ul className="-mx-1 max-h-72 overflow-y-auto" aria-label="Значения">
          {visible.map((v) => (
            <li key={v.value}>
              <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-sm hover:bg-muted">
                <input type="checkbox" className="size-4 shrink-0 accent-primary" checked={checked.has(v.value)} onChange={() => toggle(v.value)} />
                <span className="min-w-0 flex-1 truncate" title={v.label}>
                  {v.label}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{v.count.toLocaleString("ru-RU")}</span>
              </label>
            </li>
          ))}
          {visible.length === 0 && <li className="px-1 py-2 text-sm text-muted-foreground">Ничего не найдено</li>}
        </ul>

        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" className="size-4 accent-primary" checked={showOther} onChange={(e) => setShowOther(e.target.checked)} />
          Остальные показать одним столбиком «Прочие»
        </label>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={save} disabled={nothingToShow}>
            Применить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
