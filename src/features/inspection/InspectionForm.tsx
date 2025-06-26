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
import { Loader2 } from "lucide-react";
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

export default function InspectionForm() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
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
      // Handle actual form submission here
    }, 1000);
  };

  const confirmSubmit = () => {
    setShowSaveDialog(false);
    handleSubmit();
  };

  const resetForm = () => {
    setShowClearDialog(false);
    // Reset form logic here
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
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
                {sections.map((section, index) => (
                  <Button
                    key={section.id}
                    variant={currentSection === index ? "default" : "outline"}
                    className="w-full justify-start capitalize"
                    onClick={() => setCurrentSection(index)}
                  >
                    {section.title}
                  </Button>
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
              <CardTitle className="m-0 text-xl">
                {sections[currentSection].title}
              </CardTitle>
              <Separator />
            </CardHeader>
            <CardContent className="p-6">
              {sections[currentSection].component}
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
              Are you sure you want to save this inspection report?
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
