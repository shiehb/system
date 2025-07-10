"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Bell, Mail, Smartphone, Monitor, Volume2 } from "lucide-react"
import { toast } from "sonner"

interface NotificationSettingsProps {
  onNotificationUpdate: (settings: any) => Promise<void>
}

export const NotificationSettings = ({ onNotificationUpdate }: NotificationSettingsProps) => {
  const [notifications, setNotifications] = useState({
    email: {
      permitApprovals: true,
      newApplications: true,
      inspectionSchedules: true,
      complianceIssues: true,
      systemUpdates: false,
      weeklyDigest: true,
    },
    push: {
      permitApprovals: false,
      newApplications: false,
      inspectionSchedules: true,
      complianceIssues: true,
      systemUpdates: false,
    },
    inApp: {
      permitApprovals: true,
      newApplications: true,
      inspectionSchedules: true,
      complianceIssues: true,
      systemUpdates: true,
      sounds: true,
    },
    frequency: "immediate",
    quietHours: {
      enabled: true,
      start: "22:00",
      end: "08:00",
    },
  })

  const handleNotificationToggle = async (category: string, setting: string, value: boolean) => {
    try {
      const newNotifications = {
        ...notifications,
        [category]: {
          ...notifications[category as keyof typeof notifications],
          [setting]: value,
        },
      }
      setNotifications(newNotifications)
      await onNotificationUpdate(newNotifications)
      toast.success("Notification settings updated")
    } catch (error) {
      toast.error("Failed to update notification settings")
    }
  }

  const handleFrequencyChange = async (frequency: string) => {
    try {
      const newNotifications = { ...notifications, frequency }
      setNotifications(newNotifications)
      await onNotificationUpdate(newNotifications)
      toast.success("Notification frequency updated")
    } catch (error) {
      toast.error("Failed to update notification frequency")
    }
  }

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Permit Approvals</Label>
              <p className="text-xs text-gray-500">Get notified when permits are approved or rejected</p>
            </div>
            <Switch
              checked={notifications.email.permitApprovals}
              onCheckedChange={(checked) => handleNotificationToggle("email", "permitApprovals", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">New Applications</Label>
              <p className="text-xs text-gray-500">Notifications for new permit applications</p>
            </div>
            <Switch
              checked={notifications.email.newApplications}
              onCheckedChange={(checked) => handleNotificationToggle("email", "newApplications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Inspection Schedules</Label>
              <p className="text-xs text-gray-500">Updates about upcoming inspections</p>
            </div>
            <Switch
              checked={notifications.email.inspectionSchedules}
              onCheckedChange={(checked) => handleNotificationToggle("email", "inspectionSchedules", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Compliance Issues</Label>
              <p className="text-xs text-gray-500">Alerts about compliance violations</p>
            </div>
            <Switch
              checked={notifications.email.complianceIssues}
              onCheckedChange={(checked) => handleNotificationToggle("email", "complianceIssues", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Weekly Digest</Label>
              <p className="text-xs text-gray-500">Weekly summary of your activities</p>
            </div>
            <Switch
              checked={notifications.email.weeklyDigest}
              onCheckedChange={(checked) => handleNotificationToggle("email", "weeklyDigest", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Inspection Schedules</Label>
              <p className="text-xs text-gray-500">Push alerts for upcoming inspections</p>
            </div>
            <Switch
              checked={notifications.push.inspectionSchedules}
              onCheckedChange={(checked) => handleNotificationToggle("push", "inspectionSchedules", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Compliance Issues</Label>
              <p className="text-xs text-gray-500">Urgent compliance alerts</p>
            </div>
            <Switch
              checked={notifications.push.complianceIssues}
              onCheckedChange={(checked) => handleNotificationToggle("push", "complianceIssues", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            In-App Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Sound Notifications</Label>
              <p className="text-xs text-gray-500">Play sound for in-app notifications</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={notifications.inApp.sounds}
                onCheckedChange={(checked) => handleNotificationToggle("inApp", "sounds", checked)}
              />
              <Volume2 className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">System Updates</Label>
              <p className="text-xs text-gray-500">Notifications about system maintenance</p>
            </div>
            <Switch
              checked={notifications.inApp.systemUpdates}
              onCheckedChange={(checked) => handleNotificationToggle("inApp", "systemUpdates", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Notification Frequency</Label>
            <Select value={notifications.frequency} onValueChange={handleFrequencyChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="hourly">Hourly Digest</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Digest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Quiet Hours</Label>
              <Switch
                checked={notifications.quietHours.enabled}
                onCheckedChange={(checked) => handleNotificationToggle("quietHours", "enabled", checked)}
              />
            </div>

            {notifications.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4 pl-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">Start Time</Label>
                  <Select value={notifications.quietHours.start}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20:00">8:00 PM</SelectItem>
                      <SelectItem value="21:00">9:00 PM</SelectItem>
                      <SelectItem value="22:00">10:00 PM</SelectItem>
                      <SelectItem value="23:00">11:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">End Time</Label>
                  <Select value={notifications.quietHours.end}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="06:00">6:00 AM</SelectItem>
                      <SelectItem value="07:00">7:00 AM</SelectItem>
                      <SelectItem value="08:00">8:00 AM</SelectItem>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
