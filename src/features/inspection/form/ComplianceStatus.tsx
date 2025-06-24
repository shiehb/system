import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";

const complianceStatusSchema = z.object({
  permits: z.array(
    z.object({
      lawId: z.string(),
      permitType: z.string(),
      permitNumber: z.string().min(1, "Permit number is required"),
      dateIssued: z.string().min(1, "Date issued is required"),
      expiryDate: z.string().min(1, "Expiry date is required"),
    })
  ),
});

type Permit = z.infer<typeof complianceStatusSchema>["permits"][number];

export default function ComplianceStatus() {
  const form = useForm<z.infer<typeof complianceStatusSchema>>({
    resolver: zodResolver(complianceStatusSchema),
    defaultValues: {
      permits: [
        // PD-1586 permits
        {
          lawId: "PD-1586",
          permitType: "ECC1",
          permitNumber: "",
          dateIssued: "",
          expiryDate: "",
        },
        {
          lawId: "PD-1586",
          permitType: "ECC2",
          permitNumber: "",
          dateIssued: "",
          expiryDate: "",
        },
        {
          lawId: "PD-1586",
          permitType: "ECC3",
          permitNumber: "",
          dateIssued: "",
          expiryDate: "",
        },
        // RA-6969 permits
        {
          lawId: "RA-6969",
          permitType: "DENR Registry ID",
          permitNumber: "",
          dateIssued: "",
          expiryDate: "",
        },
        {
          lawId: "RA-6969",
          permitType: "PCL Compliance Certificate",
          permitNumber: "",
          dateIssued: "",
          expiryDate: "",
        },
        {
          lawId: "RA-6969",
          permitType: "CCO Registry",
          permitNumber: "",
          dateIssued: "",
          expiryDate: "",
        },
        {
          lawId: "RA-6969",
          permitType: "Importer Clearance No.",
          permitNumber: "",
          dateIssued: "",
          expiryDate: "",
        },
        {
          lawId: "RA-6969",
          permitType: "Permit to Transport",
          permitNumber: "",
          dateIssued: "",
          expiryDate: "",
        },
        {
          lawId: "RA-6969",
          permitType: "Copy of COT issued by licensed TSD Facility",
          permitNumber: "",
          dateIssued: "",
          expiryDate: "",
        },
        // RA-8749 Permit
        {
          lawId: "RA-8749",
          permitType: "POA No.",
          permitNumber: "",
          dateIssued: "",
          expiryDate: "",
        },
        // RA-9275 Permit
        {
          lawId: "RA-9275",
          permitType: "Discharge Permit No.",
          permitNumber: "",
          dateIssued: "",
          expiryDate: "",
        },
        // RA-9003 Permit
        {
          lawId: "RA-9003",
          permitType:
            "With MOA/Agreement for residuals disposed of to a SLF w/ ECC",
          permitNumber: "",
          dateIssued: "",
          expiryDate: "",
        },
      ],
    },
  });

  const groupedPermits = form.watch("permits").reduce((acc, permit) => {
    const lawId = permit.lawId;
    if (!acc[lawId]) {
      acc[lawId] = [];
    }
    acc[lawId].push(permit);
    return acc;
  }, {} as Record<string, Permit[]>);

  return (
    <div className="space-y-6  pb-10">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Compliance Status</h2>
        <Separator className="my-2" />
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <div className="overflow-x-auto">
            <p className="text-lg pl-10">DENR Permits/Licenses/Clearance</p>
            <table className="min-w-full divide-y divide-gray-200 border bg-primary-foreground">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider border-x">
                    Environmental Law
                  </th>
                  <th
                    className="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider border-x"
                    colSpan={2}
                  >
                    Permit
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider border-x">
                    Date Issued
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider border-x">
                    Expiry Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {Object.entries(groupedPermits).map(
                  ([lawId, permits], groupIndex) => (
                    <>
                      {permits.map((permit, permitIndex) => {
                        const originalIndex = form
                          .watch("permits")
                          .findIndex(
                            (p) =>
                              p.lawId === permit.lawId &&
                              p.permitType === permit.permitType
                          );

                        return (
                          <tr key={`${lawId}-${permit.permitType}`}>
                            <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-900 border-x w-[200px] max-w-[200px]">
                              {permitIndex === 0 ? lawId : ""}
                            </td>
                            <td className="px-6 py-4 whitespace-wrap text-base border-x w-[250px] max-w-[250px]">
                              {permit.permitType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap border-x">
                              <FormField
                                control={form.control}
                                name={`permits.${originalIndex}.permitNumber`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder=""
                                        className="border-1 focus-visible:ring-0 text-base"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap border-x w-[180px] max-w-[180px] ">
                              <FormField
                                control={form.control}
                                name={`permits.${originalIndex}.dateIssued`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="date"
                                        className="border-0 focus-visible:ring-0 text-base"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap border-x w-[180px] max-w-[180px] ">
                              <FormField
                                control={form.control}
                                name={`permits.${originalIndex}.expiryDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="date"
                                        className="border-0 focus-visible:ring-0 text-base"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </td>
                          </tr>
                        );
                      })}
                      {groupIndex < Object.keys(groupedPermits).length - 1 && (
                        <tr>
                          <td colSpan={5}>
                            <Separator />
                          </td>
                        </tr>
                      )}
                    </>
                  )
                )}
              </tbody>
            </table>
          </div>
        </form>
      </Form>
    </div>
  );
}
