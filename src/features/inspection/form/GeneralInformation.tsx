import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";

const generalInfoSchema = z.object({
  establishmentName: z.string().min(1, "Establishment name is required"),
  address: z.string().min(1, "Address is required"),
  coordinates: z.string().min(1, "Coordinates are required"),
  natureOfBusiness: z.string().min(1, "Nature of business is required"),
  yearEstablished: z.string().min(4, "Year must be 4 digits").max(4),
  inspectionDateTime: z.string().min(1, "Inspection date/time is required"),
  operatingHours: z.string().min(1, "Operating hours are required"),
  operatingDaysPerWeek: z.string().min(1, "Required"),
  operatingDaysPerYear: z.string().min(1, "Required"),
  productLines: z.string().optional(),
  declaredProductionRate: z.string().optional(),
  actualProductionRate: z.string().optional(),
  managingHead: z.string().optional(),
  pcoName: z.string().optional(),
  interviewedPerson: z.string().optional(),
  pcoAccreditationNo: z.string().optional(),
  effectivityDate: z.string().optional(),
  phoneFaxNo: z.string().optional(),
  emailAddress: z.string().email("Invalid email address").optional(),
  environmentalLaws: z.array(z.string()).refine((value) => value.length > 0, {
    message: "At least one law must be selected",
  }),
});

export function GeneralInformation() {
  const form = useForm<z.infer<typeof generalInfoSchema>>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      establishmentName: "",
      address: "",
      coordinates: "",
      natureOfBusiness: "",
      yearEstablished: "",
      inspectionDateTime: "",
      operatingHours: "",
      operatingDaysPerWeek: "",
      operatingDaysPerYear: "",
      productLines: "",
      declaredProductionRate: "",
      actualProductionRate: "",
      managingHead: "",
      pcoName: "",
      interviewedPerson: "",
      pcoAccreditationNo: "",
      effectivityDate: "",
      phoneFaxNo: "",
      emailAddress: "",
      environmentalLaws: [],
    },
  });

  const environmentalLaws = [
    { id: "PD-1586", label: "PD-1586" },
    { id: "RA-6969", label: "RA-6969" },
    { id: "RA-8749", label: "RA-8749" },
    { id: "RA-9275", label: "RA-9275" },
    { id: "RA-9003", label: "RA-9003" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">General Information</h2>
        <Separator className="my-2" />
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="environmentalLaws"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">
                    Applicable Environmental Laws (Pls. Checkbox)
                  </FormLabel>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  {environmentalLaws.map((law) => (
                    <FormField
                      key={law.id}
                      control={form.control}
                      name="environmentalLaws"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(law.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, law.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== law.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal text-sm">
                            {law.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="establishmentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of Establishment</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter establishment name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Complete address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coordinates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coordinates (Decimal)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Latitude, Longitude" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="natureOfBusiness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nature of Business</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Type of business" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="yearEstablished"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year Established</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="YYYY" type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="inspectionDateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date & Time of Inspection</FormLabel>
                  <FormControl>
                    <Input {...field} type="datetime-local" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="operatingHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operating Hours/Day</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. 8AM-5PM" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="operatingDaysPerWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operating Days/Week</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Monday-Friday" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="operatingDaysPerYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operating Days/Year</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. 300 days" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="my-2" />

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="productLines"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Lines</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="declaredProductionRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Production Rate as Declared in The ECC (Unit/day)
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. " />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="actualProductionRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actual Production Rate (Unit/day)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="my-2" />

          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="managingHead"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of Managing Head</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="pcoName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of PCO</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interviewedPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of person Interviewed, Designation</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="pcoAccreditationNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PCO Accreditation No.</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="effectivityDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Effectivity</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phoneFaxNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone/ Fax No.</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
