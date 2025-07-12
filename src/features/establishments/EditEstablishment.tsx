import { useEffect, useState, useRef } from "react";
import addressData from "@/data/region-ph.json";
import { geocodeAddress } from "@/utils/geocoding";
import { CoordinatesMapPreview } from "@/components/map/CoordinatesMapPreview";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Check, ChevronsUpDown, Plus } from "lucide-react";
import type { EstablishmentFormData } from "@/lib/establishmentApi";
import { toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { YearPicker } from "@/components/YearPicker";
import {
  fetchNatureOfBusinessOptions,
  createNatureOfBusiness,
} from "@/lib/establishmentApi";

interface EditEstablishmentProps {
  id: number;
  businessTypes: { id: number; name: string }[];
  establishment: EstablishmentFormData;
  onUpdate: (id: number, data: EstablishmentFormData) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
  onToggleMapPreview: (
    show: boolean,
    coordinates?: { lat: string; lng: string; name?: string }
  ) => void;
}

export default function EditEstablishment({
  id,
  establishment,
  onUpdate,
  isSubmitting,
  onCancel,
}: EditEstablishmentProps) {
  const [formData, setFormData] =
    useState<EstablishmentFormData>(establishment);
  const [isFetchingCoords, setIsFetchingCoords] = useState(false);
  const [businessTypes, setBusinessTypes] = useState<
    { id: number; name: string }[]
  >([]);
  const [loadingBusinessTypes, setLoadingBusinessTypes] = useState(true);
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
    nature_of_business_id: "",
  });
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const provinceRef = useRef<HTMLButtonElement>(null);
  const cityRef = useRef<HTMLButtonElement>(null);
  const barangayRef = useRef<HTMLButtonElement>(null);

  const regions = addressData.regions || [];
  const hasSingleRegion = regions.length === 1;
  const provinces =
    regions.find((r: any) => r.name === formData.region)?.provinces || [];
  const cities =
    provinces.find((p: any) => p.name === formData.province)?.municipalities ||
    [];
  const barangays =
    cities.find((c: any) => c.name === formData.city)?.barangays || [];

  useEffect(() => {
    const fetchBusinessTypes = async () => {
      try {
        const types = await fetchNatureOfBusinessOptions();
        setBusinessTypes(types);
      } catch (error) {
        toast.error("Failed to load business types");
      } finally {
        setLoadingBusinessTypes(false);
      }
    };
    fetchBusinessTypes();
  }, []);

  useEffect(() => {
    if (hasSingleRegion && !formData.region) {
      handleLocationChange("region", regions[0].name);
    }
  }, [hasSingleRegion, formData.region]);

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

  const updateCoordinatesFromAddress = async () => {
    if (!formData.barangay && !formData.city && !formData.province) return;

    setIsFetchingCoords(true);
    try {
      const addressParts = [
        formData.barangay,
        formData.city,
        formData.province,
        formData.region,
        "Philippines",
      ]
        .filter(Boolean)
        .join(", ");

      const coords = await geocodeAddress(addressParts);
      if (coords) {
        setFormData((prev) => ({
          ...prev,
          latitude: coords.lat,
          longitude: coords.lon,
        }));
        toast.success("Coordinates updated successfully");
      } else {
        toast.warning("No coordinates found for this location");
      }
    } catch (error) {
      toast.error("Failed to fetch coordinates");
      console.error("Geocoding error:", error);
    } finally {
      setIsFetchingCoords(false);
    }
  };

  const handleLocationChange = async (
    field: keyof EstablishmentFormData,
    value: string
  ) => {
    if (field === "region") {
      setFormData((prev) => ({
        ...prev,
        region: value,
        province: "",
        city: "",
        barangay: "",
        postal_code: "",
      }));
    } else if (field === "province") {
      setFormData((prev) => ({
        ...prev,
        province: value,
        city: "",
        barangay: "",
        postal_code: "",
      }));
    } else if (field === "city") {
      const selectedCity = cities.find((c: any) => c.name === value);
      setFormData((prev) => ({
        ...prev,
        city: value,
        barangay: "",
        postal_code: selectedCity?.postal_code || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    setTimeout(updateCoordinatesFromAddress, 0);
  };

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
      name: !formData.name ? "Required" : "",
      region: !formData.region ? "Required" : "",
      province: !formData.province ? "Required" : "",
      city: !formData.city ? "Required" : "",
      barangay: !formData.barangay ? "Required" : "",
      address_line: !formData.address_line ? "Required" : "",
      postal_code: !formData.postal_code
        ? "Required"
        : !/^\d{4}$/.test(formData.postal_code)
        ? "Must be a 4-digit number"
        : "",
      year_established: !formData.year_established
        ? "Required"
        : isNaN(Number(formData.year_established))
        ? "Must be a valid number"
        : Number(formData.year_established) < 1900 ||
          Number(formData.year_established) > new Date().getFullYear()
        ? `Year must be between 1900 and ${new Date().getFullYear()}`
        : "",
      latitude: !formData.latitude
        ? "Required"
        : isNaN(Number(formData.latitude))
        ? "Must be a valid number"
        : "",
      longitude: !formData.longitude
        ? "Required"
        : isNaN(Number(formData.longitude))
        ? "Must be a valid number"
        : "",
      nature_of_business_id: !formData.nature_of_business_id ? "Required" : "",
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
        nature_of_business_id: formData.nature_of_business_id
          ? parseInt(String(formData.nature_of_business_id))
          : undefined,
      });
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update establishment");
    }
  };

  const handleCancel = () => {
    const isModified = Object.keys(formData).some((key) => {
      const formKey = key as keyof EstablishmentFormData;
      const originalValue = establishment[formKey] || "";
      const currentValue = formData[formKey] || "";
      return currentValue !== originalValue;
    });

    if (isModified) {
      setShowCancelDialog(true);
    } else {
      onCancel?.();
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    [
      "est_name",
      "est_addressLine",
      "est_postalCode",
      "est_region",
      "est_province",
      "est_city",
      "est_barangay",
      "est_latitude",
      "est_longitude",
      "est_year",
      "est_natureOfBusiness",
    ].forEach((key) => localStorage.removeItem(key));

    onCancel?.();
  };

  const getErrorClass = (field: keyof typeof errors) =>
    errors[field] || apiErrors[field] ? "border-destructive" : "";

  const getErrorMessage = (field: keyof typeof errors) => {
    return apiErrors[field] || errors[field];
  };

  const ErrorLabel = ({ field }: { field: keyof typeof errors }) => {
    const message = getErrorMessage(field);
    return message ? (
      <span className="text-sm text-destructive ml-auto">({message})</span>
    ) : null;
  };
  const [isBusinessTypeDialogOpen, setIsBusinessTypeDialogOpen] =
    useState(false);
  const [newBusinessType, setNewBusinessType] = useState({
    name: "",
    description: "",
  });
  const [isCreatingBusinessType, setIsCreatingBusinessType] = useState(false);

  // Add this function to handle business type creation
  const handleCreateBusinessType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreatingBusinessType(true);
      const createdType = await createNatureOfBusiness(newBusinessType);
      setBusinessTypes([...businessTypes, createdType]);
      handleChange("nature_of_business_id", createdType.id.toString());
      toast.success("Business type created successfully");
      setNewBusinessType({ name: "", description: "" });
      setIsBusinessTypeDialogOpen(false);
    } catch (error) {
      toast.error(
        (error as { message: string }).message ||
          "Failed to create business type"
      );
    } finally {
      setIsCreatingBusinessType(false);
    }
  };

  return (
    <Card className="md:min-h-[calc(100vh-60px)] rounded-none flex flex-col">
      <CardContent className="space-y-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form Fields */}
          <div className="space-y-4">
            {/* Basic Information Section */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold tracking-tight">
                    Edit Establishment
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Update the establishment details below
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData({
                      name: establishment.name,
                      address_line: establishment.address_line,
                      barangay: establishment.barangay,
                      city: establishment.city,
                      province: establishment.province,
                      region: establishment.region,
                      postal_code: establishment.postal_code,
                      latitude: establishment.latitude,
                      longitude: establishment.longitude,
                      year_established: establishment.year_established,
                      nature_of_business_id:
                        establishment.nature_of_business_id ?? null,
                    });
                    toast.success("Changes reset to original values");
                  }}
                  className="mt-1"
                  disabled={isSubmitting}
                >
                  Reset Changes
                </Button>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="font-medium">Name *</label>
                  <ErrorLabel field="name" />
                </div>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={getErrorClass("name")}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* Nature of Business Field */}
                <div className="col-span-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="font-medium">Nature of Business *</label>
                    <ErrorLabel field="nature_of_business_id" />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={`justify-between w-full ${getErrorClass(
                          "nature_of_business_id"
                        )}`}
                      >
                        {businessTypes.find(
                          (type) =>
                            type.id.toString() ===
                            String(formData.nature_of_business_id)
                        )?.name || "Select business type"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[435px] p-0">
                      <Command>
                        <CommandInput placeholder="Search business type..." />
                        <CommandEmpty>
                          <div className="flex flex-col items-center gap-2 p-4">
                            <span>No business type found.</span>
                            <Button
                              variant="link"
                              className="text-primary"
                              onClick={() => setIsBusinessTypeDialogOpen(true)}
                            >
                              + Add New Business Type
                            </Button>
                          </div>
                        </CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-y-auto">
                          {loadingBusinessTypes ? (
                            <div className="flex justify-center p-4">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            <>
                              {businessTypes.map((type) => (
                                <CommandItem
                                  key={type.id}
                                  value={type.name}
                                  onSelect={() =>
                                    handleChange(
                                      "nature_of_business_id" as keyof EstablishmentFormData,
                                      type.id.toString()
                                    )
                                  }
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      String(formData.nature_of_business_id) ===
                                        type.id.toString()
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {type.name}
                                </CommandItem>
                              ))}
                              <CommandSeparator className="mb-1" />
                              <CommandItem
                                value="add-new"
                                onSelect={() =>
                                  setIsBusinessTypeDialogOpen(true)
                                }
                                className="text-blue-600 font-medium"
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Business Type
                              </CommandItem>
                            </>
                          )}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Year Established Field */}
                <div className="space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    <label className="font-medium">Year Established *</label>
                    <ErrorLabel field="year_established" />
                  </div>
                  <YearPicker
                    value={formData.year_established || ""}
                    onChange={(newYear) => {
                      handleChange("year_established", newYear);
                    }}
                    error={!!errors.year_established}
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="md:min-h-[calc(100vh-440px)]">
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold text-lg">Address</h3>

                <div className="grid grid-cols-3 gap-2">
                  {/* REGION */}
                  {!hasSingleRegion && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="font-medium">Region *</label>
                        <ErrorLabel field="region" />
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={`justify-between w-full ${getErrorClass(
                              "region"
                            )}`}
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
                                  onSelect={() =>
                                    handleLocationChange("region", r.name)
                                  }
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
                  )}

                  {/* PROVINCE */}
                  {formData.region && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="font-medium">Province *</label>
                        <ErrorLabel field="province" />
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            ref={provinceRef}
                            variant="outline"
                            role="combobox"
                            className={`justify-between w-full ${getErrorClass(
                              "province"
                            )}`}
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
                                  onSelect={() =>
                                    handleLocationChange("province", p.name)
                                  }
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
                  )}

                  {/* CITY */}
                  {formData.province && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="font-medium">City *</label>
                        <ErrorLabel field="city" />
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            ref={cityRef}
                            variant="outline"
                            role="combobox"
                            className={`justify-between w-full ${getErrorClass(
                              "city"
                            )}`}
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
                                  onSelect={() =>
                                    handleLocationChange("city", c.name)
                                  }
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
                  )}

                  {/* BARANGAY */}
                  {formData.city && barangays.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="font-medium">Barangay *</label>
                        <ErrorLabel field="barangay" />
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            ref={barangayRef}
                            variant="outline"
                            role="combobox"
                            className={`justify-between w-full ${getErrorClass(
                              "barangay"
                            )}`}
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
                                  onSelect={() =>
                                    handleLocationChange("barangay", b)
                                  }
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
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Address Line */}
                  <div className="space-y-2 col-span-2">
                    <div className="flex items-center gap-2">
                      <label className="font-medium">Street / Building *</label>
                      <ErrorLabel field="address_line" />
                    </div>
                    <Input
                      value={formData.address_line}
                      onChange={(e) =>
                        handleChange("address_line", e.target.value)
                      }
                      className={getErrorClass("address_line")}
                      required
                    />
                  </div>

                  {/* Postal Code */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="font-medium">Postal Code *</label>
                      <ErrorLabel field="postal_code" />
                    </div>
                    <Input
                      value={formData.postal_code}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 4);
                        handleChange("postal_code", value);
                      }}
                      className={getErrorClass("postal_code")}
                      placeholder="4-digit postal code"
                      maxLength={4}
                      inputMode="numeric"
                      pattern="\d{4}"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="capitalize min-w-[120px]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="capitalize min-w-[180px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Update Establishment"
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Map and Coordinates */}
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg md:min-h-[calc(100vh-250px)]">
              {/* Coordinates Section */}
              <div className="space-y-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="font-medium">Coordinates *</label>
                    <ErrorLabel field="latitude" />
                    <ErrorLabel field="longitude" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={updateCoordinatesFromAddress}
                    disabled={
                      (!formData.barangay &&
                        !formData.city &&
                        !formData.province) ||
                      isFetchingCoords
                    }
                  >
                    {isFetchingCoords ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {isFetchingCoords ? "Fetching..." : "Fetch Coordinates"}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-sm">Latitude *</label>
                    <Input
                      value={formData.latitude || ""}
                      onChange={(e) => handleChange("latitude", e.target.value)}
                      placeholder="Latitude"
                      className={getErrorClass("latitude")}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm">Longitude *</label>
                    <Input
                      value={formData.longitude || ""}
                      onChange={(e) =>
                        handleChange("longitude", e.target.value)
                      }
                      placeholder="Longitude"
                      className={getErrorClass("longitude")}
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter coordinates in decimal degrees (e.g., "14.5995" and
                  "120.9842")
                </p>
              </div>

              {/* Map Preview */}
              <div className="h-[calc(100vh-300px)] rounded-md overflow-hidden border">
                <CoordinatesMapPreview
                  latitude={formData.latitude || ""}
                  longitude={formData.longitude || ""}
                  onCoordinatesChange={(lat, lng) => {
                    handleChange("latitude", lat.toString());
                    handleChange("longitude", lng.toString());
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <Dialog
        open={isBusinessTypeDialogOpen}
        onOpenChange={setIsBusinessTypeDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Business Type</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateBusinessType} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="business-type-name"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="business-type-name"
                value={newBusinessType.name}
                onChange={(e) =>
                  setNewBusinessType({
                    ...newBusinessType,
                    name: e.target.value,
                  })
                }
                required
                disabled={isCreatingBusinessType}
                placeholder="Enter business type name"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="business-type-description"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Description
              </label>
              <Input
                id="business-type-description"
                value={newBusinessType.description}
                onChange={(e) =>
                  setNewBusinessType({
                    ...newBusinessType,
                    description: e.target.value,
                  })
                }
                disabled={isCreatingBusinessType}
                placeholder="Enter description (optional)"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsBusinessTypeDialogOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingBusinessType}>
                {isCreatingBusinessType
                  ? "Creating..."
                  : "Create Business Type"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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
