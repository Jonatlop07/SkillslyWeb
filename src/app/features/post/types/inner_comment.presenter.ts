import { Owner } from './comment.presenter';

export interface InnerComment {
  _id: string;
  description?: string;
  media_locator?: string;
  media_type?: string;
  comment_id?: string;
  timestamp?: string;
  created_at?: string;
  updated_at?: string;
  owner: Owner;
  owner_id: string;
}
