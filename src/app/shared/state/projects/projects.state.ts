import { Action, State, StateContext, StateToken } from "@ngxs/store";
import { Injectable } from '@angular/core'
import { ProjectCollectionModel } from "../../../models/project_collection.model";
import { SetMyProjects } from "./projects.actions";

const PROJECTS_STATE_TOKEN = new StateToken<ProjectCollectionModel>('my_projects');

@Injectable({
  providedIn: 'root'
})
@State<ProjectCollectionModel>({
  name: PROJECTS_STATE_TOKEN,
  defaults: { projects: [] }
})
export class MyProjectsState {
  @Action(SetMyProjects)
  public setMyProjects(ctx: StateContext<ProjectCollectionModel>, action: SetMyProjects) {
    ctx.setState({
      ...action.projects
    });
  }
}
