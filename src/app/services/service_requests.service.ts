import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { JwtService } from './jwt.service';
import { ServiceRequestDetails } from '../interfaces/service-requests/service_request_details';
import { ServiceRequestPresenter } from '../interfaces/service-requests/presenter/service_request.presenter';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ServiceRequestCollectionPresenter } from '../interfaces/service-requests/presenter/service_request_collection.presenter';
import { Select, Store } from '@ngxs/store';
import { MyServiceRequestsState } from '../shared/state/service-requests/service_requests.state';
import { ServiceRequestCollectionModel } from '../models/service_request_collection.model';
import {
  CreateServiceRequest,
  DeleteMyServiceRequest,
  SetMyServiceRequests,
  UpdateMyServiceRequest,
} from '../shared/state/service-requests/service_requests.actions';
import { ServiceRequestModel } from '../models/service_request.model';
import { ApplicationPresenter } from '../interfaces/service-requests/presenter/applications.presenter';
import { UpdateApplicationPresenter } from '../interfaces/service-requests/presenter/update_application.presenter';
import { OnUpdateApplicationResponse } from '../interfaces/service-requests/on_update_application.response';
import { UpdateRequestPresenter } from '../interfaces/service-requests/presenter/update_request.presenter';

@Injectable({ providedIn: 'root' })
export class ServiceRequestsService {
  @Select(MyServiceRequestsState)
  my_service_requests$: Observable<ServiceRequestCollectionModel>;

  private readonly API_URL: string = environment.API_URL;

  constructor(
    private readonly http: HttpClient,
    private readonly jwt_service: JwtService,
    private readonly store: Store
  ) {}

  private getServiceRequestCollection(
    categories?: string
  ): Observable<ServiceRequestCollectionPresenter> {
    let params = new HttpParams();
    if (categories && categories.length > 0) {
      params = params.append('categories', JSON.stringify(categories));
    }
    params = params.append('limit', 20);
    params = params.append('offset', 0);
    return this.http.get<ServiceRequestCollectionPresenter>(
      `${this.API_URL}/service-requests`,
      {
        params,
        ...this.jwt_service.getHttpOptions(),
      }
    );
  }

  public queryServiceRequestCollectionByCategory(
    category: string
  ): Observable<ServiceRequestCollectionPresenter> {
    return this.getServiceRequestCollection(category);
  }

  public queryAllServiceRequestCollection() {
    return this.getServiceRequestCollection();
  }

  public createServiceRequest(
    service_request_details: ServiceRequestDetails
  ): Observable<ServiceRequestPresenter> {
    return this.http.post<ServiceRequestPresenter>(
      `${this.API_URL}/service-requests`,
      service_request_details,
      this.jwt_service.getHttpOptions()
    );
  }

  public createServiceRequestInStore(service_request: ServiceRequestModel) {
    return this.store.dispatch(new CreateServiceRequest(service_request));
  }

  public getAndStoreMyServiceRequestCollection() {
    let params = new HttpParams();
    params = params.append('owner_id', this.jwt_service.getUserId());
    params = params.append('limit', 100);
    params = params.append('offset', 0);
    this.http
      .get<ServiceRequestCollectionPresenter>(
        `${this.API_URL}/service-requests`,
        {
          params,
          ...this.jwt_service.getHttpOptions(),
        }
      )
      .subscribe(
        (service_request_collection: ServiceRequestCollectionPresenter) => {
          this.storeMyServiceRequestCollection(
            service_request_collection.service_requests
          ).subscribe(() => {});
        }
      );
  }

  public getMyServiceRequestsFromStore() {
    return this.my_service_requests$;
  }

  public storeMyServiceRequestCollection(
    service_requests: Array<ServiceRequestModel>
  ) {
    return this.store.dispatch(new SetMyServiceRequests(service_requests));
  }

  public updateServiceRequest(
    service_request: ServiceRequestPresenter
  ): Observable<ServiceRequestPresenter> {
    const { title, service_brief, contact_information, category } =
      service_request;
    return this.http.put<ServiceRequestPresenter>(
      `${this.API_URL}/service-requests/${encodeURIComponent(
        service_request.service_request_id
      )}`,
      {
        title,
        service_brief,
        contact_information,
        category,
      },
      this.jwt_service.getHttpOptions()
    );
  }

  public updateServiceRequestInStore(service_request: ServiceRequestPresenter) {
    return this.store.dispatch(new UpdateMyServiceRequest(service_request));
  }

  public deleteServiceRequestInStore(service_request_id: string) {
    return this.store.dispatch(new DeleteMyServiceRequest(service_request_id));
  }

  public deleteServiceRequest(service_request_id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/service-requests/${encodeURIComponent(
        service_request_id
      )}`,
      this.jwt_service.getHttpOptions()
    );
  }

  public applyToServiceRequest(application_data: ApplicationPresenter) {
    const { request_id, message } = application_data;
    return this.http.post(
      `${this.API_URL}/service-requests/apply`,
      {
        request_id,
        message,
      },
      this.jwt_service.getHttpOptions()
    );
  }

  public getApplications(request_id: string) {
    return this.http.get(
      `${this.API_URL}/service-requests/applications/${request_id}`,
      this.jwt_service.getHttpOptions()
    );
  }

  public getCurrentEvaluationApplicant(request_id: string) {
    return this.http.get(
      `${this.API_URL}/service-requests/applications/evaluated/${request_id}`,
      this.jwt_service.getHttpOptions()
    );
  }

  public updateServiceRequestApplication(
    update_params: UpdateApplicationPresenter
  ): Observable<OnUpdateApplicationResponse> {
    const { applicant_id, request_id, application_action } = update_params;
    return this.http.put<OnUpdateApplicationResponse>(
      `${this.API_URL}/service-requests/applications/${request_id}`,
      {
        applicant_id,
        application_action,
      },
      this.jwt_service.getHttpOptions()
    );
  }

  public createUpdateRequest(
    create_update_request_params: UpdateRequestPresenter
  ) {
    const { update_request_action, provider_id, service_request_id } =
      create_update_request_params;
    return this.http.post(
      `${this.API_URL}/service-requests/status-update`,
      {
        provider_id,
        service_request_id,
        update_request_action,
      },
      this.jwt_service.getHttpOptions()
    );
  }

  public isServiceOwner(owner_id: string) {
    return owner_id === this.jwt_service.getUserId();
  }

  public getUserData() {
    return this.jwt_service.getUserId();
  }
}
