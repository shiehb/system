"use client";

import { CheckCircle } from "lucide-react";
import type { Establishment } from "@/types/index";
import { getEstablishmentTypeBadge } from "@/utils/badges";

interface EstablishmentCardProps {
  establishment: Establishment;
  isSelected: boolean;
  onClick: () => void;
}

export function EstablishmentCard({
  establishment,
  isSelected,
  onClick,
}: EstablishmentCardProps) {
  return (
    <div
      className={`group p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "bg-blue-50 border-blue-300 shadow-lg ring-2 ring-blue-100"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h4 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
            {establishment.name}
          </h4>
          {isSelected && (
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
          )}
        </div>
        <div className="space-y-3">
          {getEstablishmentTypeBadge(establishment.type)}
          <p className="text-sm text-gray-600 leading-relaxed">
            {establishment.address}
          </p>
        </div>
      </div>
    </div>
  );
}
