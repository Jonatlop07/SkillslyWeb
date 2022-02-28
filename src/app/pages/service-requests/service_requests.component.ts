import { Component, OnInit } from '@angular/core';
import { ServiceRequestDetails } from '../../interfaces/service-requests/service_request_details';
import { ServiceRequestsService } from '../../services/service_requests.service';
import { ServiceRequestPresenter } from '../../interfaces/service-requests/presenter/service_request.presenter';
import Swal from 'sweetalert2';
import { ServiceRequestCollectionPresenter } from '../../interfaces/service-requests/presenter/service_request_collection.presenter';
import { UserDataService } from '../../services/user_data.service';
import { Observable } from 'rxjs';
import { showErrorPopup, showSuccessPopup } from '../../shared/pop-up/pop_up.utils'

@Component({
  selector: 'app-service-requests',
  templateUrl: './service_requests.component.html',
  styleUrls: ['./service_requests.component.css'],
})
export class ServiceRequestsComponent implements OnInit {
  public readonly new_service_request: ServiceRequestDetails = {
    title: '',
    service_brief: '',
    contact_information: '',
    category: '',
  };

  public service_requests: Array<ServiceRequestPresenter> = [];

  public categories = '';

  public displayCreateServiceRequestModal = false;

  constructor(
    private readonly service_requests_service: ServiceRequestsService
  ) {}

  ngOnInit() {
    this.service_requests_service
      .queryAllServiceRequestCollection()
      .subscribe(
        (service_request_collection: ServiceRequestCollectionPresenter) => {
          this.service_requests = service_request_collection.service_requests;
        }
      );
  }

  public showCreateServiceRequestModalDialog() {
    this.displayCreateServiceRequestModal = true;
  }

  public hideCreateServiceRequestModalDialog() {
    this.displayCreateServiceRequestModal = false;
  }

  public createServiceRequest() {
    if (!this.isValidRequestData()) {
      return;
    }
    this.service_requests_service
      .createServiceRequest(this.new_service_request)
      .subscribe(
        (created_service_request: ServiceRequestPresenter) => {
          this.hideCreateServiceRequestModalDialog();
          this.service_requests_service.createServiceRequestInStore(
            created_service_request
          );
          this.new_service_request.title = '';
          this.new_service_request.service_brief = '';
          this.new_service_request.contact_information = '';
          this.new_service_request.category = '';
          showSuccessPopup('La oferta de servicio ha sido creada correctamente');
        },
        (err) => {
          this.hideCreateServiceRequestModalDialog();
          const { error, message } = err.error;
          const error_description = message
            ? 'Datos inválidos. Asegúrate de diligenciar todos los campos requeridos y con el formato correcto.'
            : error;
          showErrorPopup(error_description);
        }
      );
  }

  public queryServiceRequestCollection() {
    const result: Observable<ServiceRequestCollectionPresenter> = this
      .categories
      ? this.service_requests_service.queryServiceRequestCollectionByCategory(
          this.categories
        )
      : this.service_requests_service.queryAllServiceRequestCollection();
    result.subscribe(
      (service_request_collection: ServiceRequestCollectionPresenter) => {
        this.service_requests = service_request_collection.service_requests;
      }
    );
  }

  public isValidRequestData() {
    return (
      this.new_service_request.title &&
      this.new_service_request.category &&
      this.new_service_request.service_brief &&
      this.new_service_request.contact_information
    );
  }
}
