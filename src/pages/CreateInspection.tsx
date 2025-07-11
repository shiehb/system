// src/pages/division-chief/create-inspection.tsx
"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@radix-ui/react-select";
import {
  Building,
  Scale,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

interface Establishment {
  id: string;
  name: string;
  type: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
}

interface Law {
  id: string;
  code: string;
  title: string;
  category: string;
  description: string;
}

const mockLaws: Law[] = [
  {
    id: "LAW-001",
    code: "RA 8749",
    title: "Philippine Clean Air Act of 1999",
    category: "emissions",
    description: "Comprehensive air pollution control policy",
  },
  // ... other laws from your original file
];

export default function CreateInspectionPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [selectedEstablishment, setSelectedEstablishment] =
    useState<Establishment | null>(null);
  const [selectedLaws, setSelectedLaws] = useState<string[]>([]);
  const [establishmentSearch, setEstablishmentSearch] = useState<string>("");
  const [lawSearch, setLawSearch] = useState<string>("");
  const [lawCategoryFilter, setLawCategoryFilter] = useState<string>("all");
  const [showNewEstablishmentForm, setShowNewEstablishmentForm] =
    useState<boolean>(false);
  const [newEstablishment, setNewEstablishment] = useState<
    Partial<Establishment>
  >({
    name: "",
    type: "manufacturing",
    address: "",
    contactPerson: "",
    phone: "",
    email: "",
  });

  const [establishments, setEstablishments] = useState<Establishment[]>([
    {
      id: "EST-001",
      name: "ABC Manufacturing Corp",
      type: "manufacturing",
      address: "123 Industrial Ave, Metro Manila",
      contactPerson: "Maria Santos",
      phone: "+63-2-123-4567",
      email: "maria.santos@abcmfg.com",
    },
    // ... other establishments from your original file
  ]);

  const filteredEstablishments = establishments.filter(
    (establishment) =>
      establishment.name
        .toLowerCase()
        .includes(establishmentSearch.toLowerCase()) ||
      establishment.type
        .toLowerCase()
        .includes(establishmentSearch.toLowerCase())
  );

  const filteredLaws = mockLaws.filter((law) => {
    const matchesSearch =
      law.title.toLowerCase().includes(lawSearch.toLowerCase()) ||
      law.code.toLowerCase().includes(lawSearch.toLowerCase()) ||
      law.description.toLowerCase().includes(lawSearch.toLowerCase());
    const matchesCategory =
      lawCategoryFilter === "all" || law.category === lawCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleNextStep = () => {
    if (step === 1 && !selectedEstablishment) {
      toast.error("Please select an establishment to continue");
      return;
    }
    if (step === 2 && selectedLaws.length === 0) {
      toast.error("Please select at least one applicable law to continue");
      return;
    }
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleLawToggle = (lawId: string) => {
    setSelectedLaws((prev) =>
      prev.includes(lawId)
        ? prev.filter((id) => id !== lawId)
        : [...prev, lawId]
    );
  };

  const handleCreateInspection = () => {
    if (!selectedEstablishment || selectedLaws.length === 0) {
      toast.error("Please complete all steps before creating the inspection");
      return;
    }

    toast.success(
      `Inspection successfully created for ${selectedEstablishment.name}`
    );
    navigate("/division-chief");
  };

  const handleAddNewEstablishment = () => {
    if (!newEstablishment.name || !newEstablishment.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newEst: Establishment = {
      ...newEstablishment,
      id: `EST-${Date.now()}`,
      type: newEstablishment.type || "manufacturing",
    } as Establishment;

    setEstablishments([...establishments, newEst]);
    setSelectedEstablishment(newEst);
    setShowNewEstablishmentForm(false);
    toast.success("New establishment added successfully");
  };

  const getEstablishmentTypeBadge = (type: string) => {
    const variantMap: Record<string, string> = {
      manufacturing: "default",
      chemical: "destructive",
      mining: "secondary",
      power: "outline",
      waste: "secondary",
      pharmaceutical: "default",
    };

    const labelMap: Record<string, string> = {
      manufacturing: "Manufacturing",
      chemical: "Chemical",
      mining: "Mining",
      power: "Power",
      waste: "Waste",
      pharmaceutical: "Pharmaceutical",
    };

    return <Badge variant={variantMap[type]}>{labelMap[type]}</Badge>;
  };

  const getLawCategoryBadge = (category: string) => {
    const variantMap: Record<string, string> = {
      environmental: "default",
      safety: "secondary",
      waste: "outline",
      emissions: "destructive",
      toxic: "destructive",
    };

    const labelMap: Record<string, string> = {
      environmental: "Environmental",
      safety: "Safety",
      waste: "Waste",
      emissions: "Emissions",
      toxic: "Toxic",
    };

    return <Badge variant={variantMap[category]}>{labelMap[category]}</Badge>;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/division-chief")}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Create New Inspection</h1>
          <div className="flex items-center mt-2">
            <Badge variant="outline">Step {step} of 3</Badge>
            <p className="text-sm text-muted-foreground ml-3">
              {step === 1 && "Select or add the establishment to inspect"}
              {step === 2 && "Choose applicable laws for the inspection"}
              {step === 3 && "Review and confirm inspection details"}
            </p>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Establishment Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  Select Establishment
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose an existing establishment or add a new one
                </p>
              </div>

              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search establishments..."
                    className="pl-8"
                    value={establishmentSearch}
                    onChange={(e) => setEstablishmentSearch(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    setShowNewEstablishmentForm(!showNewEstablishmentForm)
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {showNewEstablishmentForm ? "Cancel" : "Add New"}
                </Button>
              </div>

              {showNewEstablishmentForm ? (
                <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
                  <h3 className="font-medium">Add New Establishment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Name *</Label>
                      <Input
                        value={newEstablishment.name || ""}
                        onChange={(e) =>
                          setNewEstablishment({
                            ...newEstablishment,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={newEstablishment.type || "manufacturing"}
                        onValueChange={(value) =>
                          setNewEstablishment({
                            ...newEstablishment,
                            type: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manufacturing">
                            Manufacturing
                          </SelectItem>
                          <SelectItem value="chemical">Chemical</SelectItem>
                          <SelectItem value="mining">Mining</SelectItem>
                          <SelectItem value="power">Power</SelectItem>
                          <SelectItem value="waste">Waste</SelectItem>
                          <SelectItem value="pharmaceutical">
                            Pharmaceutical
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Address *</Label>
                      <Input
                        value={newEstablishment.address || ""}
                        onChange={(e) =>
                          setNewEstablishment({
                            ...newEstablishment,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Contact Person</Label>
                      <Input
                        value={newEstablishment.contactPerson || ""}
                        onChange={(e) =>
                          setNewEstablishment({
                            ...newEstablishment,
                            contactPerson: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={newEstablishment.phone || ""}
                        onChange={(e) =>
                          setNewEstablishment({
                            ...newEstablishment,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Email</Label>
                      <Input
                        value={newEstablishment.email || ""}
                        onChange={(e) =>
                          setNewEstablishment({
                            ...newEstablishment,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowNewEstablishmentForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddNewEstablishment}>
                      Add Establishment
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <div className="max-h-[400px] overflow-y-auto p-2 space-y-2">
                    {filteredEstablishments.length > 0 ? (
                      filteredEstablishments.map((establishment) => (
                        <div
                          key={establishment.id}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedEstablishment?.id === establishment.id
                              ? "bg-blue-50 border-blue-200 ring-2 ring-blue-100"
                              : "hover:bg-gray-50 hover:border-gray-300"
                          }`}
                          onClick={() =>
                            setSelectedEstablishment(establishment)
                          }
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <h4 className="font-medium text-lg">
                                {establishment.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {establishment.address}
                              </p>
                              <div className="flex items-center space-x-2">
                                {getEstablishmentTypeBadge(establishment.type)}
                                <span className="text-xs text-muted-foreground">
                                  Contact: {establishment.contactPerson}
                                </span>
                              </div>
                            </div>
                            {selectedEstablishment?.id === establishment.id && (
                              <CheckCircle className="w-6 h-6 text-blue-600" />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        No establishments found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Laws Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold flex items-center">
                  <Scale className="w-4 h-4 mr-2" />
                  Select Applicable Laws
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose all laws that apply to this inspection (
                  {selectedLaws.length} selected)
                </p>
              </div>

              <div className="space-y-3">
                {filteredLaws.map((law) => (
                  <div
                    key={law.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedLaws.includes(law.id)
                        ? "bg-green-50 border-green-200 ring-2 ring-green-100"
                        : "hover:bg-gray-50 hover:border-gray-300"
                    }`}
                    onClick={() => handleLawToggle(law.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={law.id}
                        checked={selectedLaws.includes(law.id)}
                        onCheckedChange={() => handleLawToggle(law.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-lg">
                            {law.code}
                          </span>
                          {getLawCategoryBadge(law.category)}
                        </div>
                        <h4 className="font-medium">{law.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {law.description}
                        </p>
                      </div>
                      {selectedLaws.includes(law.id) && (
                        <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Review Inspection Details
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Please review the details before creating the inspection
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Establishment Summary */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Selected Establishment
                  </h4>
                  {selectedEstablishment && (
                    <div className="space-y-1">
                      <p className="font-medium">
                        {selectedEstablishment.name}
                      </p>
                      <p className="text-sm text-blue-700">
                        {selectedEstablishment.address}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        {getEstablishmentTypeBadge(selectedEstablishment.type)}
                        <span className="text-xs text-blue-600">
                          Contact: {selectedEstablishment.contactPerson}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Laws Summary */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-3">
                    Applicable Laws ({selectedLaws.length} selected)
                  </h4>
                  <div className="space-y-2">
                    {selectedLaws.map((lawId) => {
                      const law = mockLaws.find((l) => l.id === lawId);
                      return law ? (
                        <div
                          key={lawId}
                          className="flex items-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="font-medium">{law.code}</span>
                          <span className="text-sm text-green-700">
                            - {law.title}
                          </span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>

              {/* Warning Notice */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-900">
                      Important Notice
                    </h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Once created, this inspection will be scheduled and
                      assigned to the appropriate team. Make sure all details
                      are correct before proceeding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t flex justify-between">
          <div className="flex space-x-2">
            {step > 1 && (
              <Button variant="outline" onClick={handlePreviousStep}>
                Previous
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => navigate("/division-chief")}
            >
              Cancel
            </Button>
          </div>

          <div className="flex space-x-2">
            {step < 3 ? (
              <Button
                onClick={handleNextStep}
                disabled={step === 1 && !selectedEstablishment}
              >
                Next
              </Button>
            ) : (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleCreateInspection}
              >
                Create Inspection
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
