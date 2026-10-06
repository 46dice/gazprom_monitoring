import { IconSum } from "@tabler/icons-react";
import { COUNT_LABEL } from "@/entities/chart/model/labels";
import { DraggableField } from "@/features/axisDndFeature/DraggableField";
import { FieldSearchFeature } from "@/features/fieldSearchFeature/FieldSearchFeature";
import { useDi } from "./di";
import { FieldSection, type Section } from "./FieldSection";

/** Панель «Поля»: поиск, «Количество строк» и секции по видам полей. Пустые секции скрыты. */
export function FieldsPanel() {
  const { groups, standaloneByType, isSearching } = useDi();

  const sections: Section[] = [
    { kind: "group" as const, items: groups },
    { kind: "number" as const, items: standaloneByType.number },
    { kind: "string" as const, items: standaloneByType.string },
    // В файле все даты — подстолбцы группы, поэтому секция обычно пустая и скрыта.
    { kind: "date" as const, items: standaloneByType.date },
  ].filter((section) => section.items.length > 0);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="px-1 text-sm font-semibold">Поля</h2>
      <FieldSearchFeature />

      {!isSearching && (
        <DraggableField payload={{ kind: "count", title: COUNT_LABEL }} className="border border-dashed border-border">
          <div className="flex items-center gap-2 px-2 py-1 text-sm">
            <IconSum size={16} className="text-primary" aria-hidden />
            {COUNT_LABEL}
            <span className="ml-auto text-xs text-muted-foreground">только Y</span>
          </div>
        </DraggableField>
      )}

      {sections.length > 0 ? (
        sections.map((section) => <FieldSection key={section.kind} section={section} />)
      ) : (
        <p className="px-1 text-sm text-muted-foreground">Ничего не найдено</p>
      )}
    </div>
  );
}
