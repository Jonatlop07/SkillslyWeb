import { PostContentData } from './create_post_data.presenter'

export interface QueryPostPresenter {
    user_id?: string;
    post_id?: string;
    group_id?: string;
    limit?: number;
    offset?: number;
}
export interface PermanentPostPresenter{
    user_id: string;
    post_id: string;
    content: PostContentData[];
    privacy: string;
    created_at: string;
}
