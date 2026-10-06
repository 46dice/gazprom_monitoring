import { IconCalendar, IconLetterCase, IconNumber123, IconStack2 } from "@tabler/icons-react";
import { ColumnGroupItem } from "@/entities/column-group/ui/ColumnGroupItem";
import { SubColumnList } from "@/entities/column-group/ui/SubColumnList";
import type { ColumnGroup } from "@/entities/column-group/model/types";
import type { Column, DataType } from "@/entities/column/model/types";
import { ColumnChip } from "@/entities/column/ui/ColumnChip";
import { ColumnList } from "@/entities/column/ui/ColumnList";
import { DraggableField } from "@/features/axisDndFeature/DraggableField";
import { useDi } from "./di";

export type Section =
  | { kind: "group"; items: ColumnGroup[] }
  | { kind: DataType; items: Column[] };

const HEADERS = {
  group: { title: "Группы", Icon: IconStack2 },
  number: { title: "Числа", Icon: IconNumber123 },
  string: { title: "Строки", Icon: IconLetterCase },
  date: { title: "Даты", Icon: IconCalendar },
} as const;

/** Одна секция для всех видов полей — что рисовать, решает kind. */
export const FieldSection = ({ section }: { section: Section }) => {
  const { title, Icon } = HEADERS[section.kind];

  return (
    <section className="flex flex-col gap-1">
      <h3 className="flex items-center gap-1.5 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        <Icon size={14} aria-hidden />
        {title}
        <span className="ml-auto font-normal tabular-nums">{section.items.length}</span>
      </h3>
      {section.kind === "group" ? <GroupItems groups={section.items} /> : <ColumnItems columns={section.items} />}
    </section>
  );
};

const ColumnItems = ({ columns }: { columns: Column[] }) => (
  <ColumnList
    columns={columns}
    renderColumn={(column) => (
      <DraggableField payload={{ kind: "column", columnId: column.id, title: column.title }}>
        <ColumnChip column={column} />
      </DraggableField>
    )}
  />
);

const GroupItems = ({ groups }: { groups: ColumnGroup[] }) => {
  const { columnsById, isExpanded, toggleExpanded } = useDi();

  return (
    <div className="flex flex-col gap-1">
      {groups.map((group) => (
        <ColumnGroupItem
          key={group.id}
          group={group}
          expanded={isExpanded(group.id)}
          onToggle={() => toggleExpanded(group.id)}
          renderHeader={(header) => (
            <DraggableField payload={{ kind: "group", groupId: group.id, title: group.title }} className="hover:bg-transparent">
              {header}
            </DraggableField>
          )}
        >
          <SubColumnList
            items={group.subColumns}
            renderItem={(sub) => {
              const column = columnsById[sub.id];
              return column ? (
                <DraggableField payload={{ kind: "column", columnId: column.id, title: column.title }}>
                  <ColumnChip column={column} short />
                </DraggableField>
              ) : null;
            }}
          />
        </ColumnGroupItem>
      ))}
    </div>
  );
};
