import { PostContentData } from './create_post_data.presenter'

export interface QueryPostPresenter {
    owner_id?: string;
    id?: string;
    group_id?: string;
    limit?: number;
    offset?: number;
}

export interface ContentElementPresenter{
  description: string;
  media_locator: string;
  media_type: string;
}

export interface PermanentPostPresenter{
    id: string;
    owner_id: string;
    privacy: string;
    description: string;
    created_at: string;
    updated_at: string;
    content_element: ContentElementPresenter[];
}
