import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { JwtService } from './jwt.service'
import { ServiceOfferDetails } from '../interfaces/service-offers/service_offer_details'
import { ServiceOfferPresenter } from '../interfaces/service-offers/presenter/service_offer.presenter'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs'
import { ServiceOfferCollectionPresenter } from '../interfaces/service-offers/presenter/service_offer_collection.presenter'
import { Select, Store } from '@ngxs/store'
import { MyServiceOffersState } from '../shared/state/service-offers/service_offers.state'
import { ServiceOfferCollectionModel } from '../models/service_offer_collection.model'
import {
  CreateServiceOffer,
  DeleteMyServiceOffer,
  SetMyServiceOffers,
  UpdateMyServiceOffer
} from '../shared/state/service-offers/service_offers.actions'
import { ServiceOfferModel } from '../models/service_offer.model'

@Injectable({ providedIn: 'root' })
export class ServiceOffersService {
  @Select(MyServiceOffersState) my_service_offers$: Observable<ServiceOfferCollectionModel>;

  private readonly API_URL: string = environment.API_URL;

  constructor(
    private readonly http: HttpClient,
    private readonly jwt_service: JwtService,
    private readonly store: Store
  ) {}

  private getServiceOfferCollection(categories?: string): Observable<ServiceOfferCollectionPresenter> {
    console.log(categories)
    let params = new HttpParams();
    if (categories && categories.length > 0) {
      params = params.append('categories', JSON.stringify(categories));
    }
    params = params.append('limit', 20);
    params = params.append('offset', 0);
    console.log(params.get('categories'))
    return this.http.get<ServiceOfferCollectionPresenter>(
      `${this.API_URL}/service-offers`,
      {
        params,
        ...this.jwt_service.getHttpOptions()
      }
    );
  }

  public queryServiceOfferCollectionByCategory(category: string): Observable<ServiceOfferCollectionPresenter> {
    return this.getServiceOfferCollection(category);
  }

  public queryAllServiceOfferCollection() {
    return this.getServiceOfferCollection();
  }

  public createServiceOffer(service_offer_details: ServiceOfferDetails): Observable<ServiceOfferPresenter> {
    return this.http.post<ServiceOfferPresenter>(
      `${this.API_URL}/service-offers`,
      service_offer_details,
      this.jwt_service.getHttpOptions()
    );
  }

  public createServiceOfferInStore(service_offer: ServiceOfferModel) {
    return this.store.dispatch(new CreateServiceOffer(service_offer));
  }

  public getAndStoreMyServiceOfferCollection() {
    let params = new HttpParams();
    params = params.append('owner_id', this.jwt_service.getUserId());
    params = params.append('limit', 100);
    params = params.append('offset', 0);
    this.http.get<ServiceOfferCollectionPresenter>(
      `${this.API_URL}/service-offers`,
      {
        params,
        ...this.jwt_service.getHttpOptions()
      }
    ).subscribe(
      (service_offer_collection: ServiceOfferCollectionPresenter) => {
        this.storeMyServiceOfferCollection(service_offer_collection.service_offers).subscribe(() => {});
      }
    );
  }

  public getMyServiceOffersFromStore() {
    return this.my_service_offers$;
  }


  public storeMyServiceOfferCollection(service_offers: Array<ServiceOfferModel>) {
    return this.store.dispatch(new SetMyServiceOffers(service_offers));
  }

  public updateServiceOffer(service_offer: ServiceOfferPresenter): Observable<ServiceOfferPresenter> {
    const { title, service_brief, contact_information, category } = service_offer;
    return this.http.put<ServiceOfferPresenter>(
      `${this.API_URL}/service-offers/${encodeURIComponent(service_offer.service_offer_id)}`,
      {
        title,
        service_brief,
        contact_information,
        category
      },
      this.jwt_service.getHttpOptions()
    );
  }

  public updateServiceOfferInStore(service_offer: ServiceOfferPresenter) {
    return this.store.dispatch(new UpdateMyServiceOffer(service_offer));
  }

  public deleteServiceOfferInStore(service_offer_id: string) {
    return this.store.dispatch(new DeleteMyServiceOffer(service_offer_id));
  }

  public deleteServiceOffer(service_offer_id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/service-offers/${encodeURIComponent(service_offer_id)}`,
      this.jwt_service.getHttpOptions()
    );
  }

  public isServiceOwner(owner_id: string) {
    return owner_id === this.jwt_service.getUserId();
  }
}
