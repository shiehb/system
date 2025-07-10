"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/useAuth";
import { ReportList } from "@/features/reports/components/ReportList";
import { ReportEditor } from "@/features/reports/components/ReportEditor";
import EstablishmentForwarding from "@/features/reports/components/EstablishmentForwarding";
import type { Report } from "@/types/reports";

export default function ReportsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("reports");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handleCreateReport = () => {
    setSelectedReport(null);
    setEditMode(true);
    setActiveTab("editor");
  };

  const handleEditReport = (report: Report) => {
    setSelectedReport(report);
    setEditMode(true);
    setActiveTab("editor");
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setEditMode(false);
    setActiveTab("editor");
  };

  const handleSaveReport = (report: Report) => {
    setSelectedReport(report);
    setActiveTab("reports");
  };

  const handleSubmitReport = (report: Report) => {
    setSelectedReport(report);
    setActiveTab("reports");
  };

  const canManageForwarding = () => {
    return [
      "division_chief",
      "eia_air_water_section_chief",
      "toxic_hazardous_section_chief",
      "solid_waste_section_chief",
      "eia_monitoring_unit_head",
      "air_quality_unit_head",
      "water_quality_unit_head",
    ].includes(user?.user_level || "");
  };

  return (
    <div className="container mx-auto p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="editor">
            {selectedReport
              ? editMode
                ? "Edit Report"
                : "View Report"
              : "New Report"}
          </TabsTrigger>
          {canManageForwarding() && (
            <TabsTrigger value="forwarding">
              Establishment Forwarding
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="reports" className="mt-6">
          <ReportList
            onCreateReport={handleCreateReport}
            onEditReport={handleEditReport}
            onViewReport={handleViewReport}
          />
        </TabsContent>

        <TabsContent value="editor" className="mt-6">
          <ReportEditor
            report={selectedReport}
            onSave={handleSaveReport}
            onSubmit={handleSubmitReport}
            readOnly={!editMode}
          />
        </TabsContent>

        {canManageForwarding() && (
          <TabsContent value="forwarding" className="mt-6">
            <EstablishmentForwarding />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
