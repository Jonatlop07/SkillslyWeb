export interface PostContentData {
  description?: string;
  reference?: string;
  reference_type?: string;
}

export interface CreatePostDataPresenter {
  content: PostContentData[];
}
