export interface ServiceRequestPresenter {
  service_request_id: string;
  owner_id: string;
  title: string;
  service_brief: string;
  contact_information: string;
  category: string;
  phase: string;
  applicants: Array<string>;
  service_provider: string;
  provider_requested_status_update: boolean;
  created_at?: string;
  updated_at?: string;
}
