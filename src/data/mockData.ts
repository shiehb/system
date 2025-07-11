import type { Report, Establishment, Law } from "@/types/index";

export const mockReports: Report[] = [
  {
    id: "EIA-2024-001",
    section: "eia_air_water",
    establishment: "ABC Manufacturing Corp",
    submittedBy: "Maria Santos",
    submissionDate: "2024-01-15",
    status: "started",
    lastUpdated: "2024-01-18",
    complianceScore: 92,
    issuesIdentified: ["Incomplete emissions data"],
    feedback: "Please ensure all emissions data is included in future reports",
  },
  {
    id: "TOX-2024-002",
    section: "toxic",
    establishment: "XYZ Chemical Plant",
    submittedBy: "Juan Dela Cruz",
    submissionDate: "2024-01-18",
    status: "pending",
    lastUpdated: "2024-01-22",
    complianceScore: 78,
    issuesIdentified: [
      "Missing safety protocols",
      "Incomplete waste disposal records",
    ],
    feedback: "Please address all safety protocol documentation",
  },
  {
    id: "SW-2024-003",
    section: "solidwaste",
    establishment: "MNO Waste Treatment",
    submittedBy: "Ana Rodriguez",
    submissionDate: "2024-01-20",
    status: "not_started",
    lastUpdated: "2024-01-20",
  },
  {
    id: "EIA-2024-004",
    section: "eia_air_water",
    establishment: "GHI Mining Corp",
    submittedBy: "Carlos Mendoza",
    submissionDate: "2024-01-22",
    status: "in_progress",
    lastUpdated: "2024-01-25",
    complianceScore: 65,
    issuesIdentified: ["Incomplete EIA", "Missing mitigation plans"],
    feedback: "Complete all sections and resubmit with mitigation plans",
  },
  {
    id: "EIA-2024-005",
    section: "eia_air_water",
    establishment: "DEF Power Plant",
    submittedBy: "Luis Gomez",
    submissionDate: "2024-01-24",
    status: "done",
    lastUpdated: "2024-01-28",
    complianceScore: 88,
  },
  {
    id: "TOX-2024-006",
    section: "toxic",
    establishment: "JKL Pharmaceuticals",
    submittedBy: "Sofia Ramirez",
    submissionDate: "2024-01-26",
    status: "approved",
    lastUpdated: "2024-01-30",
    complianceScore: 95,
  },
];

export const mockEstablishments: Establishment[] = [
  {
    id: "EST-001",
    name: "ABC Manufacturing Corp",
    type: "manufacturing",
    address: "123 Industrial Ave, Metro Manila",
  },
  {
    id: "EST-002",
    name: "XYZ Chemical Plant",
    type: "chemical",
    address: "456 Chemical Blvd, Laguna",
  },
  {
    id: "EST-003",
    name: "MNO Waste Treatment",
    type: "waste",
    address: "789 Waste Management St, Cavite",
  },
  {
    id: "EST-004",
    name: "GHI Mining Corp",
    type: "mining",
    address: "321 Mining Road, Benguet",
  },
  {
    id: "EST-005",
    name: "DEF Power Plant",
    type: "power",
    address: "654 Power Station Ave, Bataan",
  },
  {
    id: "EST-006",
    name: "JKL Pharmaceuticals",
    type: "pharmaceutical",
    address: "987 Pharma Complex, Rizal",
  },
];

export const inspectionLaws: Law[] = [
  {
    id: "LAW-004",
    code: "PD 1586",
    title: "Environmental Impact Assessment System",
    category: "environmental",
    description:
      "Establishing an environmental impact assessment system including other environmental management related measures",
  },
  {
    id: "LAW-003",
    code: "RA 6969",
    title:
      "Toxic Substances and Hazardous and Nuclear Wastes Control Act of 1990",
    category: "toxic",
    description:
      "Control and regulation of importation, manufacture, processing, handling, storage, transportation, sale, distribution, use and disposal of toxic substances and hazardous and nuclear wastes",
  },
  {
    id: "LAW-001",
    code: "RA 8749",
    title: "Philippine Clean Air Act of 1999",
    category: "emissions",
    description: "Comprehensive air pollution control policy",
  },
  {
    id: "LAW-005",
    code: "RA 9275",
    title: "Philippine Clean Water Act of 2004",
    category: "environmental",
    description:
      "Comprehensive water quality management and for other purposes",
  },
  {
    id: "LAW-002",
    code: "RA 9003",
    title: "Ecological Solid Waste Management Act of 2000",
    category: "waste",
    description:
      "Systematic, comprehensive and ecological solid waste management program",
  },
];
