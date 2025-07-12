"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  GeneralInformation,
  PurposeOfInspection,
  ComplianceStatus,
  SummaryOfCompliance,
  SummaryOfFindingsAndObservations,
  Recommendations,
} from "@/features/inspection/inspection-sections";
import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface InspectionFormProps {
  establishmentData?: {
    id: string;
    name: string;
    address: string;
    assignedLaw: string;
    assignedCategory: string;
  };
  sectionsToEdit?: string[];
  onComplete?: () => void;
  onSaveDraft?: (formData: Record<string, any>) => void;
  onCancel?: () => void;
  initialData?: Record<string, any>;
}

interface SectionProgress {
  id: string;
  title: string;
  completed: number;
  total: number;
  percentage: number;
  isComplete: boolean;
}

// Define the sections of the inspection report
const sections = [
  {
    id: "general",
    title: "General Information",
    component: <GeneralInformation />,
    requiredFields: [
      "establishmentName",
      "address",
      "coordinates",
      "natureOfBusiness",
      "yearEstablished",
      "inspectionDateTime",
      "operatingHours",
      "operatingDaysPerWeek",
      "operatingDaysPerYear",
      "environmentalLaws",
    ],
  },
  {
    id: "purpose",
    title: "Purpose of Inspection",
    component: <PurposeOfInspection />,
    requiredFields: ["purposes"],
  },
  {
    id: "compliance",
    title: "Compliance Status",
    component: <ComplianceStatus />,
    requiredFields: ["permits"],
  },
  {
    id: "summary",
    title: "Summary of Compliance",
    component: <SummaryOfCompliance />,
    requiredFields: ["items"],
  },
  {
    id: "findings",
    title: "Findings & Observations",
    component: <SummaryOfFindingsAndObservations />,
    requiredFields: ["environmentalSystems"],
  },
  {
    id: "recommendations",
    title: "Recommendations",
    component: <Recommendations />,
    requiredFields: ["recommendations"],
  },
];

export function InspectionForm({
  establishmentData,
  sectionsToEdit = [],
  onComplete,
  onSaveDraft,
  onCancel,
  initialData = {},
}: InspectionFormProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<{ [key: string]: any }>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [sectionProgress, setSectionProgress] = useState<SectionProgress[]>([]);

  // Move getFilteredSections function here, before calculateProgress
  const getFilteredSections = useCallback(() => {
    let filteredSections = [...sections];

    if (establishmentData?.assignedLaw) {
      const law = establishmentData.assignedLaw.toLowerCase();

      // Filter sections based on applicable law
      if (law.includes("solid waste")) {
        filteredSections = sections.filter((section) =>
          [
            "general",
            "purpose",
            "compliance",
            "findings",
            "recommendations",
          ].includes(section.id)
        );
      } else if (law.includes("toxic")) {
        filteredSections = sections.filter((section) =>
          [
            "general",
            "purpose",
            "compliance",
            "summary",
            "recommendations",
          ].includes(section.id)
        );
      }
    }

    return filteredSections;
  }, [establishmentData?.assignedLaw]);

  // Enhanced progress calculation with detailed field tracking
  const calculateSectionProgress = useCallback(
    (sectionId: string, sectionData: any, requiredFields: string[]) => {
      if (!sectionData || Object.keys(sectionData).length === 0) {
        return { completed: 0, total: requiredFields.length, percentage: 0 };
      }

      let completed = 0;
      const total = requiredFields.length;

      requiredFields.forEach((field) => {
        const value = sectionData[field];

        if (Array.isArray(value)) {
          // For arrays (checkboxes, multi-select), check if at least one item is selected
          if (value.length > 0) {
            completed++;
          }
        } else if (typeof value === "object" && value !== null) {
          // For objects, check if it has meaningful data
          const hasData = Object.values(value).some(
            (val) => val !== "" && val !== null && val !== undefined
          );
          if (hasData) completed++;
        } else if (value !== "" && value !== null && value !== undefined) {
          // For primitive values
          completed++;
        }
      });

      const percentage = Math.round((completed / total) * 100);
      return { completed, total, percentage };
    },
    []
  );

  // Update section progress whenever form data changes
  useEffect(() => {
    const filteredSections = getFilteredSections();
    const progress = filteredSections.map((section) => {
      const sectionData = formData[section.id];
      const { completed, total, percentage } = calculateSectionProgress(
        section.id,
        sectionData,
        section.requiredFields
      );

      return {
        id: section.id,
        title: section.title,
        completed,
        total,
        percentage,
        isComplete: percentage === 100,
      };
    });

    setSectionProgress(progress);
  }, [formData, getFilteredSections, calculateSectionProgress]);

  // Calculate overall progress
  const calculateOverallProgress = useCallback(() => {
    if (sectionProgress.length === 0) return 0;

    const totalCompleted = sectionProgress.reduce(
      (sum, section) => sum + section.completed,
      0
    );
    const totalFields = sectionProgress.reduce(
      (sum, section) => sum + section.total,
      0
    );

    return totalFields > 0
      ? Math.round((totalCompleted / totalFields) * 100)
      : 0;
  }, [sectionProgress]);

  const overallProgress = calculateOverallProgress();

  const handleNext = () => {
    const filteredSections = getFilteredSections();
    if (currentSection < filteredSections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      if (onComplete) {
        onComplete();
      }
    }, 1000);
  };

  const confirmSubmit = () => {
    setShowSaveDialog(false);
    handleSubmit();
  };

  const isSectionRequiresEdit = (sectionTitle: string) => {
    return sectionsToEdit.includes(sectionTitle);
  };

  const getSectionProgressInfo = (sectionId: string) => {
    return (
      sectionProgress.find((p) => p.id === sectionId) || {
        completed: 0,
        total: 0,
        percentage: 0,
        isComplete: false,
      }
    );
  };

  const filteredSections = getFilteredSections();
  const currentSectionProgress = getSectionProgressInfo(
    filteredSections[currentSection]?.id
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with establishment info and actions */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">
                Inspection Form
              </h1>
              {establishmentData && (
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>
                    <strong>Establishment:</strong> {establishmentData.name}
                  </span>
                  <span>
                    <strong>Law:</strong> {establishmentData.assignedLaw}
                  </span>
                  <span>
                    <strong>Nature of Business:</strong>{" "}
                    {establishmentData.assignedCategory}
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons in upper right */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (onCancel) onCancel();
                }}
                className="hidden sm:flex"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (onSaveDraft) onSaveDraft(formData);
                }}
              >
                Save Draft
              </Button>
              <Button onClick={() => setShowSaveDialog(true)} className="">
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">
                    Overall Form Progress
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {sectionProgress.filter((s) => s.isComplete).length} of{" "}
                    {sectionProgress.length} sections completed
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {overallProgress}%
                  </div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
              </div>
              <Progress value={overallProgress} className="w-full h-4" />

              {/* Section Progress Overview */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
                {sectionProgress.map((section, index) => (
                  <div
                    key={section.id}
                    className={`p-3 rounded-lg border text-center cursor-pointer transition-all hover:shadow-md ${
                      currentSection === index
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : section.isComplete
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => setCurrentSection(index)}
                  >
                    <div className="flex items-center justify-center mb-2">
                      {section.isComplete ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div className="text-xs font-medium truncate mb-1">
                      {section.title}
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {section.completed}/{section.total} fields
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          section.isComplete ? "bg-green-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${section.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Section Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl flex items-center">
                  {filteredSections[currentSection]?.title}
                  {isSectionRequiresEdit(
                    filteredSections[currentSection]?.title
                  ) && (
                    <Badge variant="destructive" className="ml-2">
                      Edit Required
                    </Badge>
                  )}
                </CardTitle>

                {/* Current Section Progress */}
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Section Progress</span>
                    <span>
                      {currentSectionProgress.completed} of{" "}
                      {currentSectionProgress.total} fields completed
                    </span>
                  </div>
                  <Progress
                    value={currentSectionProgress.percentage}
                    className="w-full h-2"
                  />
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center space-x-2 ml-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  disabled={currentSection === 0}
                  className="flex items-center bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentSection === filteredSections.length - 1}
                  className="flex items-center bg-transparent"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
            <Separator />
          </CardHeader>
          <CardContent className="p-6">
            {isSectionRequiresEdit(filteredSections[currentSection]?.title) && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <h4 className="font-semibold text-yellow-800">
                    This section requires editing
                  </h4>
                </div>
                <p className="text-yellow-700 text-sm mt-1">
                  Please review and update the information in this section based
                  on the feedback provided.
                </p>
              </div>
            )}
            {filteredSections[currentSection]?.component}
          </CardContent>
        </Card>
      </div>

      {/* Save Confirmation Dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this inspection report?
              <br />
              <br />
              <strong>Overall Progress:</strong> {overallProgress}% complete
              <br />
              <strong>Completed Sections:</strong>{" "}
              {sectionProgress.filter((s) => s.isComplete).length} of{" "}
              {sectionProgress.length}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {isSubmitting ? "Submitting..." : "Confirm Submission"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
export default InspectionForm;
