"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  GeneralInformation,
  PurposeOfInspection,
  ComplianceStatus,
  SummaryOfCompliance,
  SummaryOfFindingsAndObservations,
  Recommendations,
} from "@/features/inspection";
import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
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
    id: number;
    name: string;
    address: string;
    assignedLaw: string;
    assignedCategory: string;
  };
  sectionsToEdit?: string[];
  onComplete?: () => void;
}

// Define the sections of the inspection report
const sections = [
  {
    id: "general",
    title: "General Information",
    component: <GeneralInformation />,
  },
  {
    id: "purpose",
    title: "Purpose of Inspection",
    component: <PurposeOfInspection />,
  },
  {
    id: "compliance",
    title: "Compliance Status",
    component: <ComplianceStatus />,
  },
  {
    id: "summary",
    title: "Summary of Compliance",
    component: <SummaryOfCompliance />,
  },
  {
    id: "findings",
    title: "Findings & Observations",
    component: <SummaryOfFindingsAndObservations />,
  },
  {
    id: "recommendations",
    title: "Recommendations",
    component: <Recommendations />,
  },
];

export default function InspectionForm({
  establishmentData,
  sectionsToEdit = [],
  onComplete,
}: InspectionFormProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  // Calculate progress based on filled form data
  const calculateProgress = () => {
    const filteredSections = getFilteredSections();
    const totalSections = filteredSections.length;
    let completedSections = 0;

    filteredSections.forEach((section) => {
      const sectionData = formData[section.id];
      if (sectionData && Object.keys(sectionData).length > 0) {
        // Check if section has meaningful data (not just empty strings)
        const hasData = Object.values(sectionData).some(
          (value) => value !== "" && value !== null && value !== undefined
        );
        if (hasData) completedSections++;
      }
    });

    return Math.round((completedSections / totalSections) * 100);
  };

  const progressPercentage = calculateProgress();

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
      // Handle actual form submission here
    }, 1000);
  };

  const confirmSubmit = () => {
    setShowSaveDialog(false);
    handleSubmit();
  };

  const resetForm = () => {
    setShowClearDialog(false);
    setFormData({});
    setCurrentSection(0);
  };

  const isSectionRequiresEdit = (sectionTitle: string) => {
    return sectionsToEdit.includes(sectionTitle);
  };

  const getFilteredSections = () => {
    let filteredSections = [...sections];

    if (establishmentData?.assignedLaw) {
      const law = establishmentData.assignedLaw.toLowerCase();

      // Filter sections based on applicable law
      if (law.includes("solid waste")) {
        // Add specific sections for solid waste
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
        // Add specific sections for toxic substances
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
  };

  const filteredSections = getFilteredSections();

  return (
    <div className="flex flex-col min-h-screen w-full">
      {establishmentData && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">
                  ESTABLISHMENT
                </h3>
                <p className="font-medium">{establishmentData.name}</p>
                <p className="text-sm text-muted-foreground">
                  {establishmentData.address}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">
                  APPLICABLE LAW
                </h3>
                <p className="font-medium">{establishmentData.assignedLaw}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">
                  CATEGORY
                </h3>
                <p className="font-medium">
                  {establishmentData.assignedCategory}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Form Completion Progress</span>
              <span>
                {progressPercentage}% Complete ({currentSection + 1} of{" "}
                {filteredSections.length} sections)
              </span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
            <p className="text-xs text-muted-foreground">
              Progress is calculated based on completed form fields across all
              sections
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col lg:flex-row w-full flex-1">
        {/* Sidebar - Navigation */}
        <div className="w-full lg:w-[350px]">
          <Card className="md:min-h-[calc(100vh-59px)] rounded-none flex flex-col">
            <CardHeader>
              <CardTitle className="m-0 text-xl">Inspection Sections</CardTitle>
              <Separator />
            </CardHeader>
            <CardContent className="space-y-2 flex-1">
              <div className="space-y-2">
                {filteredSections.map((section, index) => (
                  <div key={section.id} className="relative">
                    <Button
                      variant={currentSection === index ? "default" : "outline"}
                      className="w-full justify-start capitalize"
                      onClick={() => setCurrentSection(index)}
                    >
                      {section.title}
                      {isSectionRequiresEdit(section.title) && (
                        <AlertTriangle className="w-4 h-4 ml-2 text-yellow-600" />
                      )}
                    </Button>
                    {isSectionRequiresEdit(section.title) && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 text-xs px-1 py-0"
                      >
                        Edit Required
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 w-full px-6 mt-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowClearDialog(true)}
                className="w-full sm:flex-1 capitalize"
              >
                CLEAR FORM
              </Button>
              <Button
                onClick={() => setShowSaveDialog(true)}
                className="w-full sm:flex-1 capitalize"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {isSubmitting ? "Saving..." : "SAVE REPORT"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main content area */}
        <div className="flex-1">
          <Card className="md:min-h-[calc(100vh-59px)] rounded-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="m-0 text-xl">
                  {filteredSections[currentSection].title}
                  {isSectionRequiresEdit(
                    filteredSections[currentSection].title
                  ) && (
                    <Badge variant="destructive" className="ml-2">
                      Edit Required
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrev}
                    disabled={currentSection === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={currentSection === filteredSections.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
              <Separator />
            </CardHeader>
            <CardContent className="p-6">
              {isSectionRequiresEdit(
                filteredSections[currentSection].title
              ) && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                    <h4 className="font-semibold text-yellow-800">
                      This section requires editing
                    </h4>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    Please review and update the information in this section
                    based on the feedback provided.
                  </p>
                </div>
              )}
              {filteredSections[currentSection].component}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Confirmation Dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Save</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save this inspection report? Progress:{" "}
              {progressPercentage}% complete.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {isSubmitting ? "Saving..." : "Confirm Save"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear Form Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Clear Form</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear the form? All unsaved changes will
              be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={resetForm}>
              Clear Form
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
