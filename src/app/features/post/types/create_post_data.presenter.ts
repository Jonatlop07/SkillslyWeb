export interface PostContentData {
  description: string;
  media: File;
  media_type: string;
}

export interface CreatePostDataPresenter {
  description: string,
  content_element: PostContentData[];
  privacy: string;
}
