export interface QueryGroupsPresenter {
  user_id?: string;
  name?: string;
  category?: string;
  limit: number;
  offset: number;
}

export interface QuerySingleGroupPresenter {
  group_id: string;
}