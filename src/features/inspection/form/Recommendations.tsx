import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
];

export default function Recommendations() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [otherChecked, setOtherChecked] = useState(false);
  const [otherText, setOtherText] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const handleCheckboxChange = (item: string) => (checked: boolean) => {
    if (item === "Other Recommendations") {
      setOtherChecked(checked);
      if (!checked) setOtherText("");
    }
    setCheckedItems((prev) => ({ ...prev, [item]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
  };

  return (
    <div className="space-y-6  pb-10">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Recommendations</h2>
        <Separator className="my-2" />
      </div>

      <div className="px-4 space-y-6">
        <div className="space-y-4">
          {recommendations.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox
                id={item}
                checked={checkedItems[item] || false}
                onCheckedChange={handleCheckboxChange(item)}
              />
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
            />
          </div>
        )}

        <Separator className="my-6" />

        <div className="grid grid-cols-2 gap-4">
          {/* Column 1 - Attestation */}
          <div>
            <p className="font-medium">
              Findings and Recommendations Attested by:
              <span className="text-bold"> PCO/Manager</span>
            </p>
          </div>

          {/* Column 2 - File Attachment */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              (Referred to attached: Monitoring Slip)
              <br />
              EMED-MONITORING_F001
            </Label>
            {attachedFile ? (
              <div className="flex items-center gap-2">
                <span className="text-sm">{attachedFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  onChange={handleFileChange}
                  className="w-auto"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
