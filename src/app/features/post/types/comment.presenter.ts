export interface Comment {
  _id: string;
  description?: string;
  media_locator?: string;
  media_type?: string;
  post_id?: string;
  created_at?: string;
  timestamp?: string;
  owner: Owner;
  inner_comment_count?: string;
  owner_id: string;
}

export interface Owner {
  name: string;
  email: string;
}
