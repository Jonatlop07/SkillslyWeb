import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtService } from './jwt.service';
import { Select } from '@ngxs/store';
import { SessionState } from '../shared/state/session/session.state';
import { Observable, of } from 'rxjs';
import { SessionModel } from '../models/session.model';
import { tap } from 'rxjs/operators';
import { CreateGroupPresenter } from '../interfaces/group/create_group.presenter';
import {
  QueryGroupsPresenter,
  QuerySingleGroupPresenter,
} from '../interfaces/group/query_groups.presenter';
import { QueryGroupUsersPresenter } from '../interfaces/group/query_group_users.presenter';
import UpdateGroupUserPresenter from '../interfaces/group/update_group_user.presenter';
import UpdateGroupPresenter from '../interfaces/group/update_group.presenter';

@Injectable({ providedIn: 'root' })
export class GroupsService {
  @Select(SessionState) session$: Observable<SessionModel>;
  private readonly API_URL: string = environment.API_URL;
  public isChargingGroups = false;

  constructor(
    private readonly http: HttpClient,
    private readonly jwtService: JwtService
  ) {}

  createGroup(group: CreateGroupPresenter) {
    const picture = group.picture
      ? group.picture
      : 'https://static.vecteezy.com/system/resources/previews/001/183/293/large_2x/neutral-low-poly-abstract-banner-vector.jpg';
    return this.http.post(
      `${this.API_URL}/groups/create`,
      {
        name: group.name,
        description: group.description,
        category: group.category,
        picture: picture,
      },
      this.jwtService.getHttpOptions()
    );
  }

  queryUserGroups(queryGroupsParams: QueryGroupsPresenter) {
    const { user_id, name, category, limit, offset } = queryGroupsParams;
    if (this.isChargingGroups) {
      return of([]);
    }
    this.isChargingGroups = true;
    return this.http
      .post(
        `${this.API_URL}/groups`,
        {
          user_id,
          name,
          category,
          limit,
          offset
        },
        this.jwtService.getHttpOptions()
      )
      .pipe(tap(() => this.isChargingGroups = false));
  }

  queryGroup(queryGroupParams: QuerySingleGroupPresenter) {
    return this.http.get(
      `${this.API_URL}/groups/${queryGroupParams.group_id}`,
      this.jwtService.getHttpOptions()
    );
  }

  queryGroupUsers(queryGroupsUsersParams: QueryGroupUsersPresenter) {
    const { group_id, limit, offset } = queryGroupsUsersParams;
    return this.http.get(`${this.API_URL}/groups/users/${group_id}`, {
      params: { limit, offset },
      ...this.jwtService.getHttpOptions(),
    });
  }

  removeUser(removeUserParams: UpdateGroupUserPresenter) {
    const { group_id, user_id, action } = removeUserParams;
    return this.http.put(
      `${this.API_URL}/groups/${action}/${group_id}`,
      { user_id: user_id },
      this.jwtService.getHttpOptions()
    );
  }

  joinGroup(group_id: string) {
    return this.http.post(
      `${this.API_URL}/groups/join/${group_id}`,
      {},
      this.jwtService.getHttpOptions()
    );
  }

  removeJoinRequest(group_id: string) {
    return this.http.delete(
      `${this.API_URL}/groups/join/${group_id}`,
      this.jwtService.getHttpOptions()
    );
  }

  getGroupRequests(getRequestsParams: QueryGroupUsersPresenter) {
    const { group_id, limit, offset } = getRequestsParams;
    return this.http.get(`${this.API_URL}/groups/requests/${group_id}`, {
      params: { limit, offset },
      ...this.jwtService.getHttpOptions(),
    });
  }

  updateGroupInfo(group_info: UpdateGroupPresenter) {
    const { name, description, category, picture, id } = group_info;
    return this.http.put(
      `${this.API_URL}/groups/${id}`,
      { name, description, category, picture },
      this.jwtService.getHttpOptions()
    );
  }

  getUserId() {
    return this.jwtService.getUserId();
  }

  updateGroupRequest(requestParams: UpdateGroupUserPresenter) {
    const { group_id, user_id } = requestParams;
    const action = requestParams.action === 'accept' ? 'accept' : 'reject';
    return this.http.put(
      `${this.API_URL}/groups/${action}/${group_id}`,
      { user_id: user_id },
      this.jwtService.getHttpOptions()
    );
  }

  deleteGroup(group_id: string) {
    return this.http.delete(
      `${this.API_URL}/groups/${group_id}`,
      this.jwtService.getHttpOptions()
    );
  }

  leaveGroup(group_id: string) {
    return this.http.delete(
      `${this.API_URL}/groups/leave/${group_id}`,
      this.jwtService.getHttpOptions()
    );
  }
}
