import {PostContentData} from "../interfaces/presenter/post/create_post_data.presenter";

export interface PostsModel{
  posts: Array<PostModel>
}
export interface PostModel{
  user_id: string;
  post_id: string;
  content: PostContentData[];
  created_at: string;
}
