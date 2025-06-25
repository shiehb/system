import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GeneralInformation,
  PurposeOfInspection,
  ComplianceStatus,
  SummaryOfCompliance,
  SummaryOfFindingsAndObservations,
  Recommendations,
} from "@/features/inspection";
import { useState } from "react";

// Define the sections of the inspection report
const sections = [
  {
    id: "general",
    title: "General Info",
    component: <GeneralInformation />,
  },
  {
    id: "purpose",
    title: "Purpose",
    component: <PurposeOfInspection />,
  },
  {
    id: "compliance",
    title: "Compliance",
    component: <ComplianceStatus />,
  },
  {
    id: "summary",
    title: "Findings",
    component: <SummaryOfCompliance />,
  },
  {
    id: "findings",
    title: "Findings",
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

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex flex-col lg:flex-row w-full flex-1">
        {/* Sidebar - 350px wide on desktop, hidden on mobile with toggle */}
        <div className="w-full lg:w-[350px] p-4 pr-0">
          <div className="sticky top-4 space-y-4">
            <Card className="p-4">
              <h2 className="font-semibold text-lg mb-2">
                Inspection Navigation
              </h2>
              <div className="space-y-2">
                {sections.map((section, index) => (
                  <Button
                    key={section.id}
                    variant={currentSection === index ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setCurrentSection(index)}
                  >
                    {section.title}
                  </Button>
                ))}
              </div>
            </Card>
            <Card className="p-2">
              <h2 className="font-semibold text-lg mb-2">Quick Actions</h2>
              <div className="space-y-2">
                <Button className="w-full">Save Draft</Button>
                <Button variant="outline" className="w-full">
                  Preview Report
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Mobile sidebar toggle */}
        <div className="lg:hidden p-2 border-b">
          <Button variant="outline" className="w-full">
            Show Inspection Menu
          </Button>
        </div>

        {/* Main content area */}
        <div className="flex-1 p-4 pb-20">
          {" "}
          {/* Added pb-20 to prevent content from being hidden behind fixed pagination */}
          <Card className="p-6 mb-6">{sections[currentSection].component}</Card>
        </div>
      </div>

      {/* Fixed pagination control at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentSection === 0}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Section {currentSection + 1} of {sections.length}:{" "}
            {sections[currentSection].title}
          </div>
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentSection === sections.length - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
