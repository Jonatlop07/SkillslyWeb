import { PostContentData } from './create_post_data.presenter'

export interface UpdatePostPresenter {
  owner_id: string;
  post_id: string;
  content: PostContentData[];
  privacy: string;
}
