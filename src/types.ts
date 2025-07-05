export type UserLevel =
  | "administrator"
  | "division_chief"
  | "eia_air_water_section_chief"
  | "toxic_hazardous_section_chief"
  | "solid_waste_section_chief"
  | "eia_monitoring_unit_head"
  | "air_quality_unit_head"
  | "water_quality_unit_head"
  | "eia_monitoring_personnel"
  | "air_quality_monitoring_personnel"
  | "water_quality_monitoring_personnel"
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
