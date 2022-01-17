import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { JwtService } from './jwt.service'
import { ServiceRequestDetails } from '../interfaces/service-requests/service_request_details'
import { ServiceRequestPresenter } from '../interfaces/service-requests/presenter/service_request.presenter'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs'
import { ServiceRequestCollectionPresenter } from '../interfaces/service-requests/presenter/service_request_collection.presenter'
import { Select, Store } from '@ngxs/store'
import { MyServiceRequestsState } from '../shared/state/service-requests/service_requests.state'
import { ServiceRequestCollectionModel } from '../models/service_request_collection.model'
import {
  CreateServiceRequest,
  DeleteMyServiceRequest,
  SetMyServiceRequests,
  UpdateMyServiceRequest
} from '../shared/state/service-requests/service_requests.actions'
import { ServiceRequestModel } from '../models/service_request.model'

@Injectable({ providedIn: 'root' })
export class ServiceRequestsService {
  @Select(MyServiceRequestsState) my_service_requests$: Observable<ServiceRequestCollectionModel>;

  private readonly API_URL: string = environment.API_URL;

  constructor(
    private readonly http: HttpClient,
    private readonly jwt_service: JwtService,
    private readonly store: Store
  ) {}

  private getServiceRequestCollection(categories?: string): Observable<ServiceRequestCollectionPresenter> {
    let params = new HttpParams();
    if (categories && categories.length > 0) {
      params = params.append('categories', JSON.stringify(categories));
    }
    params = params.append('limit', 20);
    params = params.append('offset', 0);
    console.log(params.get('categories'))
    return this.http.get<ServiceRequestCollectionPresenter>(
      `${this.API_URL}/service-requests`,
      {
        params,
        ...this.jwt_service.getHttpOptions()
      }
    );
  }

  public queryServiceRequestCollectionByCategory(category: string): Observable<ServiceRequestCollectionPresenter> {
    return this.getServiceRequestCollection(category);
  }

  public queryAllServiceRequestCollection() {
    return this.getServiceRequestCollection();
  }

  public createServiceRequest(service_request_details: ServiceRequestDetails): Observable<ServiceRequestPresenter> {
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
    this.http.get<ServiceRequestCollectionPresenter>(
      `${this.API_URL}/service-requests`,
      {
        params,
        ...this.jwt_service.getHttpOptions()
      }
    ).subscribe(
      (service_request_collection: ServiceRequestCollectionPresenter) => {
        this.storeMyServiceRequestCollection(service_request_collection.service_requests).subscribe(() => {});
      }
    );
  }

  public getMyServiceRequestsFromStore() {
    return this.my_service_requests$;
  }


  public storeMyServiceRequestCollection(service_requests: Array<ServiceRequestModel>) {
    return this.store.dispatch(new SetMyServiceRequests(service_requests));
  }

  public updateServiceRequest(service_request: ServiceRequestPresenter): Observable<ServiceRequestPresenter> {
    const { title, service_brief, contact_information, category } = service_request;
    return this.http.put<ServiceRequestPresenter>(
      `${this.API_URL}/service-requests/${encodeURIComponent(service_request.service_request_id)}`,
      {
        title,
        service_brief,
        contact_information,
        category
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
      `${this.API_URL}/service-requests/${encodeURIComponent(service_request_id)}`,
      this.jwt_service.getHttpOptions()
    );
  }

  public isServiceOwner(owner_id: string) {
    return owner_id === this.jwt_service.getUserId();
  }
}
