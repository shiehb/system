import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const purposeSchema = z.object({
  purposes: z.array(z.string()).min(1, "At least one purpose must be selected"),
  accuracyDetails: z.array(z.string()).optional(),
  commitmentStatusDetails: z.array(z.string()).optional(),
  otherPurpose: z.string().optional(),
  accuracyOtherDetail: z.string().optional(),
  commitmentOtherDetail: z.string().optional(),
});

export default function PurposeOfInspection() {
  const form = useForm<z.infer<typeof purposeSchema>>({
    resolver: zodResolver(purposeSchema),
    defaultValues: {
      purposes: [],
      accuracyDetails: [],
      commitmentStatusDetails: [],
      otherPurpose: "",
      accuracyOtherDetail: "",
      commitmentOtherDetail: "",
    },
  });

  const purposes = [
    {
      id: "verify_accuracy",
      label:
        "Verify accuracy of information submitted by the establishment pertaining to new permit applications, renewals, or modifications.",
    },
    {
      id: "compliance_status",
      label:
        "Determine compliance status with ECC conditions, compliance with commitments made during Technical Conference, permit conditions, and other requirements",
    },
    {
      id: "investigate_complaints",
      label: "Investigate community complaints.",
    },
    {
      id: "check_commitments",
      label: "Check status of commitment(s)",
    },
    {
      id: "other",
      label: "Others",
    },
  ];

  const accuracyDetailsOptions = [
    { id: "poa", label: "Permit to Operate Air (POA)" },
    { id: "dp", label: "Discharge Permit (DP)" },
    { id: "pmpin", label: "PMPIN Application" },
    { id: "hw_id", label: "Hazardous Waste ID Registration" },
    { id: "hw_transporter", label: "Hazardous Waste Transporter Registration" },
    { id: "accuracy_other", label: "Others" },
  ];

  const commitmentStatusOptions = [
    { id: "ecowatch", label: "Industrial Ecowatch" },
    {
      id: "pepp",
      label: "Philippine Environmental Partnership Program (PEPP)",
    },
    { id: "pab", label: "Pollution Adjudication Board (PAB)" },
    { id: "commitment_other", label: "Others" },
  ];

  return (
    <div className="space-y-6  pb-10">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Purpose of Inspection</h2>
        <Separator className="my-2" />
      </div>

      <div className="px-20">
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="purposes"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">
                      Select Purpose(s) of Inspection
                    </FormLabel>
                  </div>
                  <div className="space-y-4">
                    {purposes.map((purpose) => (
                      <div key={purpose.id} className="space-y-3">
                        <FormField
                          control={form.control}
                          name="purposes"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(purpose.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    return checked
                                      ? field.onChange([
                                          ...currentValues,
                                          purpose.id,
                                        ])
                                      : field.onChange(
                                          currentValues.filter(
                                            (value) => value !== purpose.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal leading-snug">
                                {purpose.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        {/* Verify Accuracy Details */}
                        {purpose.id === "verify_accuracy" && (
                          <div className="ml-8 space-y-3">
                            {form
                              .watch("purposes")
                              ?.includes("verify_accuracy") && (
                              <FormField
                                control={form.control}
                                name="accuracyDetails"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="mb-2">
                                      <FormLabel className="text-sm font-medium pl-10">
                                        Verify accuracy of (select all that
                                        apply):
                                      </FormLabel>
                                    </div>
                                    <div className="space-y-3 pl-10 md:pr-0 lg:pr-50">
                                      {accuracyDetailsOptions.map((item) => (
                                        <div
                                          key={item.id}
                                          className="space-y-3"
                                        >
                                          <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0">
                                            <FormLabel className="text-sm font-normal">
                                              <span className="mr-2">•</span>
                                              {item.label}
                                            </FormLabel>
                                            <FormControl>
                                              <Checkbox
                                                checked={(
                                                  field.value || []
                                                ).includes(item.id)}
                                                onCheckedChange={(checked) => {
                                                  const currentValues =
                                                    field.value || [];
                                                  field.onChange(
                                                    checked
                                                      ? [
                                                          ...currentValues,
                                                          item.id,
                                                        ]
                                                      : currentValues.filter(
                                                          (value) =>
                                                            value !== item.id
                                                        )
                                                  );
                                                }}
                                              />
                                            </FormControl>
                                          </FormItem>
                                          {/* Accuracy Other Detail Input */}
                                          {item.id === "accuracy_other" && (
                                            <div className="ml-6">
                                              {form
                                                .watch("accuracyDetails")
                                                ?.includes(
                                                  "accuracy_other"
                                                ) && (
                                                <FormField
                                                  control={form.control}
                                                  name="accuracyOtherDetail"
                                                  render={({ field }) => (
                                                    <FormItem>
                                                      <FormLabel className="text-sm font-medium">
                                                        <span className="mr-2">
                                                          •
                                                        </span>
                                                        Specify other accuracy
                                                        details:
                                                      </FormLabel>
                                                      <FormControl>
                                                        <Textarea
                                                          {...field}
                                                          placeholder="Please specify other accuracy details..."
                                                          className="min-h-[100px]"
                                                        />
                                                      </FormControl>
                                                      <FormMessage />
                                                    </FormItem>
                                                  )}
                                                />
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </FormItem>
                                )}
                              />
                            )}
                          </div>
                        )}

                        {/* Commitment Status Details */}
                        {purpose.id === "check_commitments" && (
                          <div className="ml-8 space-y-3">
                            {form
                              .watch("purposes")
                              ?.includes("check_commitments") && (
                              <FormField
                                control={form.control}
                                name="commitmentStatusDetails"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="mb-2">
                                      <FormLabel className="text-sm font-medium pl-10">
                                        Check status of (select all that apply):
                                      </FormLabel>
                                    </div>
                                    <div className="space-y-3 pl-10 md:pr-25 lg:pr-50">
                                      {commitmentStatusOptions.map((item) => (
                                        <div
                                          key={item.id}
                                          className="space-y-3"
                                        >
                                          <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0">
                                            <FormLabel className="text-sm font-normal">
                                              <span className="mr-2">•</span>
                                              {item.label}
                                            </FormLabel>
                                            <FormControl>
                                              <Checkbox
                                                checked={(
                                                  field.value || []
                                                ).includes(item.id)}
                                                onCheckedChange={(checked) => {
                                                  const currentValues =
                                                    field.value || [];
                                                  field.onChange(
                                                    checked
                                                      ? [
                                                          ...currentValues,
                                                          item.id,
                                                        ]
                                                      : currentValues.filter(
                                                          (value) =>
                                                            value !== item.id
                                                        )
                                                  );
                                                }}
                                              />
                                            </FormControl>
                                          </FormItem>
                                          {/* Commitment Other Detail Input */}
                                          {item.id === "commitment_other" && (
                                            <div className="ml-6">
                                              {form
                                                .watch(
                                                  "commitmentStatusDetails"
                                                )
                                                ?.includes(
                                                  "commitment_other"
                                                ) && (
                                                <FormField
                                                  control={form.control}
                                                  name="commitmentOtherDetail"
                                                  render={({ field }) => (
                                                    <FormItem>
                                                      <FormLabel className="text-sm font-medium">
                                                        <span className="mr-2">
                                                          •
                                                        </span>
                                                        Specify other commitment
                                                        details:
                                                      </FormLabel>
                                                      <FormControl>
                                                        <Textarea
                                                          {...field}
                                                          placeholder="Please specify other commitment details..."
                                                          className="min-h-[100px]"
                                                        />
                                                      </FormControl>
                                                      <FormMessage />
                                                    </FormItem>
                                                  )}
                                                />
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </FormItem>
                                )}
                              />
                            )}
                          </div>
                        )}

                        {/* Other Purpose Input */}
                        {purpose.id === "other" && (
                          <div className="ml-8">
                            {form.watch("purposes")?.includes("other") && (
                              <FormField
                                control={form.control}
                                name="otherPurpose"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium">
                                      Specify other purpose:
                                    </FormLabel>
                                    <FormControl>
                                      <Textarea
                                        {...field}
                                        placeholder="Please specify other purpose of inspection..."
                                        className="min-h-[100px]"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
