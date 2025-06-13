export interface User {
  user_id: string;
  id: number;
  id_number: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  user_level: "admin" | "manager" | "inspector" | "chief";
  role: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export type ActivityLogDetails =
  | {
      email: string;
      user_level: string;
      status: string;
    } // user_created
  | {
      from: string;
      to: string;
    } // status_changed
  | {
      changes: Record<string, { from: string; to: string }>;
    } // user_updated
  | Record<string, unknown>; // fallback

export interface ActivityLog {
  id: number;
  admin: {
    first_name: string;
    last_name: string;
    id_number: string;
    avatar_url?: string;
  };
  user: {
    first_name: string;
    last_name: string;
    id_number: string;
  };
  action: string;
  details: ActivityLogDetails;
  created_at: string;
}
