import { Component, Input, OnInit } from '@angular/core'
import { ServiceRequestPresenter } from '../../../interfaces/service-requests/presenter/service_request.presenter'
import { ServiceRequestsService } from '../../../services/service_requests.service'
import Swal from 'sweetalert2'
import * as moment from 'moment'

@Component({
  selector: 'app-service-request',
  templateUrl: './service_request.component.html',
  styleUrls: ['./service_request.component.css']
})
export class ServiceRequestComponent implements OnInit {
  constructor(private readonly service_requests_service: ServiceRequestsService) {}

  ngOnInit() {
    this.service_request = this.input_service_request;
    this.edited_service_request = {
      ...this.service_request
    };
  }

  @Input() input_service_request: ServiceRequestPresenter;

  public service_request: ServiceRequestPresenter;

  public edited_service_request: ServiceRequestPresenter;

  public display_service_request_details_modal: boolean = false;
  public display_edit_service_request_modal: boolean = false;

  public seeServiceRequest() {
    this.display_service_request_details_modal = true;
  }

  public editServiceRequest() {
    this.display_edit_service_request_modal = true;
  }

  private hideEditServiceRequestModal() {
    this.display_edit_service_request_modal = false;
  }

  public updateServiceRequest() {
    this.service_requests_service
      .updateServiceRequest(this.edited_service_request)
      .subscribe((updated_service_request: ServiceRequestPresenter) => {
        this.hideEditServiceRequestModal();
        this.service_request = updated_service_request;
        this.service_requests_service.updateServiceRequestInStore(this.service_request);
        Swal.fire({
          customClass: {
            container: 'my-swal'
          },
          title: 'Éxito',
          text: 'La solicitud de servicio ha sido actualizada exitosamente',
          icon: 'success'
        });
      }, (err) => {
        this.hideEditServiceRequestModal();
        const { error, message } = err.error
        const error_description = message ?
          'Datos inválidos. Asegúrate de diligenciar todos los campos requeridos y con el formato correcto.'
          : error;
        Swal.fire(
          'Error',
          error_description,
          'error'
        );
      });
  }

  public deleteServiceRequest() {
    this.service_requests_service
      .deleteServiceRequest(this.service_request.service_request_id)
      .subscribe(() => {
        this.service_requests_service.deleteServiceRequestInStore(this.service_request.service_request_id);
        Swal.fire({
          customClass: {
            container: 'my-swal'
          },
          title: 'Éxito',
          text: 'La solicitud de servicio ha sido eliminada exitosamente',
          icon: 'success'
        });
      }, (err) => {
        const { error } = err.error;
        Swal.fire(
          'Error',
          error,
          'error'
        );
      });;
  }

  public getTime() {
    moment.locale('es');
    return moment(this.service_request.created_at).fromNow();
  }

  public userIsOwner() {
    return this.service_requests_service.isServiceOwner(this.service_request.owner_id);
  }
}
