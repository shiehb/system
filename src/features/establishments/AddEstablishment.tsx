import { useEffect, useState, useRef } from "react";
import addressData from "@/data/region-ph.json";
import { geocodeAddress } from "@/utils/geocoding";
import { CoordinatesMapPreview } from "@/components/CoordinatesMapPreview";
import { Card, CardContent } from "@/components/ui/card";
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

function usePersistedState<T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

const businessTypes = [
  { value: "retail", label: "Retail" },
  { value: "food", label: "Food & Beverage" },
  { value: "service", label: "Service" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "hospitality", label: "Hospitality" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
];

interface AddEstablishmentProps {
  onAdd: (est: EstablishmentFormData) => Promise<void>;
  isSubmitting?: boolean;
  onToggleMapPreview: (
    show: boolean,
    coordinates?: { lat: string; lng: string; name?: string }
  ) => void;
  onCancel?: () => void;
}

export default function AddEstablishment({
  onAdd,
  isSubmitting,
  onCancel,
}: AddEstablishmentProps) {
  const [name, setName] = usePersistedState("est_name", "");
  const [addressLine, setAddressLine] = usePersistedState(
    "est_addressLine",
    ""
  );
  const [postalCode, setPostalCode] = usePersistedState("est_postalCode", "");
  const [region, setRegion] = usePersistedState("est_region", "");
  const [province, setProvince] = usePersistedState("est_province", "");
  const [city, setCity] = usePersistedState("est_city", "");
  const [barangay, setBarangay] = usePersistedState("est_barangay", "");
  const [latitude, setLatitude] = usePersistedState("est_latitude", "");
  const [longitude, setLongitude] = usePersistedState("est_longitude", "");
  const [year, setYear] = usePersistedState("est_year", "");
  const [natureOfBusiness, setNatureOfBusiness] = usePersistedState(
    "est_natureOfBusiness",
    ""
  );
  const [isFetchingCoords, setIsFetchingCoords] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    region: "",
    province: "",
    city: "",
    barangay: "",
    addressLine: "",
    postalCode: "",
    year: "",
    latitude: "",
    longitude: "",
    natureOfBusiness: "",
  });
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const provinceRef = useRef<HTMLButtonElement>(null);
  const cityRef = useRef<HTMLButtonElement>(null);
  const barangayRef = useRef<HTMLButtonElement>(null);

  const regions = addressData.regions || [];
  const hasSingleRegion = regions.length === 1;
  const provinces =
    regions.find((r: any) => r.name === region)?.provinces || [];
  const cities =
    provinces.find((p: any) => p.name === province)?.municipalities || [];
  const barangays = cities.find((c: any) => c.name === city)?.barangays || [];

  useEffect(() => {
    if (hasSingleRegion && !region) {
      handleLocationChange("region", regions[0].name);
    }
  }, [hasSingleRegion, region]);

  useEffect(() => {
    if (region && provinceRef.current) {
      setTimeout(() => provinceRef.current?.focus(), 100);
    }
  }, [region]);

  useEffect(() => {
    if (province && cityRef.current) {
      setTimeout(() => cityRef.current?.focus(), 100);
    }
  }, [province]);

  useEffect(() => {
    if (city && barangayRef.current && barangays.length > 0) {
      setTimeout(() => barangayRef.current?.focus(), 100);
    }
  }, [city, barangays.length]);

  const updateCoordinatesFromAddress = async () => {
    if (!barangay && !city && !province) return;

    setIsFetchingCoords(true);
    try {
      const addressParts = [barangay, city, province, region, "Philippines"]
        .filter(Boolean)
        .join(", ");

      const coords = await geocodeAddress(addressParts);
      if (coords) {
        setLatitude(coords.lat);
        setLongitude(coords.lon);
        toast.success("Coordinates fetched successfully");
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
    level: "region" | "province" | "city" | "barangay",
    value: string
  ) => {
    if (level === "region") {
      setRegion(value);
      setProvince("");
      setCity("");
      setBarangay("");
      setPostalCode("");
    } else if (level === "province") {
      setProvince(value);
      setCity("");
      setBarangay("");
      setPostalCode("");
    } else if (level === "city") {
      setCity(value);
      setBarangay("");
      const selectedCity = cities.find((c: any) => c.name === value);
      if (selectedCity?.postal_code) {
        setPostalCode(selectedCity.postal_code);
      } else {
        setPostalCode("");
      }
    } else {
      setBarangay(value);
    }

    setTimeout(updateCoordinatesFromAddress, 0);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      region: "",
      province: "",
      city: "",
      barangay: "",
      addressLine: "",
      postalCode: "",
      year: "",
      latitude: "",
      longitude: "",
      natureOfBusiness: "",
    };

    if (!name.trim()) {
      newErrors.name = "Required";
      isValid = false;
    }
    if (!region) {
      newErrors.region = "Required";
      isValid = false;
    }
    if (!province) {
      newErrors.province = "Required";
      isValid = false;
    }
    if (!city) {
      newErrors.city = "Required";
      isValid = false;
    }
    if (!barangay) {
      newErrors.barangay = "Required";
      isValid = false;
    }
    if (!addressLine.trim()) {
      newErrors.addressLine = "Required";
      isValid = false;
    }
    if (!postalCode) {
      newErrors.postalCode = "Required";
      isValid = false;
    } else if (!/^\d{4}$/.test(postalCode)) {
      newErrors.postalCode = "Must be a 4-digit number";
      isValid = false;
    }

    const yearNum = Number(year);
    const currentYear = new Date().getFullYear();
    if (!year) {
      newErrors.year = "Required";
      isValid = false;
    } else if (isNaN(yearNum)) {
      newErrors.year = "Must be a valid number";
      isValid = false;
    } else if (yearNum < 1900 || yearNum > currentYear) {
      newErrors.year = `Year must be between 1900 and ${currentYear}`;
      isValid = false;
    }

    if (!latitude) {
      newErrors.latitude = "Required";
      isValid = false;
    } else if (isNaN(Number(latitude))) {
      newErrors.latitude = "Must be a valid number";
      isValid = false;
    }

    if (!longitude) {
      newErrors.longitude = "Required";
      isValid = false;
    } else if (isNaN(Number(longitude))) {
      newErrors.longitude = "Must be a valid number";
      isValid = false;
    }

    if (!natureOfBusiness) {
      newErrors.natureOfBusiness = "Required";
      isValid = false;
    }

    setErrors(newErrors);
    setApiErrors({});
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix all errors before submitting");
      return;
    }
    setShowSaveDialog(true);
  };

  const confirmSave = async () => {
    setShowSaveDialog(false);

    const formData: EstablishmentFormData = {
      name,
      address_line: addressLine,
      barangay,
      city,
      province,
      region,
      postal_code: postalCode,
      latitude: latitude || undefined,
      longitude: longitude || undefined,
      year_established: year,
      nature_of_business: natureOfBusiness || undefined,
    };

    try {
      await onAdd(formData);
      resetForm(false);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes(":")) {
          const fieldErrors = error.message.split("\n").reduce((acc, line) => {
            const [field, message] = line.split(": ");
            if (field && message) {
              acc[field] = message;
            }
            return acc;
          }, {} as Record<string, string>);

          setApiErrors(fieldErrors);
          toast.error("Please fix the validation errors");
        } else {
          toast.error(error.message || "Failed to create establishment");
        }
      } else {
        toast.error("Failed to create establishment");
      }
    }
  };

  const resetForm = (showToast = true) => {
    setShowClearDialog(false);
    setName("");
    setAddressLine("");
    setPostalCode("");
    if (!hasSingleRegion) {
      setRegion("");
    }
    setProvince("");
    setCity("");
    setBarangay("");
    setLatitude("");
    setLongitude("");
    setYear("");
    setNatureOfBusiness("");
    setErrors({
      name: "",
      region: "",
      province: "",
      city: "",
      barangay: "",
      addressLine: "",
      postalCode: "",
      year: "",
      latitude: "",
      longitude: "",
      natureOfBusiness: "",
    });
    setApiErrors({});
    if (showToast) {
      toast.info("Form cleared");
    }
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
  };

  const handleCancel = () => {
    const isFormEmpty =
      !name &&
      !addressLine &&
      !postalCode &&
      !region &&
      !province &&
      !city &&
      !barangay &&
      !latitude &&
      !longitude &&
      !year &&
      !natureOfBusiness;

    if (isFormEmpty) {
      onCancel?.();
    } else {
      setShowCancelDialog(true);
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    resetForm(false);
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
                    Add New Establishment
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Fill in the basic information and address details for the
                    new establishment
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowClearDialog(true)}
                  className="mt-1"
                  disabled={isSubmitting}
                >
                  Clear Form
                </Button>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="font-medium">Name *</label>
                  <ErrorLabel field="name" />
                </div>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={getErrorClass("name")}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Nature of Business Field */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="font-medium">Nature of Business *</label>
                    <ErrorLabel field="natureOfBusiness" />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={`justify-between w-full ${getErrorClass(
                          "natureOfBusiness"
                        )}`}
                      >
                        {businessTypes.find(
                          (type) => type.value === natureOfBusiness
                        )?.label || "Select business type"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search business type..." />
                        <CommandEmpty>No business type found.</CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-y-auto">
                          {businessTypes.map((type) => (
                            <CommandItem
                              key={type.value}
                              value={type.value}
                              onSelect={() => {
                                setNatureOfBusiness(type.value);
                                if (errors.natureOfBusiness) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    natureOfBusiness: "",
                                  }));
                                }
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  natureOfBusiness === type.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {type.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Year Established Field */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="font-medium">Year Established *</label>
                    <ErrorLabel field="year" />
                  </div>
                  <Input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className={getErrorClass("year")}
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="md:min-h-[calc(100vh-440px)]">
              {/* Address Section */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold text-lg">Address</h3>

                {/* Address Line Field */}
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
                            {region || "Select Region"}
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
                                      region === r.name
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
                  {region && (
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
                            className={`justify-between w-full  ${getErrorClass(
                              "province"
                            )}`}
                          >
                            {province || "Select Province"}
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
                                      province === p.name
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
                  {province && (
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
                            {city || "Select City"}
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
                                      city === c.name
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
                  {city && barangays.length > 0 && (
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
                            {barangay || "Select Barangay"}
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
                                      barangay === b
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
                      <ErrorLabel field="addressLine" />
                    </div>
                    <Input
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      className={getErrorClass("addressLine")}
                      required
                    />
                  </div>

                  {/* Postal Code */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="font-medium">Postal Code *</label>
                      <ErrorLabel field="postalCode" />
                    </div>
                    <Input
                      value={postalCode}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 4);
                        setPostalCode(value);
                      }}
                      className={getErrorClass("postalCode")}
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
                    "Save Establishment"
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
                      (!barangay && !city && !province) || isFetchingCoords
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
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="Latitude"
                      className={getErrorClass("latitude")}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm">Longitude *</label>
                    <Input
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
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
                  latitude={latitude}
                  longitude={longitude}
                  onCoordinatesChange={(lat, lng) => {
                    setLatitude(lat.toString());
                    setLongitude(lng.toString());
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Save Confirmation Dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Save</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save this establishment?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {isSubmitting ? "Saving..." : "Confirm Save"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear Form Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Clear Form</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear the form?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => resetForm(true)}>
              Clear Form
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
              Are you sure you want to cancel? All unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>
              Confirm Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
