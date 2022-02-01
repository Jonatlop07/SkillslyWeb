import {Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { ProjectService } from 'src/app/services/projects.service';
import {UpdateProjectPresenter} from "../../../interfaces/project/update_project.presenter";

@Component({
  selector: 'app-projects-update',
  templateUrl: './projects-update.component.html',
  styleUrls: ['./projects-update.component.css'],
})
export class ProjectsUpdateComponent implements OnInit {
  public project_id: string;
  paramsProject: UpdateProjectPresenter = {
    title: '',
    members: [],
    description: '',
    reference: '',
    reference_type: '',
    annexes: [],
  };
  requireOne = false;
  title: string;
  members: Array<string>;
  reference: string;
  description: string;
  reference_type: string;
  annexes: Array<string>;

  constructor(private projectService: ProjectService, private activated_route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.activated_route.params.subscribe(params => {
      this.project_id = params.project_id;
    })
  }

  onCancel() {
    this.router.navigate(['../main/feed']);
  }

  saveForm(form: NgForm) {
    const updateProjectParams: UpdateProjectPresenter = {
      project_id: this.project_id,
      title: form.value.title,
      members: this.members,
      reference: form.value.reference,
      description: form.value.description,
      reference_type: form.value.reference_type,
      annexes: this.annexes,
    };

    if (this.validateContent(updateProjectParams)) {
      this.requireOne = false;
      this.projectService.updateProject(updateProjectParams);
      this.router.navigate(['../main/feed']);
      return true;
    } else {
      return false;
    }
  }

  validateContent(project: UpdateProjectPresenter) {
    const { title, members, description, reference, reference_type, annexes } =
      project;
    if (
      !title &&
      !members &&
      !description &&
      !reference &&
      !reference_type &&
      !annexes
    ) {
      this.requireOne = true;
      return false;
    }
    return true;
  }
}
