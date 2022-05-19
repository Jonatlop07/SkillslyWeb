import {PostContentElement} from "../types/query_post.presenter";

export interface PostCollectionModel {
  posts: Array<PostModel>
}

export interface PostModel {
  id: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  description: string;
  privacy: string;
  content_element: PostContentElement[];
}
