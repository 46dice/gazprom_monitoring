import type { ColumnDTO } from "@/shared/dto/columnDto";
import { normalizeText } from "@/shared/lib/text";
import type { ColumnGroup } from "./types";

export class ColumnGroupModel {
  /** Группа — всё, у чего в шапке есть подстолбец; порядок — как в файле. */
  mapDtoToGroups(dtos: ColumnDTO[]): ColumnGroup[] {
    const groups = new Map<string, ColumnGroup>();

    for (const dto of dtos) {
      if (dto.header_sub === null) continue;

      const group = groups.get(dto.header_group) ?? {
        id: dto.header_group,
        title: dto.header_group,
        subColumns: [],
      };
      group.subColumns.push({ id: dto.key, title: dto.header_sub });
      groups.set(group.id, group);
    }

    return [...groups.values()];
  }

  /**
   * Совпало название группы — показываем её целиком;
   * совпали только подстолбцы — группу с ними одними.
   */
  search(groups: ColumnGroup[], query: string): ColumnGroup[] {
    const needle = normalizeText(query);
    if (!needle) return groups;

    return groups.flatMap((group) => {
      if (normalizeText(group.title).includes(needle)) return [group];

      const subColumns = group.subColumns.filter((sub) => normalizeText(sub.title).includes(needle));
      return subColumns.length ? [{ ...group, subColumns }] : [];
    });
  }

  toggleExpanded(expandedIds: string[], groupId: string): string[] {
    return expandedIds.includes(groupId)
      ? expandedIds.filter((id) => id !== groupId)
      : [...expandedIds, groupId];
  }

  /** Во время поиска найденное раскрыто всегда — иначе совпавший подстолбец не видно. */
  isExpanded(expandedIds: string[], groupId: string, query: string): boolean {
    return normalizeText(query) !== "" || expandedIds.includes(groupId);
  }
}
