import { Component, Input, OnInit } from '@angular/core'
import { ApplicationPresenter } from '../../types/presenter/applications.presenter'
import { fireAlert } from '../../../../shared/swal_fire_alerts'
import { OnUpdateApplicationResponse } from '../../types/on_update_application.response'
import { UserDataPresenter } from '../../../user-account/types/user_data.presenter'
import { ServiceRequestsService } from '../../services/service_requests.service'
import { ServiceRequestPresenter } from '../../types/presenter/service_request.presenter'
import Swal from 'sweetalert2'
import { ApplicantPresenter } from '../../types/presenter/applicant.presenter'
import { UserDataService } from '../../../user-account/services/user_data.service'
import * as moment from 'moment'


@Component({
  selector: 'app-service-request',
  templateUrl: './service_request.component.html',
  styleUrls: ['./service_request.component.css'],
})
export class ServiceRequestComponent implements OnInit {
  constructor(
    private readonly service_requests_service: ServiceRequestsService,
    private readonly user_data_service: UserDataService
  ) {}

  ngOnInit() {
    this.service_request = this.input_service_request;
    this.edited_service_request = {
      ...this.service_request,
    };

    this.user_has_applied = this.service_request.applicants
      ? this.service_request.applicants.includes(
          this.service_requests_service.getUserData()
        )
      : false;
    if (this.userIsOwner()) {
      this.service_requests_service
        .getApplications(this.service_request.service_request_id)
        .subscribe((res: any) => {
          this.applications = res.applications;
        });
    }
    if (
      this.userIsOwner() &&
      (this.service_request.phase === 'Evaluation' ||
        this.service_request.phase === 'Execution')
    ) {
      this.service_requests_service
        .getCurrentEvaluationApplicant(this.service_request.service_request_id)
        .subscribe((res: any) => {
          if (res) {
            this.evaluated_applicant = res;
          }
        });
    }
    if (this.input_service_request.service_provider){
      this.getProviderName(this.input_service_request.service_provider)
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
  public provider_email = '';

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
          this.service_request = {
            ...this.service_request,
            ...updated_service_request,
          };
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
          fireAlert(
            'Éxito',
            'La solicitud de servicio ha sido eliminada exitosamente',
            'success'
          );
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
      .subscribe(
        (res: OnUpdateApplicationResponse) => {
          this.evaluated_applicant = {
            applicant_email: application.applicant_email,
            applicant_id: application.applicant_id,
            applicant_name: application.applicant_name,
            request_phase: '',
          };
          this.display_applications_modal = false;
          this.applications.splice(index, 1);
          this.service_request = {
            ...this.service_request,
            phase: res.request_phase,
          };
          this.service_requests_service.updateServiceRequestInStore({
            ...this.service_request,
          });
          fireAlert(
            'Éxito',
            'Se ha aceptado al aplicante y ahora pasará a evaluación',
            'success'
          );
        },
        (err) => {
          const { error } = err.error;
          Swal.fire('Error', error, 'error');
        }
      );
  }

  public onDenyApplication(applicant_id: string) {
    this.service_requests_service
      .updateServiceRequestApplication({
        applicant_id,
        request_id: this.service_request.service_request_id,
        application_action: 'deny',
      })
      .subscribe(
        (res: OnUpdateApplicationResponse) => {
          this.service_request = {
            ...this.service_request,
            phase: res.request_phase,
          };
          this.service_requests_service.updateServiceRequestInStore({
            ...this.service_request,
          });
          fireAlert(
            'Éxito',
            'Se ha denegado al aplicante como proveedor del servicio',
            'success'
          );
        },
        (err) => {
          const { error } = err.error;
          Swal.fire('Error', error, 'error');
        }
      );
  }

  public onConfirmApplicant(applicant_id: string) {
    this.service_requests_service
      .updateServiceRequestApplication({
        applicant_id,
        request_id: this.service_request.service_request_id,
        application_action: 'confirm',
      })
      .subscribe(
        (res: OnUpdateApplicationResponse) => {
          this.display_service_request_details_modal = false;
          this.service_request = {
            ...this.service_request,
            phase: res.request_phase,
            service_provider: res.applicant_id,
          };
          this.service_requests_service.updateServiceRequestInStore({
            ...this.service_request,
          });
          fireAlert(
            'Éxito',
            'Se ha aceptado al aplicante como proveedor del servicio',
            'success'
          );
        },
        (err) => {
          const { error } = err.error;
          Swal.fire('Error', error, 'error');
        }
      );
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
      .subscribe(
        () => {
          this.service_request.provider_requested_status_update = true;
          fireAlert(
            'Éxito',
            'Se ha solicitado la actualización de la solicitud de servicio',
            'success'
          );
        },
        (err) => {
          const { error } = err.error;
          Swal.fire('Error', error, 'error');
        }
      );
  }

  public onUpdateUpdateRequest(action: string) {
    const { service_request_id, service_provider } = this.service_request;
    return this.service_requests_service
      .updateUpdateRequest({
        service_request_id,
        provider_id: service_provider,
        update_request_action: action,
      })
      .subscribe((res: any) => {
        this.display_service_request_details_modal = false;
        console.log(res)
        this.service_request = {
          ...this.service_request,
          phase: res.phase,
        };
        this.service_requests_service.updateServiceRequestInStore({
          ...this.service_request,
          phase: res.phase
        });
      });
  }

  public getProviderName(service_provider: string) {
    return this.user_data_service.getUserData(service_provider).subscribe(
      (data: UserDataPresenter) => {
        this.provider_email = data.email;
      },
      (err) => {
        const { error } = err.error;
        Swal.fire('Error', error, 'error');
      }
    );
  }
}
