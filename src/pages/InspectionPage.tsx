import { InspectionTasking, InspectionForm } from "@/features/inspection";
export default function InspectionPage() {
  return (
    <div className="flex flex-col [--header-height:calc(theme(spacing.14))]">
      <InspectionTasking />
      <InspectionForm />
    </div>
  );
}
