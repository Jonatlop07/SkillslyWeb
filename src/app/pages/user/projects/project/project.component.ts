import {Component, Input, OnInit} from '@angular/core';
import {ProjectPresenter} from "../../../../interfaces/presenter/project/query_project.presenter";
import {PostService} from "../../../../services/posts.service";
import * as moment from "moment";


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
    private projectService: PostService,
  ) {}

  isImage(referenceType: string): boolean {
    return referenceType == 'imagen';
  }

  ngOnInit(): void {
    this.owns_project = this.projectService.getUserId() === this.project.user_id;
  }

}
