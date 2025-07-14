"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface WizardHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
}

export function WizardHeader({
  currentStep,
  totalSteps,
  onBack,
}: WizardHeaderProps) {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto  sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl font-semibold text-gray-900">
              Create New Inspection
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              Step {currentStep} of {totalSteps}
            </Badge>
            <div className="flex space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map(
                (step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      step === currentStep
                        ? "bg-blue-600 shadow-sm"
                        : step < currentStep
                        ? "bg-green-600"
                        : "bg-gray-300"
                    }`}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
