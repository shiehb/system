export interface Report {
  id: number;
  title: string;
  content: string;
  status: ReportStatus;
  type: ReportType;
  establishment_id?: number;
  establishment?: {
    id: number;
    name: string;
    address: string;
  };
  created_by: {
    id: number;
    first_name: string;
    last_name: string;
    user_level: string;
  };
  assigned_to?: {
    id: number;
    first_name: string;
    last_name: string;
    user_level: string;
  };
  reviewed_by?: {
    id: number;
    first_name: string;
    last_name: string;
    user_level: string;
  };
  approved_by?: {
    id: number;
    first_name: string;
    last_name: string;
    user_level: string;
  };
  highlights: ReportHighlight[];
  comments: ReportComment[];
  attachments: ReportAttachment[];
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  reviewed_at?: string;
  approved_at?: string;
  due_date?: string;
  priority: ReportPriority;
  version: number;
  parent_report_id?: number;
}

export type ReportStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "needs_revision"
  | "approved"
  | "rejected";

export type ReportType =
  | "eia_monitoring"
  | "air_quality"
  | "water_quality"
  | "solid_waste"
  | "toxic_hazardous"
  | "compliance"
  | "inspection";

export type ReportPriority = "low" | "medium" | "high" | "urgent";

export interface ReportHighlight {
  id: number;
  report_id: number;
  section: string;
  start_position: number;
  end_position: number;
  highlighted_text: string;
  comment: string;
  created_by: {
    id: number;
    first_name: string;
    last_name: string;
  };
  created_at: string;
  resolved: boolean;
  resolved_at?: string;
}

export interface ReportComment {
  id: number;
  report_id: number;
  content: string;
  created_by: {
    id: number;
    first_name: string;
    last_name: string;
    user_level: string;
  };
  created_at: string;
  parent_comment_id?: number;
  replies?: ReportComment[];
}

export interface ReportAttachment {
  id: number;
  report_id: number;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  uploaded_by: {
    id: number;
    first_name: string;
    last_name: string;
  };
  uploaded_at: string;
}

export interface EstablishmentForwardingType {
  id: number;
  establishment: {
    id: number;
    name: string;
    address: string;
    nature_of_business: string;
  };
  forwarded_from: {
    id: number;
    first_name: string;
    last_name: string;
    user_level: string;
  };
  forwarded_to: {
    id: number;
    first_name: string;
    last_name: string;
    user_level: string;
  };
  forwarding_reason: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "accepted" | "completed" | "rejected";
  forwarded_at: string;
  accepted_at?: string;
  completed_at?: string;
  notes?: string;
  due_date?: string;
}

export interface ReportTemplate {
  id: number;
  name: string;
  description: string;
  type: ReportType;
  sections: ReportSection[];
  created_by: number;
  created_at: string;
  is_active: boolean;
}

export interface ReportSection {
  id: string;
  title: string;
  description?: string;
  required: boolean;
  order: number;
  fields: ReportField[];
}

export interface ReportField {
  id: string;
  name: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "number"
    | "date"
    | "select"
    | "checkbox"
    | "file";
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}
