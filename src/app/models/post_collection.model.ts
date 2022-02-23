import { PostContentData } from "../interfaces/post/create_post_data.presenter";

export interface PostCollectionModel {
  posts: Array<PostModel>
}

export interface PostModel {
  owner_id: string;
  user_name: string;
  post_id: string;
  content: PostContentData[];
  privacy: string;
  created_at: string;
}
