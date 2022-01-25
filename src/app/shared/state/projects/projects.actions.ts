import {ProjectsModel} from "../../../models/projects.model";

export class SetMyProjects {
  static readonly type = '[Projects Query] Set My Projects';

  constructor(public readonly projects: ProjectsModel) {
  }
}
