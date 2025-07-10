"use client";

import { useAuth } from "@/contexts/useAuth";
import DivisionChiefInterface from "./DivisionChiefInterface";
import SectionChiefInterface from "./SectionChiefInterface";
import UnitHeadInterface from "./UnitHeadInterface";
import MonitoringPersonnelInterface from "./MonitoringPersonnelInterface";
import { Card, CardContent } from "@/components/ui/card";

export default function InspectionManagement() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Please log in to access inspection management.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Route based on user level
  const renderInterface = () => {
    switch (user.user_level) {
      case "division_chief":
        return <DivisionChiefInterface />;

      case "eia_air_water_section_chief":
      case "toxic_hazardous_section_chief":
      case "solid_waste_section_chief":
        return <SectionChiefInterface />;

      case "eia_monitoring_unit_head":
      case "air_quality_unit_head":
      case "water_quality_unit_head":
        return <UnitHeadInterface />;

      case "eia_monitoring_personnel":
      case "air_quality_monitoring_personnel":
      case "water_quality_monitoring_personnel":
      case "toxic_chemicals_monitoring_personnel":
      case "solid_waste_monitoring_personnel":
        return <MonitoringPersonnelInterface />;

      default:
        return (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                Your role does not have access to inspection management
                features.
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return <div className="container mx-auto p-6">{renderInterface()}</div>;
}
