import {
  AddEstablishment,
  EstablishmentsList,
} from "@/features/establishments";

export default function EstablishmentPage() {
  // Sample data for the table with proper typing
  const establishments = [
    {
      id: 1,
      name: "Sample Establishment 1",
      address: "123 Main St",
      coordinates: "40.7128, -74.0060",
      year: "2020",
      createdAt: "2023-05-15",
    },
    {
      id: 2,
      name: "Sample Establishment 2",
      address: "456 Oak Ave",
      coordinates: "34.0522, -118.2437",
      year: "2018",
      createdAt: "2023-06-20",
    },
  ];

  return (
    <div className="flex flex-1">
      <div className="flex flex-col lg:flex-row gap-4 p-4 w-full">
        {/* First Column - fixed 350px width on desktop, full width on mobile */}
        <div className="w-full lg:w-[350px]">
          <AddEstablishment />
        </div>

        {/* Second Column - takes remaining space on desktop, full width on mobile */}
        <div className="flex-1 w-full overflow-x-auto">
          <EstablishmentsList establishments={establishments} />
        </div>
      </div>
    </div>
  );
}
