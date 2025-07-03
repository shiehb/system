// src/features/inspection/table/data.ts
export interface TableRow {
  id: number;
  name: string;
  address: string;
  status: string;
  approval: string;
}

export const tableData: Record<string, TableRow[]> = {
  water: [
    {
      id: 1,
      name: "Blue River Bottling Co.",
      address: "123 River Rd",
      status: "in process",
      approval: "pending",
    },
    {
      id: 2,
      name: "Clear Spring Inc.",
      address: "456 Stream Ln",
      status: "done",
      approval: "approved",
    },
  ],
  air: [
    {
      id: 3,
      name: "CleanAir Manufacturing",
      address: "789 Fresh Air St",
      status: "not started",
      approval: "pending",
    },
    {
      id: 4,
      name: "Pure Breathers Corp.",
      address: "101 Windy Rd",
      status: "done",
      approval: "approved",
    },
  ],
  toxic: [
    {
      id: 5,
      name: "Hazmat Solutions",
      address: "Danger Zone",
      status: "in process",
      approval: "pending",
    },
  ],
  solidwaste: [
    {
      id: 6,
      name: "WasteAway Systems",
      address: "Landfill Loop",
      status: "done",
      approval: "approved",
    },
  ],
  eia: [
    {
      id: 7,
      name: "MegaBuild Developers",
      address: "888 Big Blvd",
      status: "in process",
      approval: "pending",
    },
  ],
};
