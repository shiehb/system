"use client"

import React from "react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, FileText } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

// General Information Component
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
})

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
  })

  const environmentalLaws = [
    { id: "PD-1586", label: "PD-1586" },
    { id: "RA-6969", label: "RA-6969" },
    { id: "RA-8749", label: "RA-8749" },
    { id: "RA-9275", label: "RA-9275" },
    { id: "RA-9003", label: "RA-9003" },
  ]

  return (
    <div className="space-y-6 pb-10">
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
                  <FormLabel>Applicable Environmental Laws (Pls. Checkbox)</FormLabel>
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
                                  : field.onChange(field.value?.filter((value) => value !== law.id))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal text-base">{law.label}</FormLabel>
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
                  <FormLabel>Production Rate as Declared in The ECC (Unit/day)</FormLabel>
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
  )
}

// Purpose of Inspection Component
const purposeSchema = z.object({
  purposes: z.array(z.string()).min(1, "At least one purpose must be selected"),
  accuracyDetails: z.array(z.string()).optional(),
  commitmentStatusDetails: z.array(z.string()).optional(),
  otherPurpose: z.string().optional(),
  accuracyOtherDetail: z.string().optional(),
  commitmentOtherDetail: z.string().optional(),
})

export function PurposeOfInspection() {
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
  })

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
  ]

  const accuracyDetailsOptions = [
    { id: "poa", label: "Permit to Operate Air (POA)" },
    { id: "dp", label: "Discharge Permit (DP)" },
    { id: "pmpin", label: "PMPIN Application" },
    { id: "hw_id", label: "Hazardous Waste ID Registration" },
    { id: "hw_transporter", label: "Hazardous Waste Transporter Registration" },
    { id: "accuracy_other", label: "Others" },
  ]

  const commitmentStatusOptions = [
    { id: "ecowatch", label: "Industrial Ecowatch" },
    {
      id: "pepp",
      label: "Philippine Environmental Partnership Program (PEPP)",
    },
    { id: "pab", label: "Pollution Adjudication Board (PAB)" },
    { id: "commitment_other", label: "Others" },
  ]

  return (
    <div className="space-y-6 pb-10">
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
                    <FormLabel className="text-base">Select Purpose(s) of Inspection</FormLabel>
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
                                    const currentValues = field.value || []
                                    return checked
                                      ? field.onChange([...currentValues, purpose.id])
                                      : field.onChange(currentValues.filter((value) => value !== purpose.id))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal leading-snug">{purpose.label}</FormLabel>
                            </FormItem>
                          )}
                        />

                        {/* Verify Accuracy Details */}
                        {purpose.id === "verify_accuracy" && (
                          <div className="ml-8 space-y-3">
                            {form.watch("purposes")?.includes("verify_accuracy") && (
                              <FormField
                                control={form.control}
                                name="accuracyDetails"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="mb-2">
                                      <FormLabel className="text-sm font-medium pl-10">
                                        Verify accuracy of (select all that apply):
                                      </FormLabel>
                                    </div>
                                    <div className="space-y-3 pl-10 md:pr-0 lg:pr-50">
                                      {accuracyDetailsOptions.map((item) => (
                                        <div key={item.id} className="space-y-3">
                                          <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0">
                                            <FormLabel className="text-sm font-normal">
                                              <span className="mr-2">•</span>
                                              {item.label}
                                            </FormLabel>
                                            <FormControl>
                                              <Checkbox
                                                checked={(field.value || []).includes(item.id)}
                                                onCheckedChange={(checked) => {
                                                  const currentValues = field.value || []
                                                  field.onChange(
                                                    checked
                                                      ? [...currentValues, item.id]
                                                      : currentValues.filter((value) => value !== item.id),
                                                  )
                                                }}
                                              />
                                            </FormControl>
                                          </FormItem>
                                          {/* Accuracy Other Detail Input */}
                                          {item.id === "accuracy_other" && (
                                            <div className="ml-6">
                                              {form.watch("accuracyDetails")?.includes("accuracy_other") && (
                                                <FormField
                                                  control={form.control}
                                                  name="accuracyOtherDetail"
                                                  render={({ field }) => (
                                                    <FormItem>
                                                      <FormLabel className="text-sm font-medium">
                                                        <span className="mr-2">•</span>
                                                        Specify other accuracy details:
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
                            {form.watch("purposes")?.includes("check_commitments") && (
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
                                        <div key={item.id} className="space-y-3">
                                          <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0">
                                            <FormLabel className="text-sm font-normal">
                                              <span className="mr-2">•</span>
                                              {item.label}
                                            </FormLabel>
                                            <FormControl>
                                              <Checkbox
                                                checked={(field.value || []).includes(item.id)}
                                                onCheckedChange={(checked) => {
                                                  const currentValues = field.value || []
                                                  field.onChange(
                                                    checked
                                                      ? [...currentValues, item.id]
                                                      : currentValues.filter((value) => value !== item.id),
                                                  )
                                                }}
                                              />
                                            </FormControl>
                                          </FormItem>
                                          {/* Commitment Other Detail Input */}
                                          {item.id === "commitment_other" && (
                                            <div className="ml-6">
                                              {form.watch("commitmentStatusDetails")?.includes("commitment_other") && (
                                                <FormField
                                                  control={form.control}
                                                  name="commitmentOtherDetail"
                                                  render={({ field }) => (
                                                    <FormItem>
                                                      <FormLabel className="text-sm font-medium">
                                                        <span className="mr-2">•</span>
                                                        Specify other commitment details:
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
                                    <FormLabel className="text-sm font-medium">Specify other purpose:</FormLabel>
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
  )
}

// Remove these lines:
// Import the separate components
// export { ComplianceStatus } from "./compliance-status"
// export { SummaryOfCompliance } from "./summary-of-compliance"
// export { SummaryOfFindingsAndObservations } from "./summary-of-findings-and-observations"

// Add the full component definitions instead:

// Compliance Status Component
const complianceStatusSchema = z.object({
  permits: z.array(
    z.object({
      lawId: z.string(),
      permitType: z.string(),
      permitNumber: z.string().min(1, "Permit number is required"),
      dateIssued: z.string().min(1, "Date issued is required"),
      expiryDate: z.string().min(1, "Expiry date is required"),
    }),
  ),
})

type Permit = z.infer<typeof complianceStatusSchema>["permits"][number]

export function ComplianceStatus() {
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
          permitType: "With MOA/Agreement for residuals disposed of to a SLF w/ ECC",
          permitNumber: "",
          dateIssued: "",
          expiryDate: "",
        },
      ],
    },
  })

  const groupedPermits = form.watch("permits").reduce(
    (acc, permit) => {
      const lawId = permit.lawId
      if (!acc[lawId]) {
        acc[lawId] = []
      }
      acc[lawId].push(permit)
      return acc
    },
    {} as Record<string, Permit[]>,
  )

  return (
    <div className="space-y-6 pb-10">
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
                  <th className="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider border-x" colSpan={2}>
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
                {Object.entries(groupedPermits).map(([lawId, permits], groupIndex) => (
                  <React.Fragment key={lawId}>
                    {permits.map((permit, permitIndex) => {
                      const originalIndex = form
                        .watch("permits")
                        .findIndex((p) => p.lawId === permit.lawId && p.permitType === permit.permitType)

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
                                    <Input {...field} type="date" className="border-0 focus-visible:ring-0 text-base" />
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
                                    <Input {...field} type="date" className="border-0 focus-visible:ring-0 text-base" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>
                        </tr>
                      )
                    })}
                    {groupIndex < Object.keys(groupedPermits).length - 1 && (
                      <tr key={`separator-${groupIndex}`}>
                        <td colSpan={5}>
                          <Separator />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </form>
      </Form>
    </div>
  )
}

// Summary of Compliance Component
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
                                    <X className="h-4 w-4" />
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

// Summary of Findings and Observations Component
const summarySchema = z.object({
  environmentalSystems: z.array(
    z.object({
      system: z.string(),
      compliant: z.boolean(),
      nonCompliant: z.boolean(),
      notApplicable: z.boolean(),
      remarks: z.string().optional(),
    }),
  ),
})

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
          remarks: "",
        },
        {
          system: "Air Quality Management",
          compliant: false,
          nonCompliant: false,
          remarks: "",
        },
        {
          system: "Water Quality Management",
          compliant: false,
          nonCompliant: false,
          remarks: "",
        },
        {
          system: "Solid Waste Management",
          compliant: false,
          nonCompliant: false,
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
  })

  const handleSystemStatusChange = (
    field: any,
    index: number,
    status: "compliant" | "nonCompliant" | "notApplicable",
    checked: boolean,
  ) => {
    const updatedSystems = [...field.value]
    updatedSystems[index] = {
      ...updatedSystems[index],
      compliant: status === "compliant" ? checked : false,
      nonCompliant: status === "nonCompliant" ? checked : false,
      notApplicable: status === "notApplicable" ? checked : false,
    }
    field.onChange(updatedSystems)
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Summary of Findings and Observations</h2>
        <Separator className="my-2" />
      </div>

      <div className="px-4">
        <Form {...form}>
          <form className="space-y-8">
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
                            <div className="lg:col-span-3">
                              <FormLabel className="font-medium text-base">{system.system}</FormLabel>
                            </div>

                            <div className="lg:col-span-3">
                              <div className="grid grid-cols-3 gap-4">
                                {(["compliant", "nonCompliant", "notApplicable"] as const).map((status) => (
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
                                          handleSystemStatusChange(field, index, status, !!checked)
                                        }
                                      />
                                    </FormControl>
                                  </FormItem>
                                ))}
                              </div>
                            </div>

                            <div className="lg:col-span-6">
                              <FormControl>
                                <Textarea
                                  placeholder="Enter remarks..."
                                  value={system.remarks || ""}
                                  onChange={(e) => {
                                    const updatedSystems = [...field.value]
                                    updatedSystems[index] = {
                                      ...updatedSystems[index],
                                      remarks: e.target.value,
                                    }
                                    field.onChange(updatedSystems)
                                  }}
                                  className="text-sm"
                                />
                              </FormControl>
                            </div>
                          </div>
                          {index < field.value.length - 1 && <Separator className="my-2" />}
                        </div>
                      ))}
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

// Recommendations Component
const recommendations = [
  "For confirmatory sampling/further monitoring",
  "For issuance of Temporary/Renewal of permit to operate (POA) and/or Renewal of Discharge Permit (DP)",
  "For accreditation of Pollution Control Office(PCO)/Seminar requirement of Managing Head",
  "For Submission of Self-Monitoring Report (SMR)/Compliance monitoring Report(CMR)",
  "For issuance of Notice of Meeting (NOM)/Technical Conference(TC)",
  "For issuance of Notice of Violation(NOV)",
  "For issuance of suspension of ECC/5-day CDO",
  "For endorsement to Pollution Adjudication Board (PAB)",
  "Other Recommendations",
]

export function Recommendations() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [otherChecked, setOtherChecked] = useState(false)
  const [otherText, setOtherText] = useState("")
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])

  const handleCheckboxChange = (item: string) => (checked: boolean) => {
    if (item === "Other Recommendations") {
      setOtherChecked(checked)
      if (!checked) setOtherText("")
    }
    setCheckedItems((prev) => ({ ...prev, [item]: checked }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachedFiles((prev) => [...prev, ...newFiles])
      toast.success(`${newFiles.length} file(s) attached`)
    }
  }

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
    toast.info("File removed")
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    setAttachedFiles((prev) => [...prev, ...files])
    toast.success(`${files.length} file(s) attached`)
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Recommendations</h2>
        <Separator className="my-2" />
      </div>

      <div className="px-4 space-y-6">
        <div className="space-y-4">
          {recommendations.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox id={item} checked={checkedItems[item] || false} onCheckedChange={handleCheckboxChange(item)} />
              <Label htmlFor={item}>{item}</Label>
            </div>
          ))}
        </div>

        {otherChecked && (
          <div className="space-y-2">
            <Textarea
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              placeholder="Enter your recommendation..."
              className="min-h-[100px]"
            />
          </div>
        )}

        <Separator className="my-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1 - Attestation */}
          <div>
            <p className="font-medium">
              Findings and Recommendations Attested by:
              <span className="font-bold"> PCO/Manager</span>
            </p>
          </div>

          {/* Column 2 - File Attachment */}
          <div className="space-y-4">
            <Label className="text-sm text-muted-foreground">
              Supporting Documentation
              <br />
              (Referred to attached: Monitoring Slip - EMED-MONITORING_F001)
            </Label>

            {/* File Upload Area */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Drop files here or click to upload
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG up to 10MB each
                  </span>
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                />
              </div>
            </div>

            {/* Attached Files List */}
            {attachedFiles.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Attached Files ({attachedFiles.length})</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
