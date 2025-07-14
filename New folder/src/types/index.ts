// Consolidated types from original types/index.ts and types.ts, and lib/establishmentApi.ts

export type UserLevel =
  | "administrator"
  | "division_chief"
  | "eia_air_water_section_chief"
  | "toxic_hazardous_section_chief"
  | "solid_waste_section_chief"
  | "eia_monitoring_unit_head"
  | "air_quality_unit_head"
  | "water_quality_unit_head"
  | "toxic_chemicals_monitoring_personnel"
  | "solid_waste_monitoring_personnel";

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  user_level: UserLevel;
  status: "active" | "inactive";
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  using_default_password?: boolean;
}

export type ActivityLogDetails = {
  email?: string;
  user_level?: string;
  status?: string;
  from?: string;
  to?: string;
  changes?: Record<string, { from: string; to: string }>;
  full_name?: string;
  reset_to_default?: boolean;
  fields_updated?: string[];
  avatar_file?: string;
  ip_address?: string;
  first_name?: string;
  last_name?: string;
};

export interface ActivityLog {
  id: number;
  admin: {
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
  } | null;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  action: string;
  details: ActivityLogDetails;
  created_at: string;
}

export interface NatureOfBusiness {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Establishment {
  id: number;
  name: string;
  address: string;
  coordinates: string;
  year: string; // This might be year_established, check usage
  createdAt: string; // This is created_at in backend, check usage
  address_line: string;
  barangay: string;
  city: string;
  province: string;
  region: string;
  postal_code: string;
  latitude?: string;
  longitude?: string;
  year_established?: string | null;
  nature_of_business?: NatureOfBusiness | null;
  polygon?: {
    coordinates: any;
    created_at: string;
  } | null;
  is_archived?: boolean;
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
