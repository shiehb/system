import { GeneralInformation } from "@/features/inspection/form/GeneralInformation";
import { PurposeOfInspection } from "@/features/inspection/form/PurposeOfInspection";
// import { RA6969Form } from "@/features/inspection/form/RA-6969";
import { SummaryOfFindingsAndObservations } from "@/features/inspection/form/SummaryOfFindingsAndObservations";
import { Recommendations } from "@/features/inspection/form/Recommendations";

export default function InspectionPage() {
  return (
    <div className="flex flex-1">
      <div className="container mx-auto px-4 py-6 sm:px-3 md:px-5 lg:px-25">
        <GeneralInformation />
        <PurposeOfInspection />
        {/* <RA6969Form /> */}
        <SummaryOfFindingsAndObservations />
        <Recommendations />
      </div>
    </div>
  );
}
