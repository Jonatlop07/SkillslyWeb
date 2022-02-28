import { Component, Input, OnInit } from '@angular/core'
import { ServiceOfferPresenter } from '../../../interfaces/service-offers/presenter/service_offer.presenter'
import { ServiceOffersService } from '../../../services/service_offers.service'
import * as moment from 'moment'
import { showErrorPopup, showSuccessPopup } from '../../../shared/pop-up/pop_up.utils'

@Component({
  selector: 'app-service-offer',
  templateUrl: './service_offer.component.html',
  styleUrls: ['./service_offer.component.css']
})
export class ServiceOfferComponent implements OnInit {
  constructor(private readonly service_offers_service: ServiceOffersService) {
  }

  ngOnInit() {
    this.service_offer = this.input_service_offer;
    this.edited_service_offer = {
      ...this.service_offer
    };
  }

  @Input() input_service_offer: ServiceOfferPresenter;

  public service_offer: ServiceOfferPresenter;

  public edited_service_offer: ServiceOfferPresenter;

  public display_service_offer_details_modal: boolean = false;
  public display_edit_service_offer_modal: boolean = false;

  public seeServiceOffer() {
    this.display_service_offer_details_modal = true;
  }

  public editServiceOffer() {
    this.display_edit_service_offer_modal = true;
  }

  private hideEditServiceOfferModal() {
    this.display_edit_service_offer_modal = false;
  }

  public updateServiceOffer() {
    this.service_offers_service
      .updateServiceOffer(this.edited_service_offer)
      .subscribe((updated_service_offer: ServiceOfferPresenter) => {
        this.hideEditServiceOfferModal();
        this.service_offer = updated_service_offer;
        this.service_offers_service.updateServiceOfferInStore(this.service_offer);
        showSuccessPopup('La oferta de servicio ha sido actualizada exitosamente');
      }, (err) => {
        this.hideEditServiceOfferModal();
        const { error, message } = err.error
        const error_description = message ?
          'Datos inválidos. Asegúrate de diligenciar todos los campos requeridos y con el formato correcto.'
          : error;
        showErrorPopup(error_description);
      });
  }

  public deleteServiceOffer() {
    this.service_offers_service
      .deleteServiceOffer(this.service_offer.service_offer_id)
      .subscribe(() => {
        this.service_offers_service.deleteServiceOfferInStore(this.service_offer.service_offer_id);
        showSuccessPopup('La oferta de servicio ha sido eliminada exitosamente');
      }, (err) => {
        const { error } = err.error;
        showErrorPopup(error);
      });
  }

  public getTime() {
    moment.locale('es');
    return moment(this.service_offer.created_at).fromNow();
  }

  public userIsOwner() {
    return this.service_offers_service.isServiceOwner(this.service_offer.owner_id);
  }
}
