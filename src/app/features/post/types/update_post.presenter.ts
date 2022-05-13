import {ContentElementPresenter} from "./query_post.presenter";

export interface UpdatePostPresenter {
  id: string;
  owner_id: string;
  description: string;
  privacy: string;
  content_element: ContentElementPresenter[];
}
