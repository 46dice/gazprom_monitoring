import { useDatasetStore } from "@/entities/dataset/store/DatasetProvider";
import { Spinner } from "@/shared/ui/spinner";

const dateFormat = new Intl.DateTimeFormat("ru-RU", { dateStyle: "short", timeStyle: "short" });

export function Header() {
  const meta = useDatasetStore((s) => s.dataset?.meta);
  const isRefreshing = useDatasetStore((s) => s.isRefreshing);
  const error = useDatasetStore((s) => s.error);
  const hasData = useDatasetStore((s) => s.dataset !== null);

  return (
    <header className="border-b">
      <div className="flex items-center gap-4 px-4 py-3">

        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          {isRefreshing && (
            <>
              <Spinner className="size-3.5" />
              <span>Файл изменён, обновляем…</span>
            </>
          )}
          {/* Ошибка при уже загруженных данных: старые графики на экране, предупреждение — здесь. */}
          {hasData && error && <span className="text-destructive">Не удалось обновить: {error}</span>}
          {meta && (
            <span title={`${meta.rowCount.toLocaleString("ru-RU")} строк`}>
              {meta.fileName} · изменён {dateFormat.format(meta.updatedAt)}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
