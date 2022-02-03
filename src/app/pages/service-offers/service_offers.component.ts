import { Component, OnInit } from '@angular/core'
import { ServiceOfferDetails } from '../../interfaces/service-offers/service_offer_details'
import { ServiceOffersService } from '../../services/service_offers.service'
import { ServiceOfferPresenter } from '../../interfaces/service-offers/presenter/service_offer.presenter'
import Swal from 'sweetalert2'
import { ServiceOfferCollectionPresenter } from '../../interfaces/service-offers/presenter/service_offer_collection.presenter'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-service-offers',
  templateUrl: './service_offers.component.html',
  styleUrls: ['./service_offers.component.css'],
})
export class ServiceOffersComponent implements OnInit {
  public readonly new_service_offer: ServiceOfferDetails = {
    title: '',
    service_brief: '',
    contact_information: '',
    category: ''
  };

  public service_offers: Array<ServiceOfferPresenter> = [];

  public categories = '';

  public displayCreateServiceOfferModal = false;

  constructor(
    private readonly service_offers_service: ServiceOffersService
  ) {
  }

  ngOnInit() {
    this.service_offers_service
      .queryAllServiceOfferCollection()
      .subscribe((service_offer_collection: ServiceOfferCollectionPresenter) => {
        this.service_offers = service_offer_collection.service_offers;
      });
  }

  public showCreateServiceOfferModalDialog() {
    this.displayCreateServiceOfferModal = true;
  }

  public hideCreateServiceOfferModalDialog() {
    this.displayCreateServiceOfferModal = false;
  }

  public createServiceOffer() {
    if (!this.isValidOfferData()){
      return;
    }
    this.service_offers_service
      .createServiceOffer(this.new_service_offer)
      .subscribe(
        (created_service_offer: ServiceOfferPresenter) => {
          this.hideCreateServiceOfferModalDialog();
          this.service_offers_service.createServiceOfferInStore(created_service_offer);
          this.new_service_offer.title = '';
          this.new_service_offer.service_brief = '';
          this.new_service_offer.contact_information = '';
          this.new_service_offer.category = '';
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

  public queryServiceOfferCollection() {
    const result: Observable<ServiceOfferCollectionPresenter> = this.categories ?
      this.service_offers_service.queryServiceOfferCollectionByCategory(this.categories)
      : this.service_offers_service.queryAllServiceOfferCollection();
    result.subscribe((service_offer_collection: ServiceOfferCollectionPresenter) => {
      console.log(service_offer_collection)
      this.service_offers = service_offer_collection.service_offers;
    });
  }

  public isValidOfferData() {
    return (
      this.new_service_offer.title &&
      this.new_service_offer.category &&
      this.new_service_offer.service_brief &&
      this.new_service_offer.contact_information
    );
  }
}
