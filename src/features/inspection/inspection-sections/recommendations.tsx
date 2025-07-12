"use client"

import type React from "react"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, X, FileText } from "lucide-react"
import { toast } from "sonner"

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
