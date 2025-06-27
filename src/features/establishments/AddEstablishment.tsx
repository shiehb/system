import { useEffect, useState, useRef } from "react";
import addressData from "@/data/region-ph.json";
import { geocodeAddress } from "@/utils/geocoding";
import { CoordinatesMapPreview } from "@/components/CoordinatesMapPreview";
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
}

export default function AddEstablishment({
  onAdd,
  isSubmitting,
  onToggleMapPreview,
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

  const provinceRef = useRef<HTMLButtonElement>(null);
  const cityRef = useRef<HTMLButtonElement>(null);
  const barangayRef = useRef<HTMLButtonElement>(null);

  const regions = addressData.regions || [];
  const provinces =
    regions.find((r: any) => r.name === region)?.provinces || [];
  const cities =
    provinces.find((p: any) => p.name === province)?.municipalities || [];
  const barangays = cities.find((c: any) => c.name === city)?.barangays || [];

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
    // Clear downstream selections when changing higher-level locations
    if (level === "region") {
      setRegion(value);
      setProvince("");
      setCity("");
      setBarangay("");
    } else if (level === "province") {
      setProvince(value);
      setCity("");
      setBarangay("");
    } else if (level === "city") {
      setCity(value);
      setBarangay("");
    } else {
      setBarangay(value);
    }

    // Update coordinates after state is set
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
      newErrors.name = "required";
      isValid = false;
    }
    if (!region) {
      newErrors.region = "required";
      isValid = false;
    }
    if (!province) {
      newErrors.province = "required";
      isValid = false;
    }
    if (!city) {
      newErrors.city = "required";
      isValid = false;
    }
    if (!barangay) {
      newErrors.barangay = "required";
      isValid = false;
    }
    if (!addressLine.trim()) {
      newErrors.addressLine = "required";
      isValid = false;
    }
    if (!postalCode) {
      newErrors.postalCode = "required";
      isValid = false;
    } else if (!/^\d{4}$/.test(postalCode)) {
      newErrors.postalCode = "Must be a 4-digit number";
      isValid = false;
    }

    const yearNum = Number(year);
    const currentYear = new Date().getFullYear();
    if (!year) {
      newErrors.year = "required";
      isValid = false;
    } else if (isNaN(yearNum)) {
      newErrors.year = "Must be a valid number";
      isValid = false;
    } else if (yearNum < 1900 || yearNum > currentYear) {
      newErrors.year = `Year must be between 1900 and ${currentYear}`;
      isValid = false;
    }

    if (latitude && isNaN(Number(latitude))) {
      newErrors.latitude = "Must be a valid number";
      isValid = false;
    }
    if (longitude && isNaN(Number(longitude))) {
      newErrors.longitude = "Must be a valid number";
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
    setRegion("");
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

  const getErrorClass = (field: keyof typeof errors) =>
    errors[field] || apiErrors[field] ? "border-destructive" : "";

  const getErrorMessage = (field: keyof typeof errors) => {
    return apiErrors[field] || errors[field];
  };

  return (
    <Card className="md:min-h-[calc(100vh-59px)] rounded-none flex flex-col">
      <CardHeader>
        <CardTitle className="m-0 text-xl">Add Establishment</CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-2 flex-1">
        {/* Name Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-medium">Name *</label>
            {getErrorMessage("name") && (
              <span className="text-sm text-destructive">
                {getErrorMessage("name")}
              </span>
            )}
          </div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={getErrorClass("name")}
            required
          />
        </div>

        {/* Nature of Business Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-medium">Nature of Business</label>
            {getErrorMessage("natureOfBusiness") && (
              <span className="text-sm text-destructive">
                {getErrorMessage("natureOfBusiness")}
              </span>
            )}
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
                {businessTypes.find((type) => type.value === natureOfBusiness)
                  ?.label || "Select business type"}
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

        <div>
          <label className="font-medium text-lg">Address</label>
        </div>

        {/* REGION */}
        <div className="space-y-2 grid grid-cols-3">
          <label className="pl-4 font-medium">Region *</label>
          <div className="col-span-2">
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
                        onSelect={() => handleLocationChange("region", r.name)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            region === r.name ? "opacity-100" : "opacity-0"
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
          {getErrorMessage("region") && (
            <p className="col-span-2 text-sm text-destructive">
              {getErrorMessage("region")}
            </p>
          )}
        </div>

        {/* PROVINCE */}
        {region && (
          <div className="space-y-2 grid grid-cols-3">
            <label className="pl-4 font-medium">Province *</label>
            <div className="col-span-2">
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
                              province === p.name ? "opacity-100" : "opacity-0"
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
            {getErrorMessage("province") && (
              <p className="col-span-2 text-sm text-destructive">
                {getErrorMessage("province")}
              </p>
            )}
          </div>
        )}

        {/* CITY */}
        {province && (
          <div className="space-y-2 grid grid-cols-3">
            <label className="pl-4 font-medium">City *</label>
            <div className="col-span-2">
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
                          onSelect={() => handleLocationChange("city", c.name)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              city === c.name ? "opacity-100" : "opacity-0"
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
            {getErrorMessage("city") && (
              <p className="col-span-2 text-sm text-destructive">
                {getErrorMessage("city")}
              </p>
            )}
          </div>
        )}

        {/* BARANGAY */}
        {city && barangays.length > 0 && (
          <div className="space-y-2 grid grid-cols-3">
            <label className="pl-4 font-medium">Barangay *</label>
            <div className="col-span-2">
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
                          onSelect={() => handleLocationChange("barangay", b)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              barangay === b ? "opacity-100" : "opacity-0"
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
            {getErrorMessage("barangay") && (
              <p className="col-span-2 text-sm text-destructive">
                {getErrorMessage("barangay")}
              </p>
            )}
          </div>
        )}

        {/* Address Line Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-medium">Street / Building *</label>
            {getErrorMessage("addressLine") && (
              <span className="text-sm text-destructive">
                {getErrorMessage("addressLine")}
              </span>
            )}
          </div>
          <Input
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
            className={getErrorClass("addressLine")}
            required
          />
        </div>

        {/* Postal Code Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-medium">Postal Code *</label>
            {getErrorMessage("postalCode") && (
              <span className="text-sm text-destructive">
                {getErrorMessage("postalCode")}
              </span>
            )}
          </div>
          <Input
            value={postalCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 4);
              setPostalCode(value);
            }}
            className={getErrorClass("postalCode")}
            placeholder="4-digit postal code"
            maxLength={4}
            inputMode="numeric"
            pattern="\d{4}"
          />
        </div>

        {/* Coordinates Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-medium">Coordinates</label>
            <Button
              className="mr-10"
              type="button"
              variant="outline"
              size="sm"
              onClick={updateCoordinatesFromAddress}
              disabled={(!barangay && !city && !province) || isFetchingCoords}
            >
              {isFetchingCoords ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isFetchingCoords ? "Fetching..." : "Fetch Coordinates"}
            </Button>
          </div>
          {(getErrorMessage("latitude") || getErrorMessage("longitude")) && (
            <span className="text-sm text-destructive">
              {getErrorMessage("latitude") || getErrorMessage("longitude")}
            </span>
          )}
          <div className="grid grid-cols-2 gap-2 relative">
            <div>
              <Input
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Latitude"
                className={getErrorClass("latitude")}
              />
            </div>
            <div>
              <Input
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Longitude"
                className={getErrorClass("longitude")}
              />
            </div>
            <div className="col-span-2">
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
          <p className="text-xs text-muted-foreground">
            Enter coordinates in decimal degrees (e.g., "14.5995" and
            "120.9842")
          </p>
        </div>

        {/* Year Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-medium">Year Established *</label>
            {getErrorMessage("year") && (
              <span className="text-sm text-destructive">
                {getErrorMessage("year")}
              </span>
            )}
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
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 w-full px-6 mt-auto">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowClearDialog(true)}
          disabled={isSubmitting}
          className="w-full sm:flex-1 capitalize"
        >
          CLEAR FORM
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSubmitting}
          className="w-full sm:flex-1 capitalize"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          {isSubmitting ? "Saving..." : "SAVE ESTABLISHMENT"}
        </Button>
      </CardFooter>

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
    </Card>
  );
}
