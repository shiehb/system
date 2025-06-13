import { createContext } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login_user: (id_number: string, password: string) => Promise<void>;
  register_user: (
    id_number: string,
    first_name: string,
    last_name: string,
    middle_name: string,
    email: string,
    password: string,
    cPassword: string,
    user_level: string,
    status: string,
    role: string
  ) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
