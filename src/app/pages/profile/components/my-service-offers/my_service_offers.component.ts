import { Component, OnInit } from '@angular/core';
import { ServiceOffersService } from '../../../../services/service_offers.service';
import { ServiceOfferPresenter } from '../../../../interfaces/service-offers/presenter/service_offer.presenter';
import { ServiceOfferCollectionPresenter } from '../../../../interfaces/service-offers/presenter/service_offer_collection.presenter'

@Component({
  selector: 'app-my-service-offers',
  templateUrl: './my_service_offers.component.html',
  styleUrls: ['./my_service_offers.component.css']
})
export class MyServiceOffersComponent implements OnInit {
  public service_offers: Array<ServiceOfferPresenter> = [];

  constructor(
    private readonly service_offers_service: ServiceOffersService
  ) {
  }

  ngOnInit() {
    this.service_offers_service
      .getMyServiceOffersFromStore()
      .subscribe((service_offer_collection: ServiceOfferCollectionPresenter) => {
        this.service_offers = service_offer_collection.service_offers;
      });
  }
}
