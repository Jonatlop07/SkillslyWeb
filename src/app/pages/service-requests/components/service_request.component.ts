import { Component, Input, OnInit } from '@angular/core';
import { ServiceRequestPresenter } from '../../../interfaces/service-requests/presenter/service_request.presenter';
import { ServiceRequestsService } from '../../../services/service_requests.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { ApplicationPresenter } from 'src/app/interfaces/service-requests/presenter/applications.presenter';
import { ApplicantPresenter } from 'src/app/interfaces/service-requests/presenter/applicant.presenter';
import { OnUpdateApplicationResponse } from 'src/app/interfaces/service-requests/on_update_application.response';

@Component({
  selector: 'app-service-request',
  templateUrl: './service_request.component.html',
  styleUrls: ['./service_request.component.css'],
})
export class ServiceRequestComponent implements OnInit {
  constructor(
    private readonly service_requests_service: ServiceRequestsService
  ) {}

  ngOnInit() {
    this.service_request = this.input_service_request;
    this.edited_service_request = {
      ...this.service_request,
    };
    this.user_has_applied = this.service_request.applicants.includes(
      this.service_requests_service.getUserData()
    );
    if (this.userIsOwner()) {
      this.service_requests_service
        .getApplications(this.service_request.service_request_id)
        .subscribe((res: any) => {
          this.applications = res.applications;
        });
    }
    //if (this.service_request.phase === 'Evaluation' && this.userIsOwner()) {
    if (this.userIsOwner() && this.service_request.phase != 'closed') {
      this.service_requests_service
        .getCurrentEvaluationApplicant(this.service_request.service_request_id)
        .subscribe((res: any) => {
          this.evaluated_applicant = res;
        });
    }
  }

  @Input() input_service_request: ServiceRequestPresenter;

  public service_request: ServiceRequestPresenter;

  public edited_service_request: ServiceRequestPresenter;

  public display_service_request_details_modal = false;
  public display_edit_service_request_modal = false;
  public display_apply_service_request_modal = false;
  public display_applications_modal = false;
  public application_message = '';
  public evaluated_applicant: ApplicantPresenter = {
    applicant_email: '',
    applicant_id: '',
    applicant_name: '',
    request_phase: '',
  };
  public user_has_applied: boolean;
  public applications: Array<ApplicationPresenter> = [];

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
      .subscribe(
        (updated_service_request: ServiceRequestPresenter) => {
          this.hideEditServiceRequestModal();
          this.service_request = {...this.service_request, ...updated_service_request} ;
          this.service_requests_service.updateServiceRequestInStore(
            this.service_request
          );
          Swal.fire({
            customClass: {
              container: 'my-swal',
            },
            title: 'Éxito',
            text: 'La solicitud de servicio ha sido actualizada exitosamente',
            icon: 'success',
          });
        },
        (err) => {
          this.hideEditServiceRequestModal();
          const { error, message } = err.error;
          const error_description = message
            ? 'Datos inválidos. Asegúrate de diligenciar todos los campos requeridos y con el formato correcto.'
            : error;
          Swal.fire('Error', error_description, 'error');
        }
      );
  }

  public deleteServiceRequest() {
    this.service_requests_service
      .deleteServiceRequest(this.service_request.service_request_id)
      .subscribe(
        () => {
          this.service_requests_service.deleteServiceRequestInStore(
            this.service_request.service_request_id
          );
          Swal.fire({
            customClass: {
              container: 'my-swal',
            },
            title: 'Éxito',
            text: 'La solicitud de servicio ha sido eliminada exitosamente',
            icon: 'success',
          });
        },
        (err) => {
          const { error } = err.error;
          Swal.fire('Error', error, 'error');
        }
      );
  }

  public getTime() {
    moment.locale('es');
    return moment(this.service_request.created_at).fromNow();
  }

  public userIsOwner() {
    return this.service_requests_service.isServiceOwner(
      this.service_request.owner_id
    );
  }

  public canApplyToService() {
    return (
      this.service_request.phase === 'Open' &&
      !this.service_requests_service.isServiceOwner(
        this.service_request.owner_id
      ) &&
      !this.user_has_applied
    );
  }

  public canRemoveRequest() {
    return (
      this.user_has_applied &&
      (this.service_request.phase === 'Open' ||
        this.service_request.phase === 'Evaluation')
    );
  }

  public onApplyToServiceRequest() {
    this.service_requests_service
      .applyToServiceRequest({
        request_id: this.service_request.service_request_id,
        message: this.application_message,
      })
      .subscribe(
        () => {
          this.user_has_applied = !this.user_has_applied;
          this.display_apply_service_request_modal = false;
        },
        (err) => {
          const { error } = err.error;
          Swal.fire('Error', error, 'error');
        }
      );
  }

  public showApplyServiceRequestModal() {
    this.display_apply_service_request_modal = true;
  }

  public showApplicationsModal() {
    this.display_applications_modal = true;
  }

  public onAcceptApplication(
    applicant_id: string,
    application: ApplicationPresenter,
    index: number
  ) {
    this.service_requests_service
      .updateServiceRequestApplication({
        applicant_id,
        request_id: this.service_request.service_request_id,
        application_action: 'accept',
      })
      .subscribe((res: OnUpdateApplicationResponse) => {
        this.evaluated_applicant = {
          applicant_email: application.applicant_email,
          applicant_id: application.applicant_id,
          applicant_name: application.applicant_name,
          request_phase: ''
        };
        this.service_request.phase = res.request_phase;
        this.display_applications_modal = false;
        this.applications.splice(index, 1);
        this.service_requests_service.updateServiceRequestInStore({
          ...this.service_request,
        });
      });
  }

  public onDenyApplication(applicant_id: string) {
    this.service_requests_service
      .updateServiceRequestApplication({
        applicant_id,
        request_id: this.service_request.service_request_id,
        application_action: 'deny',
      })
      .subscribe((res: OnUpdateApplicationResponse) => {
        this.service_request.phase = res.request_phase;
        this.service_requests_service.updateServiceRequestInStore({
          ...this.service_request,
        });
      });
  }

  public onConfirmApplicant(applicant_id: string) {
    this.service_requests_service
      .updateServiceRequestApplication({
        applicant_id,
        request_id: this.service_request.service_request_id,
        application_action: 'confirm',
      })
      .subscribe((res: OnUpdateApplicationResponse) => {
        this.service_request.phase = res.request_phase;
        this.service_request.service_provider = res.applicant_id;
        this.service_requests_service.updateServiceRequestInStore(
          this.service_request
        );
      });
  }

  public userIsProvider() {
    return (
      this.service_requests_service.getUserData() ===
      this.service_request.service_provider
    );
  }

  public onCreateUpdateRequest(action: string) {
    const { service_request_id, service_provider } = this.service_request;
    return this.service_requests_service
      .createUpdateRequest({
        service_request_id,
        provider_id: service_provider,
        update_request_action: action,
      })
      .subscribe(() => {
        this.service_request.provider_requested_status_update = true;
      });
  }

  public onUpdateUpdateRequest(action: string) {
    const { service_request_id, service_provider } = this.service_request;
    return this.service_requests_service
      .updateUpdateRequest({
        service_request_id,
        provider_id: service_provider,
        update_request_action: action,
      })
      .subscribe((res:any) => {
        this.display_service_request_details_modal= false; 
      });
  }
}
