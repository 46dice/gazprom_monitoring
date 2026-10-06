import type { ColumnGroupModel } from "../model/ColumnGroupModel";
import type { ColumnGroup } from "../model/types";
import type { ColumnGroupsRepository } from "../repository/types";

export class ColumnGroupsService {
  constructor(
    private readonly repository: ColumnGroupsRepository,
    private readonly model: ColumnGroupModel,
  ) {}

  async getGroups(): Promise<ColumnGroup[]> {
    return this.model.mapDtoToGroups(await this.repository.getColumns());
  }

  subscribeToChanges(onChange: () => void): () => void {
    return this.repository.subscribe(onChange);
  }

  search(groups: ColumnGroup[], query: string): ColumnGroup[] {
    return this.model.search(groups, query);
  }

  toggleExpanded(expandedIds: string[], groupId: string): string[] {
    return this.model.toggleExpanded(expandedIds, groupId);
  }

  isExpanded(expandedIds: string[], groupId: string, query: string): boolean {
    return this.model.isExpanded(expandedIds, groupId, query);
  }
}
