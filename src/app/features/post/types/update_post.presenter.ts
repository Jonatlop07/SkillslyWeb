import {PostContentElement} from "./create_post_data.presenter";

export interface UpdatePostInputData {
  id: string;
  owner_id: string;
  description: string;
  privacy: string;
  content_element: PostContentElement[];
}
