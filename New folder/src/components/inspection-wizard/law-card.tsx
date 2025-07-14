"use client";

import { CheckCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { Law } from "@/types/index";
import { getLawCategoryBadge } from "@/utils/badges";

interface LawCardProps {
  law: Law;
  isSelected: boolean;
  onToggle: () => void;
}

export function LawCard({ law, isSelected, onToggle }: LawCardProps) {
  return (
    <div
      className={`group p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "bg-green-50 border-green-300 shadow-lg ring-2 ring-green-100"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start space-x-4">
        <div className="flex items-center pt-1">
          <Checkbox
            id={law.id}
            checked={isSelected}
            onCheckedChange={onToggle}
            className="w-5 h-5"
          />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-lg text-blue-900">
                {law.code}
              </span>
              {getLawCategoryBadge(law.category)}
            </div>
            {isSelected && <CheckCircle className="w-5 h-5 text-green-600" />}
          </div>
          <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
            {law.title}
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {law.description}
          </p>
        </div>
      </div>
    </div>
  );
}
