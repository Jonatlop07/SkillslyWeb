import { Component, OnInit } from '@angular/core';
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { MyProjectsState } from "../../../shared/state/projects/projects.state";
import { ProjectModel, ProjectCollectionModel } from "../../../models/project_collection.model";
import { ActivatedRoute } from "@angular/router";
import { QueryProjectPresenter } from "../../../interfaces/project/query_project.presenter";
import { SetMyProjects } from "../../../shared/state/projects/projects.actions";
import { ProjectService } from "../../../services/projects.service";

@Component({
  selector: 'app-projects-query',
  templateUrl: './projects-query.component.html',
  styleUrls: ['./projects-query.component.css'],
})
export class ProjectsQueryComponent implements OnInit {
  public project_owner: string;
  public userName: string;
  @Select(MyProjectsState) my_projects$: Observable<ProjectCollectionModel>;
  public projects: Array<ProjectModel>

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private readonly store: Store
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.project_owner = params.user_id;
      const queryProjectParams: QueryProjectPresenter = {
        user_id: this.project_owner,
      };
      const projectServiceResponse = this.projectService.queryProjectCollection(queryProjectParams);
      projectServiceResponse.subscribe((res: any) => {
        this.store.dispatch(new SetMyProjects({ projects: res.projects }));
        this.my_projects$.subscribe(my_projects => {
          this.projects = my_projects.projects;
        })
      });
    })

  }
}
