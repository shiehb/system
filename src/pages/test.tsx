import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GeneralInformation } from "@/features/inspection/form/GeneralInformation";
import { PurposeOfInspection } from "@/features/inspection/form/PurposeOfInspection";
import { ComplianceStatus } from "@/features/inspection/form/ComplianceStatus";
import { SummaryOfCompliance } from "@/features/inspection/form/SummaryOfCompliance";
import { SummaryOfFindingsAndObservations } from "@/features/inspection/form/SummaryOfFindingsAndObservations";
import { Recommendations } from "@/features/inspection/form/Recommendations";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function InspectionPage() {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: "General Information",
      component: <GeneralInformation />,
    },
    {
      title: "Purpose of Inspection",
      component: <PurposeOfInspection />,
    },
    {
      title: "Compliance Status",
      component: <ComplianceStatus />,
    },
    {
      title: "Summary of Compliance",
      component: <SummaryOfCompliance />,
    },
    {
      title: "Findings & Observations",
      component: <SummaryOfFindingsAndObservations />,
    },
    {
      title: "Recommendations",
      component: <Recommendations />,
    },
  ];

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1));
  };

  return (
    <div className="flex h-[calc(100vh-50px)]">
      {/* Fixed sidebar */}
      <div className="w-[300px] border-r h-full sticky top-0">
        <ScrollArea className="h-full p-4 bg-gray-50">
          <div className="space-y-2">
            <h2 className="font-semibold text-lg mb-4">
              Inspection Navigation
            </h2>
            {pages.map((page, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-full p-3 text-left rounded transition-colors ${
                  currentPage === index
                    ? "bg-blue-100 text-blue-800 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                {page.title}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1">
          <div className="container mx-auto px-4">
            <div className="">
              <h1 className="text-3xl font-bold uppercase text-center">
                Integrated Compliance Inspection Report
              </h1>
              <h2 className="text-xl font-semibold text-center mt-2 text-gray-600">
                {pages[currentPage].title}
              </h2>
            </div>
            {pages[currentPage].component}
          </div>
        </ScrollArea>

        {/* Pagination controls */}
        <div className="border-t p-4 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={goToPrevious}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm text-gray-600">
            Page {currentPage + 1} of {pages.length}
          </div>
          <Button
            variant="outline"
            onClick={goToNext}
            disabled={currentPage === pages.length - 1}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
