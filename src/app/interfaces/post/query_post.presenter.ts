import { PostContentData } from './create_post_data.presenter'

export interface QueryPostPresenter {
    owner_id?: string;
    post_id?: string;
    group_id?: string;
    limit?: number;
    offset?: number;
}

export interface PermanentPostPresenter{
    owner_id: string;
    user_name: string;
    post_id: string;
    content: PostContentData[];
    privacy: string;
    created_at: string;
}
