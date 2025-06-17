import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

// Form schema for RA-6969
const ra6969Schema = z.object({
  case_number: z.string().min(1, "Case number is required"),
  date_reported: z.string().min(1, "Date reported is required"),
  location: z.string().min(1, "Location is required"),
  substance_type: z.string().min(1, "Substance type is required"),
  quantity: z.string().min(1, "Quantity is required"),
  status: z.enum(["pending", "under_investigation", "resolved"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export function RA6969Form() {
  const form = useForm<z.infer<typeof ra6969Schema>>({
    resolver: zodResolver(ra6969Schema),
    defaultValues: {
      case_number: "",
      date_reported: "",
      location: "",
      substance_type: "",
      quantity: "",
      status: "pending",
      description: "",
    },
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">RA-6969 Record</h2>
        <Separator className="my-2" />
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <div className="space-y-4 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="case_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. CASE-2023-001"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_reported"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Reported</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Manila City"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="substance_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Substance Type</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Mercury, Lead, etc."
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. 5kg, 10 liters"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="pending">Pending</option>
                        <option value="under_investigation">
                          Under Investigation
                        </option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Detailed description of the case..."
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Alert className="col-span-2">
              <Info className="h-4 w-4" />
              <AlertTitle>
                RA-6969: Toxic Substances and Hazardous and Nuclear Wastes
                Control
              </AlertTitle>
              <AlertDescription>
                This form is for recording cases related to toxic substances and
                hazardous/nuclear wastes as regulated under Republic Act 6969.
              </AlertDescription>
            </Alert>
          </div>
        </form>
      </Form>
    </div>
  );
}
