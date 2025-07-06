// @/features/map/EstablishmentDetails.tsx
import type { Establishment } from "@/lib/establishmentApi";
import { Building, MapPin, Calendar, Briefcase } from "lucide-react";

interface EstablishmentDetailsProps {
  establishment: Establishment | null;
}

export function EstablishmentDetails({
  establishment,
}: EstablishmentDetailsProps) {
  if (!establishment) {
    return (
      <div className="p-4 text-center text-gray-500">
        Select an establishment to view details
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{establishment.name}</h2>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-gray-900">Address</h3>
            <p className="text-gray-600">
              {establishment.address_line}, {establishment.barangay}
            </p>
            <p className="text-gray-600">
              {establishment.city}, {establishment.province}
            </p>
            <p className="text-gray-600">{establishment.postal_code}</p>
          </div>
        </div>

        {establishment.nature_of_business?.id && (
          <div className="flex items-start gap-3">
            <Briefcase className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900">Nature of Business</h3>
              <p className="text-gray-600">
                {establishment.nature_of_business.name}
              </p>
            </div>
          </div>
        )}

        {establishment.year_established && (
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900">Year Established</h3>
              <p className="text-gray-600">{establishment.year_established}</p>
            </div>
          </div>
        )}

        {establishment.latitude && establishment.longitude && (
          <div className="flex items-start gap-3">
            <Building className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900">Coordinates</h3>
              <p className="text-gray-600">
                {establishment.latitude}, {establishment.longitude}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
