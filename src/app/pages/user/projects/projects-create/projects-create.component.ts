import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateProjectDataPresenter } from 'src/app/interfaces/presenter/project/create_project_data.presenter';
import { ProjectService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-projects-create',
  templateUrl: './projects-create.component.html',
  styleUrls: ['./projects-create.component.css'],
})
export class ProjectsCreateComponent {
  paramsProject: CreateProjectDataPresenter = {
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

  constructor(private projectService: ProjectService, private router: Router) {}

  onCancel() {
    this.router.navigate(['./main']);
  }

  saveForm(form: NgForm) {
    console.log(form.value);
    const createProjectParams: CreateProjectDataPresenter = {
      title: form.value.title,
      members: this.members,
      reference: form.value.reference,
      description: form.value.description,
      reference_type: form.value.reference_type,
      annexes: this.annexes,
    };

    if (this.validateContent(createProjectParams)) {
      this.requireOne = false;
      this.projectService.createProject(createProjectParams);
      this.router.navigate(['./main']);
      return true;
    } else {
      return false;
    }
  }

  validateContent(project: CreateProjectDataPresenter) {
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
