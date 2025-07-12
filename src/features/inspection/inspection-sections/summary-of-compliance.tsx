"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

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
    }),
  ),
})

type ComplianceItem = z.infer<typeof complianceSummarySchema>["items"][number]

export function SummaryOfCompliance() {
  const form = useForm<z.infer<typeof complianceSummarySchema>>({
    resolver: zodResolver(complianceSummarySchema),
    defaultValues: {
      items: [
        // PD-1586 condition
        {
          lawId: "PD-1586",
          lawCitation: "PD-1586: Environmental Compliance Certificate (ECC) Conditionalities",
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
          lawCitation: "RA 6969: Toxic Substances and Hazardous and Nuclear Waste Control Act",
          conditionId: "RA-6969-PCL-1",
          complianceRequirement: "Valid PCL Compliance Certificate",
          compliant: "N/A",
          remarks: "",
        },
        {
          lawId: "RA-6969",
          applicableLaw: "Priority Chemical List",
          lawCitation: "RA 6969: Toxic Substances and Hazardous and Nuclear Waste Control Act",
          conditionId: "RA-6969-PCL-2",
          complianceRequirement: "Annual Reporting",
          compliant: "N/A",
          remarks: "",
        },
        // Additional compliance items would continue here...
      ],
    },
  })

  // Group items by lawId then by applicableLaw
  const groupedItems = form.watch("items").reduce(
    (acc, item) => {
      const lawId = item.lawId
      if (!acc[lawId]) {
        acc[lawId] = {}
      }

      const groupKey = item.applicableLaw || "default"
      if (!acc[lawId][groupKey]) {
        acc[lawId][groupKey] = []
      }

      acc[lawId][groupKey].push(item)
      return acc
    },
    {} as Record<string, Record<string, ComplianceItem[]>>,
  )

  const findItemIndex = (items: ComplianceItem[], item: ComplianceItem) => {
    return items.findIndex((i) => i.conditionId === item.conditionId)
  }

  const addNewPD1586Item = () => {
    const newItem: ComplianceItem = {
      lawId: "PD-1586",
      lawCitation: "Presidential Decree No. 1586 (Environmental Impact Statement System)",
      conditionNumber: "",
      conditionId: `PD-1586-${form.watch("items").filter((item) => item.lawId === "PD-1586").length + 1}`,
      complianceRequirement: "",
      compliant: "N/A",
      remarks: "",
    }

    form.setValue("items", [...form.watch("items"), newItem])
  }

  const removePD1586Item = (conditionId: string) => {
    const currentItems = form.watch("items")
    const updatedItems = currentItems.filter((item) => item.conditionId !== conditionId)
    form.setValue("items", updatedItems)
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Summary of Compliance</h2>
        <div className="border-b my-2" />
        <p className="text-xs text-muted-foreground">
          The table below summarizes compliance with applicable environmental laws.
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
              <th className="p-2 text-center text-xs font-bold uppercase tracking-wider border w-[150px]">Compliant</th>
              <th className="p-2 text-center text-xs font-bold uppercase tracking-wider border w-[200px] max-w-[200px]">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {Object.entries(groupedItems).map(([lawId, lawGroups]) => {
              const isPD1586 = lawId === "PD-1586"

              return (
                <React.Fragment key={lawId}>
                  {/* Law Header Row */}
                  <tr className={isPD1586 ? "bg-gray-100 border-t-2 border" : "bg-gray-100"}>
                    <td colSpan={4} className="p-2 font-medium text-sm border">
                      {Object.values(lawGroups)[0][0].lawCitation}
                    </td>
                  </tr>

                  {Object.entries(lawGroups).flatMap(([groupName, items]) => {
                    const groupLength = items.length

                    return items.map((item, index) => {
                      const originalIndex = findItemIndex(form.watch("items"), item)
                      const isFirstInGroup = index === 0

                      return (
                        <React.Fragment key={item.conditionId}>
                          <tr className={isPD1586 ? "border-b" : ""}>
                            <td className="p-2 whitespace-wrap text-sm text-gray-900 border-x">
                              {groupName !== "default" && isFirstInGroup && (
                                <div className="text-sm font-medium">{groupName}</div>
                              )}
                              {isPD1586 && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 p-0 size-8 border border-red-400"
                                    onClick={() => removePD1586Item(item.conditionId)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  <span className="text-xs">Condition No.</span>
                                  <Input
                                    {...form.register(`items.${originalIndex}.conditionNumber`)}
                                    placeholder=""
                                    className="w-20 border-0 border-b-1 focus-visible:ring-0 text-sm"
                                  />
                                </div>
                              )}
                            </td>
                            <td className="px-6 whitespace-wrap text-sm border">
                              {isPD1586 ? (
                                <Input
                                  {...form.register(`items.${originalIndex}.complianceRequirement`)}
                                  className="border-0 focus-visible:ring-0 w-full text-sm"
                                />
                              ) : (
                                <span className="text-sm">{item.complianceRequirement}</span>
                              )}
                            </td>
                            <td className="px-6 whitespace-nowrap border">
                              <div className="flex justify-center space-x-4">
                                {(["Yes", "No", "N/A"] as const).map((option) => (
                                  <div key={option} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`${item.conditionId}-${option}`}
                                      checked={form.watch(`items.${originalIndex}.compliant`) === option}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          form.setValue(`items.${originalIndex}.compliant`, option)
                                        }
                                      }}
                                    />
                                    <label htmlFor={`${item.conditionId}-${option}`} className="text-xs">
                                      {option}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="p-2 whitespace-wrap border">
                              <Input
                                {...form.register(`items.${originalIndex}.remarks`)}
                                placeholder=""
                                className="border-0 border-b focus-visible:ring-0 text-sm"
                              />
                            </td>
                          </tr>
                        </React.Fragment>
                      )
                    })
                  })}

                  {/* Add button for PD-1586 */}
                  {isPD1586 && (
                    <tr>
                      <td colSpan={4} className="py-4 border-b">
                        <Button
                          type="button"
                          onClick={addNewPD1586Item}
                          className="w-full px-4 py-2 rounded border font-medium text-sm hover:scale-99 transition-colors"
                        >
                          Add
                        </Button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
