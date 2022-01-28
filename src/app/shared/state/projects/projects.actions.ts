import { ProjectCollectionModel } from "../../../models/project_collection.model";

export class SetMyProjects {
  static readonly type = '[Projects Query] Set My Projects';

  constructor(public readonly projects: ProjectCollectionModel) {
  }
}
