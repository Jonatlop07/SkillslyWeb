export interface GroupPresenter {
  id: string;
  name: string;
  description: string;
  category?: string;
  picture: string;
  isOwner?: boolean;
  isMember?: boolean;
  existsRequest?: boolean;
}
