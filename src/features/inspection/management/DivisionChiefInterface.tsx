"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import type { Report, Inspection } from "@/types/index";
import { mockReports } from "@/data/mockData";
import { ReportsTable } from "@/components/reports/reports-table";
import { InspectionWizard } from "@/components/inspection-wizard/inspection-wizard";

export default function DivisionChiefInterface() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [showInspectionWizard, setShowInspectionWizard] = useState(false);
  const [inspections, setInspections] = useState<Inspection[]>([]);

  const handleApproveReport = (id: string) => {
    setReports(
      reports.map((report) =>
        report.id === id ? { ...report, status: "approved" } : report
      )
    );
    toast.success("Report approved successfully");
    setSelectedReport(null);
    setReviewMode(false);
  };

  const handleStartReport = (id: string) => {
    setReports(
      reports.map((report) =>
        report.id === id ? { ...report, status: "started" } : report
      )
    );
    toast.success("Report started successfully");
    setSelectedReport(null);
  };

  const handleCompleteReport = (id: string) => {
    setReports(
      reports.map((report) =>
        report.id === id ? { ...report, status: "done" } : report
      )
    );
    toast.success("Report marked as completed");
    setSelectedReport(null);
  };

  const handleReviewReport = (report: Report) => {
    setSelectedReport(report);
    setReviewMode(true);
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setReviewMode(false);
  };

  const handleCreateInspection = (inspection: Inspection) => {
    setInspections((prev) => [...prev, inspection]);
  };

  // Show inspection wizard
  if (showInspectionWizard) {
    return (
      <InspectionWizard
        onClose={() => setShowInspectionWizard(false)}
        onCreateInspection={handleCreateInspection}
      />
    );
  }

  // Show report details or review mode
  if (selectedReport) {
    // Implementation for report details and review mode would go here
    // For brevity, I'm keeping this simple
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {reviewMode ? "Final Review" : "Report Details"} -{" "}
            {selectedReport.id}
          </h2>
          <Button variant="outline" onClick={() => setSelectedReport(null)}>
            Back to List
          </Button>
        </div>
        {/* Report details implementation would go here */}
      </div>
    );
  }

  // Main dashboard view
  return (
    <div>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Division Chief Inspection List
            </h1>
            <p className="text-gray-600 mt-2">
              Manage environmental compliance reports and inspections
            </p>
          </div>
          <Button
            onClick={() => setShowInspectionWizard(true)}
            className=" shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Start New Inspection
          </Button>
        </div>

        {/* Reports Table */}
        <ReportsTable
          reports={reports}
          onViewReport={handleViewReport}
          onReviewReport={handleReviewReport}
        />
      </div>
    </div>
  );
}
