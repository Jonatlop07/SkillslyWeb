export interface Comment {
  _id: string;
  description?: string;
  media_locator?: string;
  media_type?: string;
  post_id?: string;
  created_at?: string;
  timestamp?: string;
  email?: string;
  name?: string;
  inner_comment_count?: string;
  owner_id: string;
}
