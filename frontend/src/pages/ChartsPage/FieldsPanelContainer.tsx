import { useMemo } from "react";
import { useColumnGroupsStore } from "@/entities/column-group/store/ColumnGroupsProvider";
import { useColumnsStore } from "@/entities/column/store/ColumnsProvider";
import { fieldSearchInjector } from "@/features/fieldSearchFeature/di";
import { FieldsPanel } from "@/widgets/fieldsPanel/FieldsPanel";
import { fieldsPanelInjector, type FieldsPanelDeps } from "@/widgets/fieldsPanel/di";

/** Поисковый запрос живёт в сторе column, группы фильтруются им же. */
export function FieldsPanelContainer() {
  const columns = useColumnsStore((s) => s.columns);
  const query = useColumnsStore((s) => s.searchQuery);
  const setQuery = useColumnsStore((s) => s.setSearchQuery);
  const getStandaloneByType = useColumnsStore((s) => s.getStandaloneByType);

  const allGroups = useColumnGroupsStore((s) => s.groups);
  const expandedIds = useColumnGroupsStore((s) => s.expandedIds);
  const getVisibleGroups = useColumnGroupsStore((s) => s.getVisibleGroups);
  const isExpanded = useColumnGroupsStore((s) => s.isExpanded);
  const toggleExpanded = useColumnGroupsStore((s) => s.toggleExpanded);

  const standaloneByType = useMemo(() => getStandaloneByType(columns, query), [columns, query, getStandaloneByType]);
  const groups = useMemo(() => getVisibleGroups(allGroups, query), [allGroups, query, getVisibleGroups]);
  const columnsById = useMemo(() => Object.fromEntries(columns.map((c) => [c.id, c])), [columns]);

  const deps = useMemo<FieldsPanelDeps>(
    () => ({
      groups,
      standaloneByType,
      columnsById,
      isExpanded: (groupId) => isExpanded(expandedIds, groupId, query),
      toggleExpanded,
      isSearching: query.trim() !== "",
    }),
    [groups, standaloneByType, columnsById, isExpanded, toggleExpanded, query, expandedIds],
  );

  return (
    <fieldSearchInjector.Provider value={{ query, setQuery }}>
      <fieldsPanelInjector.Provider value={deps}>
        <FieldsPanel />
      </fieldsPanelInjector.Provider>
    </fieldSearchInjector.Provider>
  );
}
