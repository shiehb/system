"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Shield, Eye, Download, Trash2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
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
} from "@/components/ui/alert-dialog"

interface PrivacySettingsProps {
  onPrivacyUpdate: (settings: any) => Promise<void>
  onDataExport: () => Promise<void>
  onAccountDelete: () => Promise<void>
}

export const PrivacySettings = ({ onPrivacyUpdate, onDataExport, onAccountDelete }: PrivacySettingsProps) => {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "team",
    activityVisibility: "private",
    dataSharing: false,
    analyticsTracking: true,
    marketingEmails: false,
    thirdPartyIntegrations: true,
    locationTracking: false,
    cookiePreferences: "essential",
  })

  const handlePrivacyToggle = async (setting: string, value: boolean | string) => {
    try {
      const newSettings = { ...privacySettings, [setting]: value }
      setPrivacySettings(newSettings)
      await onPrivacyUpdate(newSettings)
      toast.success("Privacy settings updated")
    } catch (error) {
      toast.error("Failed to update privacy settings")
    }
  }

  const handleDataExport = async () => {
    try {
      await onDataExport()
      toast.success("Data export initiated. You'll receive an email when ready.")
    } catch (error) {
      toast.error("Failed to initiate data export")
    }
  }

  const handleAccountDelete = async () => {
    try {
      await onAccountDelete()
      toast.success("Account deletion request submitted")
    } catch (error) {
      toast.error("Failed to process account deletion request")
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Profile Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Profile Visibility</Label>
            <Select
              value={privacySettings.profileVisibility}
              onValueChange={(value) => handlePrivacyToggle("profileVisibility", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Visible to everyone</SelectItem>
                <SelectItem value="team">Team - Visible to team members only</SelectItem>
                <SelectItem value="private">Private - Only visible to you</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Activity Visibility</Label>
            <Select
              value={privacySettings.activityVisibility}
              onValueChange={(value) => handlePrivacyToggle("activityVisibility", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Activity visible to all</SelectItem>
                <SelectItem value="team">Team - Activity visible to team</SelectItem>
                <SelectItem value="private">Private - Activity hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data & Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Data & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Analytics Tracking</Label>
              <p className="text-xs text-gray-500">Help improve the platform with usage analytics</p>
            </div>
            <Switch
              checked={privacySettings.analyticsTracking}
              onCheckedChange={(checked) => handlePrivacyToggle("analyticsTracking", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Data Sharing</Label>
              <p className="text-xs text-gray-500">Share anonymized data for research purposes</p>
            </div>
            <Switch
              checked={privacySettings.dataSharing}
              onCheckedChange={(checked) => handlePrivacyToggle("dataSharing", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Location Tracking</Label>
              <p className="text-xs text-gray-500">Allow location-based features and services</p>
            </div>
            <Switch
              checked={privacySettings.locationTracking}
              onCheckedChange={(checked) => handlePrivacyToggle("locationTracking", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Communication Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Communication Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Marketing Emails</Label>
              <p className="text-xs text-gray-500">Receive promotional emails and updates</p>
            </div>
            <Switch
              checked={privacySettings.marketingEmails}
              onCheckedChange={(checked) => handlePrivacyToggle("marketingEmails", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Third-party Integrations</Label>
              <p className="text-xs text-gray-500">Allow connections with external services</p>
            </div>
            <Switch
              checked={privacySettings.thirdPartyIntegrations}
              onCheckedChange={(checked) => handlePrivacyToggle("thirdPartyIntegrations", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Cookie Preferences</Label>
            <Select
              value={privacySettings.cookiePreferences}
              onValueChange={(value) => handlePrivacyToggle("cookiePreferences", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cookies - Full functionality</SelectItem>
                <SelectItem value="functional">Functional - Essential + functional cookies</SelectItem>
                <SelectItem value="essential">Essential Only - Required cookies only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Export Your Data</Label>
              <p className="text-xs text-gray-500 mb-2">Download a copy of all your data</p>
              <Button variant="outline" size="sm" onClick={handleDataExport}>
                <Download className="w-4 h-4 mr-2" />
                Request Data Export
              </Button>
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium text-red-600">Delete Account</Label>
              <p className="text-xs text-gray-500 mb-2">Permanently delete your account and all data</p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      Delete Account
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove all your data
                      from our servers. Are you sure you want to continue?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleAccountDelete} className="bg-red-600 hover:bg-red-700">
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
