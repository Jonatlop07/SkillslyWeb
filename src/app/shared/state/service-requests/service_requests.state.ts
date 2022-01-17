import { Injectable } from '@angular/core'
import { Action, State, StateContext, StateToken } from '@ngxs/store'
import {
  CreateServiceRequest,
  DeleteMyServiceRequest,
  SetMyServiceRequests,
  UpdateMyServiceRequest
} from './service_requests.actions'
import { ServiceRequestCollectionModel } from '../../../models/service_request_collection.model'

const MY_SERVICE_REQUESTS_STATE_TOKEN = new StateToken<ServiceRequestCollectionModel>('my_service_requests');

@Injectable({
  providedIn: 'root'
})
@State<ServiceRequestCollectionModel>({
  name: MY_SERVICE_REQUESTS_STATE_TOKEN,
  defaults: {
    service_requests: []
  }
})
export class MyServiceRequestsState {
  @Action(SetMyServiceRequests)
  public setMyServiceRequests(ctx: StateContext<ServiceRequestCollectionModel>, action: SetMyServiceRequests) {
    ctx.setState({
      service_requests: action.service_request_collection
    });
  }

  @Action(CreateServiceRequest)
  public createServiceRequest(ctx: StateContext<ServiceRequestCollectionModel>, action: CreateServiceRequest) {
    const state = ctx.getState();
    ctx.setState({
      service_requests: [
        ...state.service_requests,
        action.service_request
      ]
    });
  }

  @Action(UpdateMyServiceRequest)
  public updateMyServiceRequest(ctx: StateContext<ServiceRequestCollectionModel>, action: UpdateMyServiceRequest) {
    const state = ctx.getState();
    const service_requests = [...state.service_requests];
    for (let i = 0; i < service_requests.length; ++i) {
      if (service_requests[i].service_request_id === action.service_request.service_request_id) {
        const service_request = service_requests[i];
        const { title, service_brief, contact_information, category } = action.service_request;
        service_requests[i] = {
          ...service_request,
          title,
          service_brief,
          contact_information,
          category
        };
        break;
      }
    }
    ctx.setState({
      service_requests
    })
  }

  @Action(DeleteMyServiceRequest)
  public deleteMyServiceRequest(ctx: StateContext<ServiceRequestCollectionModel>, action: DeleteMyServiceRequest) {
    ctx.setState({
      service_requests: ctx.getState().service_requests.filter(
        (service_request) =>
          service_request.service_request_id !== action.service_request_id
      )
    })
  }
}
