"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationButtonsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  showPrevious?: boolean;
  children?: React.ReactNode;
}

export function NavigationButtons({
  onPrevious,
  onNext,
  nextDisabled = false,
  nextLabel = "Next",
  showPrevious = true,
  children,
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between items-center pt-8">
      <div>
        {showPrevious && onPrevious && (
          <Button
            variant="outline"
            onClick={onPrevious}
            className="hover:bg-gray-50 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
        )}
      </div>

      <div className="flex space-x-3">
        {children}
        {onNext && (
          <Button
            onClick={onNext}
            disabled={nextDisabled}
            className=" disabled:opacity-50"
          >
            {nextLabel}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
