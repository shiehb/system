import { createContext } from "react";
import { type User, type UserLevel } from "@/types";

export interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  login_user: (email: string, password: string) => Promise<void>;
  register_user: (
    email: string,
    first_name: string,
    last_name: string,
    middle_name: string,
    password: string,
    user_level: UserLevel
  ) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
