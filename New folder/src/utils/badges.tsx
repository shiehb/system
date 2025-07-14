import { Badge } from "@/components/ui/badge";
import { Clock, FileText, CheckCircle, AlertCircle } from "lucide-react";
import type { Report, Establishment, Law } from "@/types/index";

export const getStatusBadge = (status: Report["status"]) => {
  const config = {
    not_started: {
      variant: "secondary" as const,
      icon: Clock,
      label: "Not Started",
    },
    pending: {
      variant: "default" as const,
      icon: FileText,
      label: "Pending Review",
    },
    started: {
      variant: "default" as const,
      icon: CheckCircle,
      label: "Started",
    },
    in_progress: {
      variant: "destructive" as const,
      icon: AlertCircle,
      label: "In Progress",
    },
    done: {
      variant: "secondary" as const,
      icon: CheckCircle,
      label: "Completed",
    },
    approved: {
      variant: "success" as const,
      icon: CheckCircle,
      label: "Approved",
    },
  };

  const { variant, icon: Icon, label } = config[status];

  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <Icon className="w-3 h-3" />
      {label}
    </Badge>
  );
};

export const getSectionBadge = (section: Report["section"]) => {
  const config = {
    eia_air_water: { variant: "default" as const, label: "EIA/Air/Water" },
    toxic: { variant: "destructive" as const, label: "Toxic Substances" },
    solidwaste: { variant: "secondary" as const, label: "Solid Waste" },
  };

  const { variant, label } = config[section];
  return <Badge variant={variant}>{label}</Badge>;
};

export const getEstablishmentTypeBadge = (type: Establishment["type"]) => {
  const config = {
    manufacturing: { variant: "default" as const, label: "Manufacturing" },
    chemical: { variant: "destructive" as const, label: "Chemical" },
    mining: { variant: "secondary" as const, label: "Mining" },
    power: { variant: "outline" as const, label: "Power" },
    waste: { variant: "secondary" as const, label: "Waste" },
    pharmaceutical: { variant: "default" as const, label: "Pharmaceutical" },
  };

  const { variant, label } = config[type];
  return <Badge variant={variant}>{label}</Badge>;
};

export const getLawCategoryBadge = (category: Law["category"]) => {
  const config = {
    environmental: { variant: "default" as const, label: "Environmental" },
    safety: { variant: "secondary" as const, label: "Safety" },
    waste: { variant: "outline" as const, label: "Waste" },
    emissions: { variant: "destructive" as const, label: "Emissions" },
    toxic: { variant: "destructive" as const, label: "Toxic" },
  };

  const { variant, label } = config[category];
  return <Badge variant={variant}>{label}</Badge>;
};
