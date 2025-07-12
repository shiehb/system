export type UserLevel =
  | "admin"
  | "chief"
  | "section_chief"
  | "unit_head"
  | "inspector"
  | "monitoring_personnel";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  user_level: UserLevel;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  section: "eia_air_water" | "toxic" | "solidwaste";
  establishment: string;
  submittedBy: string;
  submissionDate: string;
  status:
    | "not_started"
    | "pending"
    | "started"
    | "in_progress"
    | "done"
    | "approved";
  lastUpdated: string;
  complianceScore?: number;
  issuesIdentified?: string[];
  feedback?: string;
}

export interface Establishment {
  id: string;
  name: string;
  type:
    | "manufacturing"
    | "chemical"
    | "mining"
    | "power"
    | "waste"
    | "pharmaceutical";
  address: string;
}

export interface Law {
  id: string;
  code: string;
  title: string;
  category: "environmental" | "safety" | "waste" | "emissions" | "toxic";
  description: string;
}

export interface Inspection {
  id: string;
  establishmentId: string;
  establishmentName: string;
  applicableLaws: string[];
  createdBy: string;
  createdDate: string;
  status: "scheduled" | "in_progress" | "completed";
}

export interface InspectionQueueItem {
  establishment: Establishment;
  laws: string[];
}
