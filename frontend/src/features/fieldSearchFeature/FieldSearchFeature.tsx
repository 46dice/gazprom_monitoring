import { IconSearch, IconX } from "@tabler/icons-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useDi } from "./di";

export function FieldSearchFeature() {
  const { query, setQuery } = useDi();

  return (
    <div className="relative">
      <IconSearch size={16} className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && setQuery("")}
        placeholder="Найти поле…"
        aria-label="Поиск по полям"
        className="pr-8 pl-8"
      />
      {query && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setQuery("")}
          aria-label="Очистить поиск"
          className="absolute top-1/2 right-1 -translate-y-1/2"
        >
          <IconX />
        </Button>
      )}
    </div>
  );
}
