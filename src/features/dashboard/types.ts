export interface DashboardStats {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
}

export interface DashboardConfig {
  stats: DashboardStats[];
  showInspectionList?: boolean;
  showRecentActivity?: boolean;
  showQuickActions?: boolean;
}
