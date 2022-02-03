import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateProjectDataPresenter } from '../interfaces/project/create_project_data.presenter';
import { JwtService } from './jwt.service';
import { Select } from '@ngxs/store';
import { SessionState } from '../shared/state/session/session.state';
import { Observable } from 'rxjs';
import { SessionModel } from '../models/session.model';
import {tap} from "rxjs/operators";
import {QueryProjectPresenter} from "../interfaces/project/query_project.presenter";
import {DeleteProjectInterface} from "../interfaces/project/delete_project.interface";
import {UpdateProjectPresenter} from "../interfaces/project/update_project.presenter";

@Injectable({ providedIn: 'root' })
export class ProjectService {
  @Select(SessionState) session$: Observable<SessionModel>;

  private readonly API_URL: string = environment.API_URL;
  public toggleCreate = false;
  public isChargingProjects = false;
  public isChargingFeedProjects = false;

  constructor(
    private readonly http: HttpClient,
    private readonly jwtService: JwtService
  ) {}

  createProject(project: CreateProjectDataPresenter) {
    return this.http
      .post(
        `${this.API_URL}/projects`,
        {
          ...project,
        },
        this.jwtService.getHttpOptions()
      )
      .subscribe((created_project) => {
        console.log(created_project);
      });
  }

  queryProjectCollection(queryProjectParams: QueryProjectPresenter) {
    this.isChargingProjects = true;
    const {user_id} = queryProjectParams;
    return this.http.get(
      `${this.API_URL}/projects/${user_id}`,
      this.jwtService.getHttpOptions()
    ).pipe(tap(()=>{
      this.isChargingProjects = false;
    }));
  }

  public deleteProject(deleteProjectInterface: DeleteProjectInterface) {
    const { project_id } = deleteProjectInterface;
    const params = new HttpParams();
    return this.http.delete(
      `${this.API_URL}/projects/${encodeURIComponent(project_id)}`,
      {
        params,
        ...this.jwtService.getHttpOptions()
      }
    );
  }

  public updateProject(
    project_to_update: UpdateProjectPresenter
  ): Observable<UpdateProjectPresenter> {
    console.log(project_to_update);
    return this.http.put<UpdateProjectPresenter>(
      `${this.API_URL}/projects/${encodeURIComponent(project_to_update.project_id)}`,
      {
        user_id: this.jwtService.getUserId(),
        title: project_to_update.title,
        members: project_to_update.members,
        description: project_to_update.description,
        reference: project_to_update.reference,
        reference_type: project_to_update.reference_type,
        annexes: project_to_update.annexes,
      },
      this.jwtService.getHttpOptions()
    );
  }

  getUserId(){
    return this.jwtService.getUserId();
  }
}
