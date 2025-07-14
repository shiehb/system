// src/types/sidebar-types.ts
import { type LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: Omit<NavItem, "isActive" | "items">[];
}
