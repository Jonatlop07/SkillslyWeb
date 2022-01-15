import { Injectable } from '@angular/core'
import { Action, State, StateContext, StateToken } from '@ngxs/store'
import {
  CreateServiceOffer,
  DeleteMyServiceOffer,
  SetMyServiceOffers,
  UpdateMyServiceOffer
} from './service_offers.actions'
import { ServiceOfferCollectionModel } from '../../../models/service_offer_collection.model'

const MY_SERVICE_OFFERS_STATE_TOKEN = new StateToken<ServiceOfferCollectionModel>('my_service_offers');

@Injectable({
  providedIn: 'root'
})
@State<ServiceOfferCollectionModel>({
  name: MY_SERVICE_OFFERS_STATE_TOKEN,
  defaults: {
    service_offers: []
  }
})
export class MyServiceOffersState {
  @Action(SetMyServiceOffers)
  public setMyServiceOffers(ctx: StateContext<ServiceOfferCollectionModel>, action: SetMyServiceOffers) {
    ctx.setState({
      service_offers: action.service_offer_collection
    });
  }

  @Action(CreateServiceOffer)
  public createServiceOffer(ctx: StateContext<ServiceOfferCollectionModel>, action: CreateServiceOffer) {
    const state = ctx.getState();
    ctx.setState({
      service_offers: [
        ...state.service_offers,
        action.service_offer
      ]
    });
  }

  @Action(UpdateMyServiceOffer)
  public updateMyServiceOffer(ctx: StateContext<ServiceOfferCollectionModel>, action: UpdateMyServiceOffer) {
    const state = ctx.getState();
    const service_offers = [...state.service_offers];
    for (let i = 0; i < service_offers.length; ++i) {
      if (service_offers[i].service_offer_id === action.service_offer.service_offer_id) {
        const service_offer = service_offers[i];
        const { title, service_brief, contact_information, category } = action.service_offer;
        service_offers[i] = {
          ...service_offer,
          title,
          service_brief,
          contact_information,
          category
        };
        break;
      }
    }
    ctx.setState({
      service_offers
    })
  }

  @Action(DeleteMyServiceOffer)
  public deleteMyServiceOffer(ctx: StateContext<ServiceOfferCollectionModel>, action: DeleteMyServiceOffer) {
    ctx.setState({
      service_offers: ctx.getState().service_offers.filter(
        (service_offer) =>
          service_offer.service_offer_id !== action.service_offer_id
      )
    })
  }
}
