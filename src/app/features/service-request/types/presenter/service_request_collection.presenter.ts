import { ServiceRequestPresenter } from './service_request.presenter'

export interface ServiceRequestCollectionPresenter {
  service_requests: Array<ServiceRequestPresenter>;
}
