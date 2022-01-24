import { Action, State, StateContext, StateToken } from "@ngxs/store";
import { Injectable } from '@angular/core'
import { ProjectsModel} from "../../../models/projects.model";
import {SetMyProjects} from "./projects.actions";

const PROJECTS_STATE_TOKEN = new StateToken<ProjectsModel>('my_projects');

@Injectable({
  providedIn: 'root'
})
@State<ProjectsModel>({
  name: PROJECTS_STATE_TOKEN,
  defaults: { projects: [] }
})
export class MyProjectsState {
  @Action(SetMyProjects)
  public setMyProjects(ctx: StateContext<ProjectsModel>, action: SetMyProjects) {
    ctx.setState({
      ...action.projects
    });
  }
}
