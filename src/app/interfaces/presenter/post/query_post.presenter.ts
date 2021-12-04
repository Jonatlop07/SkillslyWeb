import { PostContentData } from './create_post_data.presenter'

export interface QueryPostPresenter {
    user_id: string;
    post_id?: string;
}
export interface PermanentPostPresenter{
    user_id: string;
    post_id: string;
    content: PostContentData[];
    created_at: string;
}
