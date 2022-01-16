import { Component } from '@angular/core'
import { ServiceOfferDetails } from '../../interfaces/service-offers/service_offer_details'
import { ServiceOffersService } from '../../services/service_offers.service'
import { ServiceOfferPresenter } from '../../interfaces/service-offers/presenter/service_offer.presenter'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-service-offers',
  templateUrl: './service_offers.component.html',
  styleUrls: ['./service_offers.component.css'],
})
export class ServiceOffersComponent {
  title: string;
  service_brief: string;
  contact_information: string;
  category: string;

  displayCreateServiceOfferModal: boolean = false;

  constructor(
    private readonly service_offers_service: ServiceOffersService
  ) {
  }

  public showCreateServiceOfferModalDialog() {
    this.displayCreateServiceOfferModal = true;
  }

  public hideCreateServiceOfferModalDialog() {
    this.displayCreateServiceOfferModal = false;
  }

  public createServiceOffer() {
    const service_offer: ServiceOfferDetails = {
      title: this.title,
      service_brief: this.service_brief,
      contact_information: this.contact_information,
      category: this.category
    };

    this.service_offers_service
      .createServiceOffer(service_offer)
      .subscribe(
        (created_service_offer: ServiceOfferPresenter) => {
          this.hideCreateServiceOfferModalDialog();
          this.service_offers_service.createServiceOfferInStore(created_service_offer);
          Swal.fire({
            customClass: {
              container: 'my-swal'
            },
            title: 'Éxito',
            text: 'La oferta de servicio ha sido creada correctamente',
            icon: 'success'
          });
        },
        (err) => {
          this.hideCreateServiceOfferModalDialog();
          const { error, message } = err.error
          const error_description = message ?
            'Datos inválidos. Asegúrate de diligenciar todos los campos requeridos y con el formato correcto.'
            : error;
          Swal.fire(
            'Error',
            error_description,
            'error'
          );
        }
      );
  }
}
