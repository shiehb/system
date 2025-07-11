"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Building,
  Scale,
  CheckCircle,
  FileText,
  Search,
  Plus,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import type {
  Establishment,
  Inspection,
  InspectionQueueItem,
} from "@/types/index";
import { mockEstablishments, inspectionLaws } from "@/data/mockData";
import { getEstablishmentTypeBadge } from "@/utils/badges";

import { WizardHeader } from "./wizard-header";
import { StepHeader } from "./step-header";
import { EstablishmentCard } from "./establishment-card";
import { LawCard } from "./law-card";
import { NavigationButtons } from "./navigation-buttons";
import { SelectedSummary } from "./selected-summary";

interface InspectionWizardProps {
  onClose: () => void;
  onCreateInspection: (inspection: Inspection) => void;
}

export function InspectionWizard({
  onClose,
  onCreateInspection,
}: InspectionWizardProps) {
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedEstablishment, setSelectedEstablishment] =
    useState<Establishment | null>(null);
  const [selectedLaws, setSelectedLaws] = useState<string[]>([]);
  const [establishmentSearch, setEstablishmentSearch] = useState("");
  const [inspectionList, setInspectionList] = useState<InspectionQueueItem[]>(
    []
  );

  const filteredEstablishments = mockEstablishments.filter(
    (establishment) =>
      establishment.name
        .toLowerCase()
        .includes(establishmentSearch.toLowerCase()) ||
      establishment.type
        .toLowerCase()
        .includes(establishmentSearch.toLowerCase())
  );

  const handleNextStep = () => {
    if (wizardStep === 1 && !selectedEstablishment) {
      toast.error("Please select an establishment to continue");
      return;
    }
    if (wizardStep === 2 && selectedLaws.length === 0) {
      toast.error("Please select at least one applicable law to continue");
      return;
    }
    setWizardStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setWizardStep((prev) => prev - 1);
  };

  const resetWizard = () => {
    setWizardStep(1);
    setSelectedEstablishment(null);
    setSelectedLaws([]);
    setEstablishmentSearch("");
    setInspectionList([]);
    onClose();
  };

  const handleLawToggle = (lawId: string) => {
    setSelectedLaws((prev) =>
      prev.includes(lawId)
        ? prev.filter((id) => id !== lawId)
        : [...prev, lawId]
    );
  };

  const handleCreateSingleInspection = () => {
    if (!selectedEstablishment || selectedLaws.length === 0) {
      toast.error("Please complete all steps before creating the inspection");
      return;
    }

    const newInspection: Inspection = {
      id: `INS-${Date.now()}`,
      establishmentId: selectedEstablishment.id,
      establishmentName: selectedEstablishment.name,
      applicableLaws: selectedLaws,
      createdBy: "Division Chief",
      createdDate: new Date().toISOString().split("T")[0],
      status: "scheduled",
    };

    onCreateInspection(newInspection);
    toast.success(
      `Inspection successfully created for ${selectedEstablishment.name}`
    );
    resetWizard();
  };

  const handleCreateAllInspections = () => {
    // Create current inspection
    handleCreateSingleInspection();

    // Create all queued inspections
    inspectionList.forEach((inspection) => {
      const newInspection: Inspection = {
        id: `INS-${Date.now()}-${Math.random()}`,
        establishmentId: inspection.establishment.id,
        establishmentName: inspection.establishment.name,
        applicableLaws: inspection.laws,
        createdBy: "Division Chief",
        createdDate: new Date().toISOString().split("T")[0],
        status: "scheduled",
      };
      onCreateInspection(newInspection);
    });

    toast.success(
      `Successfully created ${inspectionList.length + 1} inspections`
    );
    setInspectionList([]);
    resetWizard();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <WizardHeader
        currentStep={wizardStep}
        totalSteps={4}
        onBack={resetWizard}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step 1: Establishment Selection */}
        {wizardStep === 1 && (
          <div className="space-y-8">
            <StepHeader
              icon={Building}
              title="Select Establishment"
              description="Choose the establishment you want to inspect from our registered facilities"
            />

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search establishments by name or type..."
                    className="pl-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    value={establishmentSearch}
                    onChange={(e) => setEstablishmentSearch(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto">
                  {filteredEstablishments.map((establishment) => (
                    <EstablishmentCard
                      key={establishment.id}
                      establishment={establishment}
                      isSelected={
                        selectedEstablishment?.id === establishment.id
                      }
                      onClick={() => setSelectedEstablishment(establishment)}
                    />
                  ))}
                </div>

                {selectedEstablishment && (
                  <SelectedSummary
                    title="Selected Establishment"
                    icon={<CheckCircle className="w-5 h-5 text-blue-600" />}
                    bgColor="bg-blue-50"
                    borderColor="border-blue-200"
                    textColor="text-blue-900"
                  >
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900">
                        {selectedEstablishment.name}
                      </p>
                      <p className="text-sm text-blue-700">
                        {selectedEstablishment.address}
                      </p>
                      <div className="pt-2">
                        {getEstablishmentTypeBadge(selectedEstablishment.type)}
                      </div>
                    </div>
                  </SelectedSummary>
                )}
              </CardContent>
            </Card>

            <NavigationButtons
              onNext={handleNextStep}
              nextDisabled={!selectedEstablishment}
              showPrevious={false}
            />
          </div>
        )}

        {/* Step 2: Laws Selection */}
        {wizardStep === 2 && (
          <div className="space-y-8">
            <StepHeader
              icon={Scale}
              title="Select Applicable Laws"
              description={`Choose the laws that apply to this inspection (${selectedLaws.length} selected)`}
              iconColor="text-green-600"
            />

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
                <CardTitle className="text-xl text-gray-900">
                  Available Laws
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {inspectionLaws.map((law) => (
                    <LawCard
                      key={law.id}
                      law={law}
                      isSelected={selectedLaws.includes(law.id)}
                      onToggle={() => handleLawToggle(law.id)}
                    />
                  ))}
                </div>

                {selectedLaws.length > 0 && (
                  <div className="mt-8">
                    <SelectedSummary
                      title={`Selected Laws (${selectedLaws.length})`}
                      icon={<CheckCircle className="w-5 h-5 text-green-600" />}
                      bgColor="bg-green-50"
                      borderColor="border-green-200"
                      textColor="text-green-900"
                    >
                      <div className="flex flex-wrap gap-2">
                        {selectedLaws.map((lawId) => {
                          const law = inspectionLaws.find(
                            (l) => l.id === lawId
                          );
                          return law ? (
                            <Badge
                              key={lawId}
                              variant="secondary"
                              className="bg-green-100 text-green-800"
                            >
                              {law.code}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </SelectedSummary>
                  </div>
                )}
              </CardContent>
            </Card>

            <NavigationButtons
              onPrevious={handlePreviousStep}
              onNext={handleNextStep}
              nextDisabled={selectedLaws.length === 0}
            />
          </div>
        )}

        {/* Step 3: Review Current Inspection */}
        {wizardStep === 3 && (
          <div className="space-y-8">
            <StepHeader
              icon={CheckCircle}
              title="Review Inspection Details"
              description="Review current inspection and add more or proceed to create all inspections"
              iconColor="text-purple-600"
            />

            <Card className="shadow-lg border-2 border-blue-200 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-gray-900">
                    Current Inspection
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    New
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {selectedEstablishment && (
                    <SelectedSummary
                      title="Selected Establishment"
                      icon={<Building className="w-5 h-5 text-blue-600" />}
                      bgColor="bg-blue-50"
                      borderColor="border-blue-200"
                      textColor="text-blue-900"
                    >
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {selectedEstablishment.name}
                          </h3>
                          <p className="text-sm text-blue-700">
                            {selectedEstablishment.address}
                          </p>
                        </div>
                        <div>
                          {getEstablishmentTypeBadge(
                            selectedEstablishment.type
                          )}
                        </div>
                      </div>
                    </SelectedSummary>
                  )}

                  <SelectedSummary
                    title={`Applicable Laws (${selectedLaws.length})`}
                    icon={<Scale className="w-5 h-5 text-green-600" />}
                    bgColor="bg-green-50"
                    borderColor="border-green-200"
                    textColor="text-green-900"
                  >
                    <div className="space-y-2">
                      {selectedLaws.map((lawId) => {
                        const law = inspectionLaws.find((l) => l.id === lawId);
                        return law ? (
                          <div
                            key={lawId}
                            className="flex items-start space-x-2"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-sm">
                                {law.code}
                              </p>
                              <p className="text-xs text-green-700">
                                {law.title}
                              </p>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </SelectedSummary>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  if (selectedEstablishment) {
                    setInspectionList((prev) => [
                      ...prev,
                      {
                        establishment: selectedEstablishment,
                        laws: selectedLaws,
                      },
                    ]);
                    setSelectedEstablishment(null);
                    setSelectedLaws([]);
                    setWizardStep(1);
                    toast.success(
                      "Inspection added to queue. Add another inspection or proceed to create all."
                    );
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Inspection
              </Button>

              {inspectionList.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setWizardStep(4)}
                  className="bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Review All Inspections ({inspectionList.length + 1})
                </Button>
              )}
            </div>

            {/* Inspection Queue */}
            {inspectionList.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Inspections in Queue ({inspectionList.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {inspectionList.map((inspection, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {inspection.establishment.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {inspection.laws.length} laws selected
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {getEstablishmentTypeBadge(
                              inspection.establishment.type
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setInspectionList((prev) =>
                                  prev.filter((_, i) => i !== index)
                                );
                                toast.success("Inspection removed from queue");
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <NavigationButtons onPrevious={handlePreviousStep}>
              <Button
                variant="outline"
                onClick={resetWizard}
                className="border-gray-300 bg-transparent"
              >
                Cancel All
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create This Inspection
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Confirm Inspection Creation
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to create an inspection for{" "}
                      <strong>{selectedEstablishment?.name}</strong> with the
                      selected laws?
                      <br />
                      <br />
                      This will schedule the inspection and notify the relevant
                      inspection teams.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCreateSingleInspection}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Yes, Create Inspection
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </NavigationButtons>
          </div>
        )}

        {/* Step 4: Review All Inspections */}
        {wizardStep === 4 && (
          <div className="space-y-8">
            <StepHeader
              icon={FileText}
              title="Review All Inspections"
              description={`Review all ${
                inspectionList.length + 1
              } inspections before creating them`}
              iconColor="text-purple-600"
            />

            <div className="space-y-6">
              {/* Current inspection */}
              <Card className="shadow-lg border-2 border-blue-200 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Current Inspection
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {selectedEstablishment?.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedEstablishment?.address}
                      </p>
                      <div className="mt-3">
                        {selectedEstablishment &&
                          getEstablishmentTypeBadge(selectedEstablishment.type)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Laws ({selectedLaws.length})
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedLaws.map((lawId) => {
                          const law = inspectionLaws.find(
                            (l) => l.id === lawId
                          );
                          return law ? (
                            <Badge
                              key={lawId}
                              variant="secondary"
                              className="text-xs"
                            >
                              {law.code}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Queued inspections */}
              {inspectionList.map((inspection, index) => (
                <Card
                  key={index}
                  className="shadow-lg border-0 bg-white/80 backdrop-blur-sm"
                >
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Inspection #{index + 1}
                      </CardTitle>
                      <Badge variant="secondary">Queued</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {inspection.establishment.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {inspection.establishment.address}
                        </p>
                        <div className="mt-3">
                          {getEstablishmentTypeBadge(
                            inspection.establishment.type
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Laws ({inspection.laws.length})
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {inspection.laws.map((lawId) => {
                            const law = inspectionLaws.find(
                              (l) => l.id === lawId
                            );
                            return law ? (
                              <Badge
                                key={lawId}
                                variant="secondary"
                                className="text-xs"
                              >
                                {law.code}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-50 to-purple-100">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="font-semibold text-xl mb-3 text-gray-900">
                    Inspection Summary
                  </h3>
                  <p className="text-gray-700 text-lg">
                    You are about to create{" "}
                    <strong className="text-purple-600">
                      {inspectionList.length + 1}
                    </strong>{" "}
                    inspections across{" "}
                    <strong className="text-purple-600">
                      {
                        new Set([
                          selectedEstablishment?.type,
                          ...inspectionList.map((i) => i.establishment.type),
                        ]).size
                      }
                    </strong>{" "}
                    different establishment types.
                  </p>
                </div>
              </CardContent>
            </Card>

            <NavigationButtons onPrevious={() => setWizardStep(3)}>
              <Button
                variant="outline"
                onClick={() => setWizardStep(1)}
                className="border-gray-300"
              >
                Add More Inspections
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create All Inspections
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Confirm All Inspections Creation
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to create all{" "}
                      <strong>{inspectionList.length + 1}</strong> inspections?
                      <br />
                      <br />
                      This will schedule all inspections and notify the relevant
                      inspection teams. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCreateAllInspections}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Yes, Create All Inspections
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </NavigationButtons>
          </div>
        )}
      </div>
    </div>
  );
}
