import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";

const summarySchema = z.object({
  environmentalSystems: z.array(
    z.object({
      system: z.string(),
      compliant: z.boolean(),
      nonCompliant: z.boolean(),
      notApplicable: z.boolean(),
      remarks: z.string().optional(),
    })
  ),
  commitments: z.string().optional(),
});

export function SummaryOfFindingsAndObservations() {
  const form = useForm<z.infer<typeof summarySchema>>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      environmentalSystems: [
        {
          system: "Environmental Impact Statement System",
          compliant: false,
          nonCompliant: false,
          notApplicable: false,
          remarks: "",
        },
        {
          system: "Chemical Management",
          compliant: false,
          nonCompliant: false,
          notApplicable: false,
          remarks: "",
        },
        {
          system: "Hazardous Waste Management",
          compliant: false,
          nonCompliant: false,
          notApplicable: false,
          remarks: "",
        },
        {
          system: "Air Quality Management",
          compliant: false,
          nonCompliant: false,
          notApplicable: false,
          remarks: "",
        },
        {
          system: "Water Quality Management",
          compliant: false,
          nonCompliant: false,
          notApplicable: false,
          remarks: "",
        },
        {
          system: "Solid Waste Management",
          compliant: false,
          nonCompliant: false,
          notApplicable: false,
          remarks: "",
        },
        {
          system: "Commitment/s from previous Technical Conference",
          compliant: false,
          nonCompliant: false,
          notApplicable: false,
          remarks: "",
        },
      ],
    },
  });

  const handleSystemStatusChange = (
    field: any,
    index: number,
    status: "compliant" | "nonCompliant" | "notApplicable",
    checked: boolean
  ) => {
    const updatedSystems = [...field.value];
    updatedSystems[index] = {
      ...updatedSystems[index],
      compliant: status === "compliant" ? checked : false,
      nonCompliant: status === "nonCompliant" ? checked : false,
      notApplicable: status === "notApplicable" ? checked : false,
    };
    field.onChange(updatedSystems);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">
          Summary of Findings and Observations
        </h2>
        <Separator className="my-2" />
      </div>

      <div className="px-4">
        <Form {...form}>
          <form className="space-y-8">
            {/* Environmental Management Systems Section */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="environmentalSystems"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-6">
                      {field.value.map((system, index) => (
                        <div key={system.system} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                            {/* System Label */}
                            <div className="lg:col-span-3">
                              <FormLabel className="font-medium">
                                {system.system}
                              </FormLabel>
                            </div>

                            {/* Status Checkboxes */}
                            <div className="lg:col-span-3">
                              <div className="grid grid-cols-3 gap-4">
                                {(
                                  [
                                    "compliant",
                                    "nonCompliant",
                                    "notApplicable",
                                  ] as const
                                ).map((status) => (
                                  <FormItem
                                    key={`${system.system}-${status}`}
                                    className="flex flex-col items-center space-y-2"
                                  >
                                    <FormLabel className="text-xs text-center">
                                      {status === "compliant"
                                        ? "Compliant"
                                        : status === "nonCompliant"
                                        ? "Non-Compliant"
                                        : "N/A"}
                                    </FormLabel>
                                    <FormControl>
                                      <Checkbox
                                        checked={system[status]}
                                        onCheckedChange={(checked) =>
                                          handleSystemStatusChange(
                                            field,
                                            index,
                                            status,
                                            !!checked
                                          )
                                        }
                                      />
                                    </FormControl>
                                  </FormItem>
                                ))}
                              </div>
                            </div>

                            {/* Remarks Textarea */}
                            <div className="lg:col-span-6">
                              <FormControl>
                                <Textarea
                                  placeholder="Enter remarks..."
                                  value={system.remarks || ""}
                                  onChange={(e) => {
                                    const updatedSystems = [...field.value];
                                    updatedSystems[index] = {
                                      ...updatedSystems[index],
                                      remarks: e.target.value,
                                    };
                                    field.onChange(updatedSystems);
                                  }}
                                />
                              </FormControl>
                            </div>
                          </div>
                          {/* Add separator after each system except the last one */}
                          {index < field.value.length - 1 && (
                            <Separator className="my-2" />
                          )}
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
