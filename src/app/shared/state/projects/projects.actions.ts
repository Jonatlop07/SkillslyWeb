import { ProjectCollectionModel } from "../../../models/project_collection.model";

export class SetMyProjects {
  static readonly type = '[Projects Query] Set My Projects';

  constructor(public readonly projects: ProjectCollectionModel) {
  }
}
export class DeleteMyProject {
  static readonly type = '[Projects Query] Delete My Project';

  constructor(public readonly project_id: string) {
  }
}
