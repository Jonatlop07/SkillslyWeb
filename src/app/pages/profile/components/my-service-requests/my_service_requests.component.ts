import { Component, OnDestroy, OnInit } from '@angular/core';
import { ServiceRequestsService } from '../../../../services/service_requests.service';
import { ServiceRequestPresenter } from '../../../../interfaces/service-requests/presenter/service_request.presenter';
import { ServiceRequestCollectionPresenter } from '../../../../interfaces/service-requests/presenter/service_request_collection.presenter'

@Component({
  selector: 'app-my-service-requests',
  templateUrl: './my_service_requests.component.html',
  styleUrls: ['./my_service_requests.component.css']
})
export class MyServiceRequestsComponent implements OnInit{
  public service_requests: Array<ServiceRequestPresenter> = [];

  constructor(
    private readonly service_requests_service: ServiceRequestsService
  ) {
  }
  

  ngOnInit() {
    this.service_requests_service
      .getMyServiceRequestsFromStore()
      .subscribe((service_request_collection: ServiceRequestCollectionPresenter) => {
        this.service_requests = service_request_collection.service_requests;
      });
  }
  
}
