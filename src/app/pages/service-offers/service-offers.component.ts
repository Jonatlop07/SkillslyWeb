import { Component } from '@angular/core'

@Component({
  selector: 'app-service-offers',
  templateUrl: './service-offers.component.html',
  styleUrls: ['./service-offers.component.css'],
})
export class ServiceOffersComponent {
  displayCreateServiceOfferModal: boolean = false;

  constructor() {
  }

  public showCreateServiceOfferModalDialog() {
    this.displayCreateServiceOfferModal = true;
  }

  public createServiceOffer() {

  }
}
