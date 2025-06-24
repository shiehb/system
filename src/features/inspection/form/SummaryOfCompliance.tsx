import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const complianceSummarySchema = z.object({
  items: z.array(
    z.object({
      lawId: z.string(),
      applicableLaw: z.string().optional(),
      lawCitation: z.string(),
      conditionNumber: z.string().optional(),
      conditionId: z.string(),
      complianceRequirement: z.string(),
      complianceRequirementInput: z.string().optional(),
      compliant: z.enum(["Yes", "No", "N/A"]),
      remarks: z.string().optional(),
      remarkLabel: z.string().optional(),
    })
  ),
});

type ComplianceItem = z.infer<typeof complianceSummarySchema>["items"][number];

export default function SummaryOfCompliance() {
  const form = useForm<z.infer<typeof complianceSummarySchema>>({
    resolver: zodResolver(complianceSummarySchema),
    defaultValues: {
      items: [
        // PD-1586 condition)
        {
          lawId: "PD-1586",
          lawCitation:
            "PD-1586: Environmental Compliance Certificate (ECC) Conditionalities",
          conditionNumber: "",
          conditionId: "PD-1586-1",
          complianceRequirement: "",
          compliant: "N/A",
          remarks: "",
        },

        // Priority Chemical List (PCL)
        {
          lawId: "RA-6969",
          applicableLaw: "Priority Chemical List",
          lawCitation:
            "RA 6969: Toxic Substances and Hazardous and Nuclear Waste Control Act",
          conditionId: "RA-6969-PCL-1",
          complianceRequirement: "Valid PCL Compliance Certificate",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-6969",
          applicableLaw: "Priority Chemical List",
          lawCitation:
            "RA 6969: Toxic Substances and Hazardous and Nuclear Waste Control Act",
          conditionId: "RA-6969-PCL-2",
          complianceRequirement: "Annual Reporting",
          compliant: "N/A",
          remarks: "",
        },

        // Chemical Control Order (CCO)
        {
          lawId: "RA-6969",
          applicableLaw: "Chemical Control Order",
          lawCitation:
            "RA 6969: Toxic Substances and Hazardous and Nuclear Waste Control Act",
          conditionId: "RA-6969-CCO-1",
          complianceRequirement:
            "Biennial Report for those chemicals that are for issuance of CCO",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-6969",
          applicableLaw: "Chemical Control Order",
          lawCitation:
            "RA 6969: Toxic Substances and Hazardous and Nuclear Waste Control Act",
          conditionId: "RA-6969-CCO-2",
          complianceRequirement: "CCO Registration",
          compliant: "N/A",
          remarks: "",
        },

        // Importation
        {
          lawId: "RA-6969",
          applicableLaw: "Importation",
          lawCitation:
            "RA 6969: Toxic Substances and Hazardous and Nuclear Waste Control Act",
          conditionId: "RA-6969-IMP-1",
          complianceRequirement: "Valid Small Quantity Importation Clearance",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-6969",
          applicableLaw: "Importation",
          lawCitation:
            "RA 6969: Toxic Substances and Hazardous and Nuclear Waste Control Act",
          conditionId: "RA-6969-IMP-2",
          complianceRequirement: "Valid Importation Clearance",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-6969",
          applicableLaw: "Importation",
          lawCitation:
            "RA 6969: Toxic Substances and Hazardous and Nuclear Waste Control Act",
          conditionId: "RA-6969-IMP-3",
          complianceRequirement: "Bill of Lading",
          compliant: "N/A",
          remarks: "",
        },

        // Hazardous Waste Generator
        {
          lawId: "RA-6969",
          applicableLaw: "Hazardous Waste Generator",
          lawCitation:
            "RA 6969: Toxic Substances and Hazardous and Nuclear Waste Control Act",
          conditionId: "RA-6969-HWG-1",
          complianceRequirement: "Registration as Hazardous Waste Generator",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-6969",
          applicableLaw: "Hazardous Waste Generator",
          lawCitation:
            "RA 6969: Toxic Substances and Hazardous and Nuclear Waste Control Act",
          conditionId: "RA-6969-HWG-2",
          complianceRequirement: "With temporary Hazwaste storage facility",
          compliant: "N/A",
          remarks: "",
        },

        // Hazardous Waste Storage and Labeling
        {
          lawId: "RA-6969",
          applicableLaw: "Hazardous Waste Storage and Labeling",
          lawCitation:
            "RA 6969: Toxic Substances and Hazardous and Nuclear Waste Control Act",
          conditionId: "RA-6969-HWSL-1",
          complianceRequirement: "Hazardous waste properly labelled",
          compliant: "N/A",
          remarks: "",
        },

        {
          lawId: "RA-6969",
          applicableLaw: "Hazardous Waste Storage and Labeling",
          lawCitation:
            "RA 6969: Toxic Substances and Hazardous and Nuclear Waste Control Act",
          conditionId: "RA-6969-WTD-1",
          complianceRequirement: "Valid Permit to Transport",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-6969",
          applicableLaw: "Hazardous Waste Storage and Labeling",
          lawCitation:
            "RA 6969: Toxic Substances and Hazardous and Nuclear Waste Control Act",
          conditionId: "RA-6969-WTD-2",
          complianceRequirement:
            "Valid Registration of Transporters and Treaters",
          compliant: "N/A",
          remarks: "",
        },

        // Waste Transporter; Waste Transport Record; Waste Treatment and Disposal Premises
        {
          lawId: "RA-6969",
          applicableLaw:
            "Waste Transporter; Waste Transport Record; Waste Treatment and Disposal Premises",
          lawCitation:
            "RA 6969: Toxic Substances and Hazardous and Nuclear Waste Control Act",
          conditionId: "RA-6969-WTD-3",
          complianceRequirement:
            "Compliance with Manifest System (Waste Transport Record)",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-6969",
          applicableLaw:
            "Waste Transporter; Waste Transport Record; Waste Treatment and Disposal Premises",
          lawCitation:
            "RA 6969: Toxic Substances and Hazardous and Nuclear Waste Control Act",
          conditionId: "RA-6969-WTD-4",
          complianceRequirement:
            "Valid/completed Certificate of Treatment (COT)",
          compliant: "N/A",
          remarks: "",
        },
        // Permit to Operate (Air)
        {
          lawId: "RA-8749",
          applicableLaw: "Permit to Operate (Air)",
          lawCitation: "RA 8749: Philippine Clean Air Act",
          conditionId: "RA-8749-AQ-1",
          complianceRequirement: "With valid POA",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-8749",
          applicableLaw: "Permit to Operate (Air)",
          lawCitation: "RA 8749: Philippine Clean Air Act",
          conditionId: "RA-8749-AQ-2",
          complianceRequirement:
            "All emission sources are covered by a valid POA",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-8749",
          applicableLaw: "Permit to Operate (Air)",
          lawCitation: "RA 8749: Philippine Clean Air Act",
          conditionId: "RA-8749-AQ-3",
          complianceRequirement:
            "POA is displayed in a conspicuous place near the installation",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-8749",
          applicableLaw: "Permit to Operate (Air)",
          lawCitation: "RA 8749: Philippine Clean Air Act",
          conditionId: "RA-8749-AQ-4",
          complianceRequirement: "All Permit Conditions are complied with",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-8749",
          applicableLaw: "Permit to Operate (Air)",
          lawCitation: "RA 8749: Philippine Clean Air Act",
          conditionId: "RA-8749-AQ-5",
          complianceRequirement:
            "Wind direction device installed (if applicable)",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-8749",
          applicableLaw: "Permit to Operate (Air)",
          lawCitation: "RA 8749: Philippine Clean Air Act",
          conditionId: "RA-8749-AQ-6",
          complianceRequirement:
            "Plant operational problems lasting for more than 1 hr reported to EMB within 24 hrs.",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-8749",
          applicableLaw: "Permit to Operate (Air)",
          lawCitation: "RA 8749: Philippine Clean Air Act",
          conditionId: "RA-8749-AQ-7",
          complianceRequirement: "CCTV installed (for large sources only)",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-8749",
          applicableLaw: "Permit to Operate (Air)",
          lawCitation: "RA 8749: Philippine Clean Air Act",
          conditionId: "RA-8749-AQ-8",
          complianceRequirement:
            "CEMS/PEMS installed (for petroleum refineries, power/cement plants or sources emitting 750Tons/yr.)",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-8749",
          applicableLaw: "Permit to Operate (Air)",
          lawCitation: "RA 8749: Philippine Clean Air Act",
          conditionId: "RA-8749-AQ-9",
          complianceRequirement:
            "Yearly RATA/Quarterly CGA conducted (for sources w/ CEMS)",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-8749",
          applicableLaw: "Emission Testing(if applicable)",
          lawCitation: "RA 8749: Philippine Clean Air Act",
          conditionId: "RA-8749-AQ-10",
          complianceRequirement:
            "Compliance with emission standards (if applicable)",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-8749",
          applicableLaw: "Ambient Testing (if applicable)",
          lawCitation: "RA 8749: Philippine Clean Air Act",
          conditionId: "RA-8749-AQ-11",
          complianceRequirement:
            "Compliance with ambient air quality standards (if applicable)",
          compliant: "N/A",
          remarks: "",
        }, //Water Quality Managements

        {
          lawId: "RA-9275",
          applicableLaw: "Discharge Permit (DP)",
          lawCitation: "RA 9275: Philippine Clean Water Act",
          conditionId: "RA-9275-WQ-1",
          complianceRequirement: "With valid Discharge Permit",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-9275",
          applicableLaw: "Discharge Permit (DP)",
          lawCitation: "RA 9275: Philippine Clean Water Act",
          conditionId: "RA-9275-WQ-2",
          complianceRequirement:
            "Volume of Discharge consistent with DP issued?",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-9275",
          applicableLaw: "Discharge Permit (DP)",
          lawCitation: "RA 9275: Philippine Clean Water Act",
          conditionId: "RA-9275-WQ-3",
          complianceRequirement: "All permit conditions are complied with?",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-9275",
          applicableLaw: "Discharge Permit (DP)",
          lawCitation: "RA 9275: Philippine Clean Water Act",
          conditionId: "RA-9275-WQ-4",
          complianceRequirement:
            "With working flow metering device (if applicable)",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-9275",
          applicableLaw: "Discharge Permit (DP)",
          lawCitation: "RA 9275: Philippine Clean Water Act",
          conditionId: "RA-9275-WQ-5",
          complianceRequirement:
            "Certificate of septage siphoning hauled by accredited service provider",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-9275",
          applicableLaw: "Effluent Test Results (if applicable)",
          lawCitation: "RA 9275: Philippine Clean Water Act",
          conditionId: "RA-9275-WQ-6",
          complianceRequirement: "In compliance with effluent standards.",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-9275",
          applicableLaw: "Ambient water quality monitoring (if applicable)",
          lawCitation: "RA 9275: Philippine Clean Water Act",
          conditionId: "RA-9275-WQ-7",
          complianceRequirement:
            "With ambient water quality monitoring results ",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-9275",
          applicableLaw: "Wastewater Charge System (if applicable)",
          lawCitation: "RA 9275: Philippine Clean Water Act",
          conditionId: "RA-9275-WQ-8",
          complianceRequirement: "Payment of Wastewater Charges",
          compliant: "N/A",
          remarks: "",
        },
        // Solid Waste Managements
        {
          lawId: "RA-9003",
          applicableLaw: "Waste Segregation",
          lawCitation: "RA 9003: Ecological Solid Waste Management Act",
          conditionId: "RA-9003-SW-1",
          complianceRequirement: "With MRF on site",
          compliant: "N/A",
          remarks: "",
          remarkLabel: "Total amount of solid waste generated per quarter:",
        },
        {
          lawId: "RA-9003",
          applicableLaw: "Waste Segregation",
          lawCitation: "RA 9003: Ecological Solid Waste Management Act",
          conditionId: "RA-9003-SW-2",
          complianceRequirement:
            "Segregated solid waste collected by LGU or Private Contractor Name of PC:",
          complianceRequirementInput: "",
          compliant: "N/A",
          remarks: "",
          remarkLabel: "Amount of Recyclables per quarter:",
        },
        {
          lawId: "RA-9003",
          applicableLaw: "Waste Segregation",
          lawCitation: "RA 9003: Ecological Solid Waste Management Act",
          conditionId: "RA-9003-SW-3",
          complianceRequirement: "With composting facility (if applicable)",
          compliant: "N/A",
          remarks: "",
          remarkLabel: "Amount of compostable per quarter:",
        },
        {
          lawId: "RA-9003",
          applicableLaw: "Solid Waste Disposal",
          lawCitation: "RA 9003: Ecological Solid Waste Management Act",
          conditionId: "RA-9003-SW-4",
          complianceRequirement: "Residuals are disposed to a SLF",
          compliant: "N/A",
          remarks: "",
          remarkLabel: "Amount of residuals generated per quarter:",
        },
        {
          lawId: "RA-9003",
          applicableLaw: "Solid Waste Disposal",
          lawCitation: "RA 9003: Ecological Solid Waste Management Act",
          conditionId: "RA-9003-SW-5",
          complianceRequirement: "With MOA/Agreement with LGU",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "PCO",
          applicableLaw:
            "DAO 2014-02 or Revised Guidelines on PCO Accreditation",
          lawCitation: "Pollution Control Officer Accreditation",
          conditionId: "PCO-ACC-1",
          complianceRequirement: "With valid PCO accreditation certificate",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "PCO",
          applicableLaw:
            "DAO 2014-02 or Revised Guidelines on PCO Accreditation",
          lawCitation: "Pollution Control Officer Accreditation",
          conditionId: "PCO-ACC-2",
          complianceRequirement:
            "Managing head with 8 hrs. training certification",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "SMR",
          applicableLaw: "DAO 2003-27",
          lawCitation: "Self-Monitoring Report",
          conditionId: "SMR-DAO-1",
          complianceRequirement:
            "Complete and timely submission of SMRs (quarterly)",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "SMR",
          applicableLaw: "DAO 2003-27",
          lawCitation: "Self-Monitoring Report",
          conditionId: "SMR-DAO-2",
          complianceRequirement:
            "Complete and timely submission of CMRs/CMVRs (semi-annually)",
          compliant: "N/A",
          remarks: "",
        },
      ],
    },
  });

  // Group items by lawId then by applicableLaw
  const groupedItems = form.watch("items").reduce((acc, item) => {
    const lawId = item.lawId;
    if (!acc[lawId]) {
      acc[lawId] = {};
    }

    const groupKey = item.applicableLaw || "default";
    if (!acc[lawId][groupKey]) {
      acc[lawId][groupKey] = [];
    }

    acc[lawId][groupKey].push(item);
    return acc;
  }, {} as Record<string, Record<string, ComplianceItem[]>>);

  const findItemIndex = (items: ComplianceItem[], item: ComplianceItem) => {
    return items.findIndex((i) => i.conditionId === item.conditionId);
  };

  const addNewPD1586Item = () => {
    const newItem: ComplianceItem = {
      lawId: "PD-1586",
      lawCitation:
        "Presidential Decree No. 1586 (Environmental Impact Statement System)",
      conditionNumber: "",
      conditionId: `PD-1586-${
        form.watch("items").filter((item) => item.lawId === "PD-1586").length +
        1
      }`,
      complianceRequirement: "",
      compliant: "N/A",
      remarks: "",
    };

    form.setValue("items", [...form.watch("items"), newItem]);
  };

  const removePD1586Item = (conditionId: string) => {
    const currentItems = form.watch("items");
    const updatedItems = currentItems.filter(
      (item) => item.conditionId !== conditionId
    );
    form.setValue("items", updatedItems);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Summary of Compliance</h2>
        <div className="border-b my-2" />
        <p className="text-xs text-muted-foreground">
          The table below summarizes compliance with applicable environmental
          laws.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-primary-foreground">
          <thead>
            <tr>
              <th className="p-2 text-center text-xs font-bold uppercase tracking-wider border w-[250px] min-w-[250px] max-w-[200px]">
                Applicable Laws and Citations
              </th>
              <th className="p-2 text-center text-xs font-bold uppercase tracking-wider border w-auto">
                Compliance Requirements
              </th>
              <th className="p-2 text-center text-xs font-bold uppercase tracking-wider border w-[150px]">
                Compliant
              </th>
              <th className="p-2 text-center text-xs font-bold uppercase tracking-wider border w-[200px] max-w-[200px]">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {Object.entries(groupedItems).map(([lawId, lawGroups]) => {
              let lastGroupName = "";
              let isFirstGroup = true;
              const isPD1586 = lawId === "PD-1586";

              return (
                <React.Fragment key={lawId}>
                  {/* Law Header Row */}
                  <tr
                    className={
                      isPD1586 ? "bg-gray-100 border-t-2 border" : "bg-gray-100"
                    }
                  >
                    <td colSpan={4} className="p-2 font-medium text-sm border">
                      {Object.values(lawGroups)[0][0].lawCitation}
                    </td>
                  </tr>

                  {Object.entries(lawGroups).flatMap(([groupName, items]) => {
                    const groupLength = items.length;
                    lastGroupName = groupName;

                    return items.map((item, index) => {
                      const originalIndex = findItemIndex(
                        form.watch("items"),
                        item
                      );
                      const isFirstInGroup = index === 0;
                      const isLastInGroup = index === groupLength - 1;

                      return (
                        <React.Fragment key={item.conditionId}>
                          <tr className={isPD1586 ? "border-b" : ""}>
                            <td className="p-2 whitespace-wrap text-sm text-gray-900 border-x">
                              {groupName !== "default" && isFirstInGroup && (
                                <div className="text-sm font-medium">
                                  {groupName}
                                </div>
                              )}
                              {isPD1586 && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 p-0 size-8 border border-red-400"
                                    onClick={() =>
                                      removePD1586Item(item.conditionId)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  <span className="text-xs">Condition No.</span>
                                  <Input
                                    {...form.register(
                                      `items.${originalIndex}.conditionNumber`
                                    )}
                                    placeholder=""
                                    className="w-20 border-0 border-b-1 focus-visible:ring-0 text-sm"
                                  />
                                </div>
                              )}
                              <input
                                type="hidden"
                                {...form.register(
                                  `items.${originalIndex}.conditionId`
                                )}
                              />
                            </td>
                            <td className="px-6 whitespace-wrap text-sm border">
                              {isPD1586 ? (
                                <Input
                                  {...form.register(
                                    `items.${originalIndex}.complianceRequirement`
                                  )}
                                  className="border-0 focus-visible:ring-0 w-full text-sm"
                                />
                              ) : item.conditionId === "RA-9003-SW-2" ? (
                                <div className="flex items-center">
                                  <span className="text-sm">
                                    {item.complianceRequirement}
                                  </span>
                                  <Input
                                    {...form.register(
                                      `items.${originalIndex}.complianceRequirementInput`
                                    )}
                                    className="border-0 focus-visible:ring-0 min-w-40 w-auto ml-2 text-sm"
                                    placeholder="Enter name"
                                  />
                                </div>
                              ) : (
                                <span className="text-sm">
                                  {item.complianceRequirement}
                                </span>
                              )}
                            </td>
                            <td className="px-6 whitespace-nowrap border">
                              <div className="flex justify-center space-x-4">
                                {(["Yes", "No", "N/A"] as const).map(
                                  (option) => (
                                    <div
                                      key={option}
                                      className="flex items-center space-x-2"
                                    >
                                      <Checkbox
                                        id={`${item.conditionId}-${option}`}
                                        checked={
                                          form.watch(
                                            `items.${originalIndex}.compliant`
                                          ) === option
                                        }
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            form.setValue(
                                              `items.${originalIndex}.compliant`,
                                              option
                                            );
                                          }
                                        }}
                                      />
                                      <label
                                        htmlFor={`${item.conditionId}-${option}`}
                                        className="text-xs"
                                      >
                                        {option}
                                      </label>
                                    </div>
                                  )
                                )}
                              </div>
                            </td>
                            <td className="p-2 whitespace-wrap border">
                              {item.remarkLabel && (
                                <div className="text-sm mb-1"></div>
                              )}
                              <Input
                                {...form.register(
                                  `items.${originalIndex}.remarks`
                                )}
                                placeholder=""
                                className="border-0 border-b focus-visible:ring-0 text-sm"
                              />
                            </td>
                          </tr>
                          {groupName !== "default" && isLastInGroup && (
                            <tr>
                              <td colSpan={4} className="border-b"></td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    });
                  })}

                  {/* Add button for PD-1586 */}
                  {isPD1586 && (
                    <tr>
                      <td colSpan={4} className="py-4 border-b">
                        <Button
                          type="button"
                          onClick={addNewPD1586Item}
                          className="w-full px-4 py-2  rounded border font-medium text-sm hover:scale-99 transition-colors"
                        >
                          Add
                        </Button>
                      </td>
                    </tr>
                  )}

                  {!isPD1586 && (
                    <tr key={`end-${lawId}`}>
                      <td colSpan={4} className="border-b"></td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
