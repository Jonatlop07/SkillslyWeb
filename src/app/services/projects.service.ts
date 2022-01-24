import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateProjectDataPresenter } from '../interfaces/presenter/project/create_project_data.presenter';
import { JwtService } from './jwt.service';
import { Select } from '@ngxs/store';
import { SessionState } from '../shared/state/session/session.state';
import { Observable } from 'rxjs';
import { SessionModel } from '../models/session.model';
import {tap} from "rxjs/operators";
import {QueryProjectPresenter} from "../interfaces/presenter/project/query_project.presenter";

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
    console.log(project);
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
}
