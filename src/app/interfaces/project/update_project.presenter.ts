export interface UpdateProjectPresenter {
  owner_id?: string;
  project_id?: string;
  title: string;
  members: Array<string>;
  description: string;
  reference: string;
  reference_type: string;
  annexes: Array<string>;
}
