export interface ServiceRequestModel {
  service_request_id: string;
  owner_id: string;
  title: string;
  service_brief: string;
  contact_information: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}
