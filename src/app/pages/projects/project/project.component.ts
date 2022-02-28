import {Component, Input, OnInit} from '@angular/core';
import {ProjectPresenter} from "../../../interfaces/project/query_project.presenter";
import {DeleteProjectInterface} from "../../../interfaces/project/delete_project.interface";
import {ProjectService} from "../../../services/projects.service";
import {Store} from "@ngxs/store";
import {DeleteMyProject} from "../../../shared/state/projects/projects.actions";
import {Router} from "@angular/router";


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit{
  @Input() project: ProjectPresenter;
  @Input() editable: boolean;
  @Input() id: string;
  public owns_project = false;
  public day: string;
  public month: string;
  public year: string;
  public hour: string;

  constructor(
    private readonly projectService: ProjectService,
    private readonly store: Store,
    private readonly router: Router
  ) {}

  isImage(referenceType: string): boolean {
    return referenceType == 'imagen';
  }

  ngOnInit(): void {
    this.owns_project = this.projectService.getUserId() === this.project.owner_id;
  }

  deleteProject(project_id: string) {
    const deleteProjectInterface: DeleteProjectInterface = {
      project_id,
    };
    this.projectService.deleteProject(deleteProjectInterface).subscribe(() => {
      this.store.dispatch(new DeleteMyProject(project_id));
    });
  }

  updateProject(project_id: string) {
    this.router.navigate(['main/project/update', project_id]);
  }
}
