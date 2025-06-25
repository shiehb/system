import { useEffect, useState } from "react";
import addressData from "@/data/region-ph.json";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { EstablishmentFormData } from "@/lib/establishmentApi";
import { toast } from "sonner";

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

export default function AddEstablishment({
  onAdd,
  isSubmitting,
}: {
  onAdd: (est: EstablishmentFormData) => Promise<void>;
  isSubmitting?: boolean;
}) {
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
  const [coordinates, setCoordinates] = usePersistedState(
    "est_coordinates",
    ""
  );
  const [year, setYear] = usePersistedState("est_year", "");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    region: "",
    province: "",
    city: "",
    barangay: "",
    addressLine: "",
    year: "",
  });

  const regions = addressData.regions || [];
  const provinces =
    regions.find((r: any) => r.name === region)?.provinces || [];
  const cities =
    provinces.find((p: any) => p.name === province)?.municipalities || [];
  const barangays = cities.find((c: any) => c.name === city)?.barangays || [];

  const buildAddress = () =>
    [addressLine, barangay, city, province, postalCode, region]
      .filter(Boolean)
      .join(", ");

  const fetchCoordinates = async () => {
    const address = buildAddress();
    if (!address) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await res.json();
      if (data?.length > 0) {
        setCoordinates(`${data[0].lat}, ${data[0].lon}`);
      } else {
        setCoordinates("Not found");
      }
    } catch (e) {
      setCoordinates("Error");
    } finally {
      setLoading(false);
    }
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
      year: "",
    };

    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    if (!region) (newErrors.region = "Region is required"), (isValid = false);
    if (!province)
      (newErrors.province = "Province is required"), (isValid = false);
    if (!city) (newErrors.city = "City is required"), (isValid = false);
    if (!barangay)
      (newErrors.barangay = "Barangay is required"), (isValid = false);
    if (!addressLine.trim())
      (newErrors.addressLine = "Address line is required"), (isValid = false);

    const yearNum = Number(year);
    const currentYear = new Date().getFullYear();
    if (!year) {
      newErrors.year = "Year is required";
      isValid = false;
    } else if (isNaN(yearNum)) {
      newErrors.year = "Must be a valid number";
      isValid = false;
    } else if (yearNum < 1900 || yearNum > 2026 || yearNum > currentYear) {
      newErrors.year = `Year must be between 1900 and ${Math.min(
        currentYear,
        2026
      )}`;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    let latitude = "";
    let longitude = "";
    if (coordinates.includes(",")) {
      [latitude, longitude] = coordinates.split(",").map((s) => s.trim());
    }

    const formData: EstablishmentFormData = {
      name,
      address_line: addressLine,
      barangay,
      city,
      province,
      region,
      postal_code: postalCode || undefined,
      latitude: latitude || undefined,
      longitude: longitude || undefined,
      year_established: year || undefined,
    };

    try {
      await onAdd(formData);
      resetForm();
      toast.success("Establishment created successfully");
    } catch {
      toast.error("Failed to create establishment");
    }
  };

  const resetForm = () => {
    setName("");
    setAddressLine("");
    setPostalCode("");
    setRegion("");
    setProvince("");
    setCity("");
    setBarangay("");
    setCoordinates("");
    setYear("");
    setErrors({
      name: "",
      region: "",
      province: "",
      city: "",
      barangay: "",
      addressLine: "",
      year: "",
    });
    [
      "est_name",
      "est_addressLine",
      "est_postalCode",
      "est_region",
      "est_province",
      "est_city",
      "est_barangay",
      "est_coordinates",
      "est_year",
    ].forEach((key) => localStorage.removeItem(key));
    toast.info("Form cleared");
  };

  const getErrorClass = (field: keyof typeof errors) =>
    errors[field] ? "border-destructive" : "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Establishment</CardTitle>
        <CardDescription>Enter the establishment details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label>Name *</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={getErrorClass("name")}
            required
          />
        </div>

        <div className="space-y-2 w-full">
          <label>Region *</label>
          <select
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setProvince("");
              setCity("");
              setBarangay("");
            }}
            className={getErrorClass("region")}
          >
            <option value="">Select Region</option>
            {regions.map((r: any) => (
              <option key={r.name} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {region && (
          <div className="space-y-2">
            <label>Province *</label>
            <select
              value={province}
              onChange={(e) => {
                setProvince(e.target.value);
                setCity("");
                setBarangay("");
              }}
              className={getErrorClass("province")}
            >
              <option value="">Select Province</option>
              {provinces.map((p: any) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {province && (
          <div className="space-y-2">
            <label>City *</label>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setBarangay("");
              }}
              className={getErrorClass("city")}
            >
              <option value="">Select City</option>
              {cities.map((c: any) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {city && barangays.length > 0 && (
          <div className="space-y-2">
            <label>Barangay *</label>
            <select
              value={barangay}
              onChange={(e) => {
                setBarangay(e.target.value);
                setTimeout(fetchCoordinates, 0);
              }}
              className={getErrorClass("barangay")}
            >
              <option value="">Select Barangay</option>
              {barangays.map((b: any) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-2">
          <label>Street / Building *</label>
          <Input
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
            className={getErrorClass("addressLine")}
            required
          />
        </div>

        <div className="space-y-2">
          <label>Postal Code</label>
          <Input
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label>Coordinates</label>
          <div className="flex gap-2">
            <Input
              value={coordinates}
              onChange={(e) => setCoordinates(e.target.value)}
            />
            <Button onClick={fetchCoordinates} disabled={loading} type="button">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Auto-fetch"
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label>Year *</label>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={getErrorClass("year")}
            min="1900"
            max="2100"
            required
          />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={resetForm}
          disabled={isSubmitting}
        >
          Clear Form
        </Button>
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          {isSubmitting ? "Saving..." : "Save Establishment"}
        </Button>
      </CardFooter>
    </Card>
  );
}
