import { ServiceRequestModel } from '../../../features/service-request/model/service_request.model'

export class SetMyServiceRequests {
  static readonly type = '[Profile] Set My Service Requests';

  constructor(public readonly service_request_collection: Array<ServiceRequestModel>) {}
}

export class CreateServiceRequest {
  static readonly type = '[Service Requests] Create a Service Request';

  constructor(public readonly service_request: ServiceRequestModel) {}
}

export class UpdateMyServiceRequest {
  static readonly type = '[Service Request] Update a Service Request';

  constructor(public readonly service_request: ServiceRequestModel) {}
}

export class DeleteMyServiceRequest {
  static readonly type = '[Service Request] Delete a Service Request';

  constructor(public readonly service_request_id: string) {}
}
