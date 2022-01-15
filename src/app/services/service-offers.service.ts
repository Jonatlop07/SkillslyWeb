import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { JwtService } from './jwt.service'
import { ServiceOfferDetails } from '../interfaces/service-offers/service_offer_details'
import { ServiceOfferPresenter } from '../interfaces/presenter/service-offers/service_offer.presenter'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class ServiceOffersService {
  private readonly API_URL: string = environment.API_URL;

  constructor(
    private readonly http: HttpClient,
    private readonly jwt_service: JwtService
  ) {}

  public createServiceOffer(service_offer_details: ServiceOfferDetails): Observable<ServiceOfferPresenter> {
    return this.http.post<ServiceOfferPresenter>(
      `${this.API_URL}/service-offers`,
      service_offer_details,
      this.jwt_service.getHttpOptions()
    );
  }
}
