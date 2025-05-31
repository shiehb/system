export interface User {
  id: number;
  id_number: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  user_level: 'admin' | 'manager' | 'inspector';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}