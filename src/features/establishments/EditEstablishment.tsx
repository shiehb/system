import { useEffect, useState, useRef } from "react";
import addressData from "@/data/region-ph.json";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import type { EstablishmentFormData } from "@/lib/establishmentApi";
import { toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EditEstablishmentProps {
  id: number;
  establishment: EstablishmentFormData;
  onUpdate: (id: number, data: EstablishmentFormData) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export default function EditEstablishment({
  id,
  establishment,
  onUpdate,
  isSubmitting,
  onCancel,
}: EditEstablishmentProps) {
  const [formData, setFormData] = useState<EstablishmentFormData>({
    name: establishment.name || "",
    address_line: establishment.address_line || "",
    barangay: establishment.barangay || "",
    city: establishment.city || "",
    province: establishment.province || "",
    region: establishment.region || "",
    postal_code: establishment.postal_code || "",
    latitude: establishment.latitude || "",
    longitude: establishment.longitude || "",
    year_established: establishment.year_established || null,
  });

  const [errors, setErrors] = useState({
    name: "",
    region: "",
    province: "",
    city: "",
    barangay: "",
    address_line: "",
    postal_code: "",
    year_established: "",
    latitude: "",
    longitude: "",
  });
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const provinceRef = useRef<HTMLButtonElement>(null);
  const cityRef = useRef<HTMLButtonElement>(null);
  const barangayRef = useRef<HTMLButtonElement>(null);

  const regions = addressData.regions || [];
  const provinces =
    regions.find((r: any) => r.name === formData.region)?.provinces || [];
  const cities =
    provinces.find((p: any) => p.name === formData.province)?.municipalities ||
    [];
  const barangays =
    cities.find((c: any) => c.name === formData.city)?.barangays || [];

  useEffect(() => {
    if (formData.region && provinceRef.current) {
      setTimeout(() => provinceRef.current?.focus(), 100);
    }
  }, [formData.region]);

  useEffect(() => {
    if (formData.province && cityRef.current) {
      setTimeout(() => cityRef.current?.focus(), 100);
    }
  }, [formData.province]);

  useEffect(() => {
    if (formData.city && barangayRef.current && barangays.length > 0) {
      setTimeout(() => barangayRef.current?.focus(), 100);
    }
  }, [formData.city, barangays.length]);

  const handleChange = (field: keyof EstablishmentFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      name: !formData.name ? "Name is required" : "",
      region: !formData.region ? "Region is required" : "",
      province: !formData.province ? "Province is required" : "",
      city: !formData.city ? "City is required" : "",
      barangay: !formData.barangay ? "Barangay is required" : "",
      address_line: !formData.address_line ? "Address line is required" : "",
      postal_code: !formData.postal_code
        ? "Postal code is required"
        : !/^\d{4}$/.test(formData.postal_code)
        ? "Must be a 4-digit number"
        : "",
      year_established: !formData.year_established
        ? "Year is required"
        : isNaN(Number(formData.year_established))
        ? "Must be a valid number"
        : Number(formData.year_established) < 1900 ||
          Number(formData.year_established) > new Date().getFullYear()
        ? `Year must be between 1900 and ${new Date().getFullYear()}`
        : "",
      latitude:
        formData.latitude && isNaN(Number(formData.latitude))
          ? "Must be a valid number"
          : "",
      longitude:
        formData.longitude && isNaN(Number(formData.longitude))
          ? "Must be a valid number"
          : "",
    };

    setErrors(newErrors);
    setApiErrors({});
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error("Please fix all errors before submitting");
      return;
    }
    setShowSaveDialog(true);
  };

  const confirmSave = async () => {
    setShowSaveDialog(false);
    try {
      await onUpdate(id, {
        ...formData,
        year_established: formData.year_established || null,
        postal_code: formData.postal_code,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
      });
      toast.success("Establishment updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update establishment");
    }
  };

  const handleCancel = () => {
    const isModified = Object.keys(formData).some((key) => {
      const formKey = key as keyof EstablishmentFormData;
      return formData[formKey] !== (establishment[formKey] || "");
    });

    if (isModified) {
      setShowCancelDialog(true);
    } else {
      onCancel?.();
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    onCancel?.();
  };

  const getFieldState = (field: keyof typeof errors) => ({
    className: errors[field] || apiErrors[field] ? "border-destructive" : "",
    message: apiErrors[field] || errors[field],
  });

  return (
    <Card className="md:min-h-[calc(100vh-59px)] rounded-none flex flex-col">
      <CardHeader>
        <CardTitle className="m-0 text-xl">Edit Establishment</CardTitle>
        <Separator />
      </CardHeader>

      <CardContent className="space-y-2 flex-1">
        {/* Name Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-medium">Name *</label>
            {getFieldState("name").message && (
              <span className="text-sm text-destructive">
                {getFieldState("name").message}
              </span>
            )}
          </div>
          <Input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={getFieldState("name").className}
            required
          />
        </div>

        <div>
          <label className="font-medium text-lg">Address</label>
        </div>

        {/* Region */}
        <div className="space-y-2 grid grid-cols-3">
          <label className="pl-4 font-medium">Region *</label>
          <div className="col-span-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={`justify-between w-full ${
                    getFieldState("region").className
                  }`}
                >
                  {formData.region || "Select Region"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search region..." />
                  <CommandEmpty>No region found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {regions.map((r: any) => (
                      <CommandItem
                        key={r.name}
                        value={r.name}
                        onSelect={() => {
                          handleChange("region", r.name);
                          handleChange("province", "");
                          handleChange("city", "");
                          handleChange("barangay", "");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.region === r.name
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {r.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          {getFieldState("region").message && (
            <p className="col-span-2 text-sm text-destructive">
              {getFieldState("region").message}
            </p>
          )}
        </div>

        {/* Province */}
        {formData.region && (
          <div className="space-y-2 grid grid-cols-3">
            <label className="pl-4 font-medium">Province *</label>
            <div className="col-span-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    ref={provinceRef}
                    variant="outline"
                    role="combobox"
                    className={`justify-between w-full ${
                      getFieldState("province").className
                    }`}
                  >
                    {formData.province || "Select Province"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search province..." />
                    <CommandEmpty>No province found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {provinces.map((p: any) => (
                        <CommandItem
                          key={p.name}
                          value={p.name}
                          onSelect={() => {
                            handleChange("province", p.name);
                            handleChange("city", "");
                            handleChange("barangay", "");
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.province === p.name
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {p.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {getFieldState("province").message && (
              <p className="col-span-2 text-sm text-destructive">
                {getFieldState("province").message}
              </p>
            )}
          </div>
        )}

        {/* City */}
        {formData.province && (
          <div className="space-y-2 grid grid-cols-3">
            <label className="pl-4 font-medium">City *</label>
            <div className="col-span-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    ref={cityRef}
                    variant="outline"
                    role="combobox"
                    className={`justify-between w-full ${
                      getFieldState("city").className
                    }`}
                  >
                    {formData.city || "Select City"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search city..." />
                    <CommandEmpty>No city found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {cities.map((c: any) => (
                        <CommandItem
                          key={c.name}
                          value={c.name}
                          onSelect={() => {
                            handleChange("city", c.name);
                            handleChange("barangay", "");
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.city === c.name
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {c.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {getFieldState("city").message && (
              <p className="col-span-2 text-sm text-destructive">
                {getFieldState("city").message}
              </p>
            )}
          </div>
        )}

        {/* Barangay */}
        {formData.city && barangays.length > 0 && (
          <div className="space-y-2 grid grid-cols-3">
            <label className="pl-4 font-medium">Barangay *</label>
            <div className="col-span-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    ref={barangayRef}
                    variant="outline"
                    role="combobox"
                    className={`justify-between w-full ${
                      getFieldState("barangay").className
                    }`}
                  >
                    {formData.barangay || "Select Barangay"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search barangay..." />
                    <CommandEmpty>No barangay found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {barangays.map((b: any) => (
                        <CommandItem
                          key={b}
                          value={b}
                          onSelect={() => handleChange("barangay", b)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.barangay === b
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {b}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {getFieldState("barangay").message && (
              <p className="col-span-2 text-sm text-destructive">
                {getFieldState("barangay").message}
              </p>
            )}
          </div>
        )}

        {/* Address Line */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-medium">Street / Building *</label>
            {getFieldState("address_line").message && (
              <span className="text-sm text-destructive">
                {getFieldState("address_line").message}
              </span>
            )}
          </div>
          <Input
            value={formData.address_line}
            onChange={(e) => handleChange("address_line", e.target.value)}
            className={getFieldState("address_line").className}
            required
          />
        </div>

        {/* Postal Code */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-medium">Postal Code *</label>
            {getFieldState("postal_code").message && (
              <span className="text-sm text-destructive">
                {getFieldState("postal_code").message}
              </span>
            )}
          </div>
          <Input
            value={formData.postal_code}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 4);
              handleChange("postal_code", value);
            }}
            className={getFieldState("postal_code").className}
            placeholder="4-digit postal code"
            maxLength={4}
            inputMode="numeric"
            pattern="\d{4}"
          />
        </div>

        {/* Coordinates */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-medium">Coordinates</label>
            {(getFieldState("latitude").message ||
              getFieldState("longitude").message) && (
              <span className="text-sm text-destructive">
                {getFieldState("latitude").message ||
                  getFieldState("longitude").message}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                value={formData.latitude}
                onChange={(e) => handleChange("latitude", e.target.value)}
                placeholder="Latitude"
                className={getFieldState("latitude").className}
              />
            </div>
            <div>
              <Input
                value={formData.longitude}
                onChange={(e) => handleChange("longitude", e.target.value)}
                placeholder="Longitude"
                className={getFieldState("longitude").className}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter coordinates in decimal degrees (e.g., "14.5995" and
            "120.9842")
          </p>
        </div>

        {/* Year Established */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-medium">Year Established *</label>
            {getFieldState("year_established").message && (
              <span className="text-sm text-destructive">
                {getFieldState("year_established").message}
              </span>
            )}
          </div>
          <Input
            type="number"
            value={formData.year_established || ""}
            onChange={(e) => handleChange("year_established", e.target.value)}
            className={getFieldState("year_established").className}
            min="1900"
            max={new Date().getFullYear()}
            required
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-3 w-full px-6 mt-auto">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="w-full sm:flex-1 capitalize"
        >
          CANCEL
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSubmitting}
          className="w-full sm:flex-1 capitalize"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          {isSubmitting ? "Saving..." : "UPDATE ESTABLISHMENT"}
        </Button>
      </CardFooter>

      {/* Save Confirmation Dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update this establishment?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {isSubmitting ? "Saving..." : "Confirm Update"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Cancel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel editing? All changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
