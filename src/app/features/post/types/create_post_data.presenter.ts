export interface PostContentElement {
  description: string;
  media_locator: string;
  media_type: string;
}

export interface NewPostInputData {
  owner_id?: string;
  description: string;
  privacy: string;
  content_element: PostContentElement[];
}
