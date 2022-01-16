import { ServiceOfferModel } from '../../../models/service_offer.model'

export class SetMyServiceOffers {
  static readonly type = '[Profile] Set My Service Offers';

  constructor(public readonly service_offer_collection: Array<ServiceOfferModel>) {}
}

export class CreateServiceOffer {
  static readonly type = '[Service Offers] Create a Service Offer';

  constructor(public readonly service_offer: ServiceOfferModel) {}
}

export class UpdateMyServiceOffer {
  static readonly type = '[Service Offer] Update a Service Offer';

  constructor(public readonly service_offer: ServiceOfferModel) {}
}

export class DeleteMyServiceOffer {
  static readonly type = '[Service Offer] Delete a Service Offer';

  constructor(public readonly service_offer_id: string) {}
}
