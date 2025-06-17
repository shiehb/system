import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

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

export function Recommendations() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [otherChecked, setOtherChecked] = useState(false);
  const [otherText, setOtherText] = useState("");

  const handleCheckboxChange = (item: string) => (checked: boolean) => {
    if (item === "Other Recommendations") {
      setOtherChecked(checked);
      if (!checked) setOtherText("");
    }
    setCheckedItems((prev) => ({ ...prev, [item]: checked }));
  };

  return (
    <div className="space-y-6">
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

        <div className="space-y-2">
          <p className="font-medium">
            Findings and Recommendations Attested by:
          </p>
          <p>PCO/Manager</p>
          <p className="text-sm text-muted-foreground">
            (Referred to attached: Monitoring Slip)
          </p>
        </div>
      </div>
    </div>
  );
}
