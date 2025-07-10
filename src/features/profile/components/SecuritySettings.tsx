"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Shield, Key, Smartphone, Eye, AlertTriangle, CheckCircle } from "lucide-react"
import { ChangePassword } from "@/features/password/edit_password"
import { toast } from "sonner"

interface SecuritySettingsProps {
  profile: any
  onSecurityUpdate: (settings: any) => Promise<void>
}

export const SecuritySettings = ({ profile, onSecurityUpdate }: SecuritySettingsProps) => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: true,
    passwordExpiry: false,
  })

  const handleSecurityToggle = async (setting: string, value: boolean) => {
    try {
      const newSettings = { ...securitySettings, [setting]: value }
      setSecuritySettings(newSettings)
      await onSecurityUpdate(newSettings)
      toast.success("Security settings updated")
    } catch (error) {
      toast.error("Failed to update security settings")
    }
  }

  return (
    <div className="space-y-6">
      {/* Password Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Password & Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Password Status</Label>
              <div className="flex items-center gap-2">
                {profile.using_default_password ? (
                  <>
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Default Password
                    </Badge>
                    <p className="text-xs text-gray-500">Please change your password for security</p>
                  </>
                ) : (
                  <>
                    <Badge variant="default" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Secure
                    </Badge>
                    <p className="text-xs text-gray-500">Last changed: {new Date().toLocaleDateString()}</p>
                  </>
                )}
              </div>
            </div>
            <ChangePassword>
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </ChangePassword>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Two-Factor Authentication</Label>
              <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={securitySettings.twoFactorEnabled}
                onCheckedChange={(checked) => handleSecurityToggle("twoFactorEnabled", checked)}
              />
              <Smartphone className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Login Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Login Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Login Notifications</Label>
              <p className="text-xs text-gray-500">Get notified when someone logs into your account</p>
            </div>
            <Switch
              checked={securitySettings.loginNotifications}
              onCheckedChange={(checked) => handleSecurityToggle("loginNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Automatic Session Timeout</Label>
              <p className="text-xs text-gray-500">Automatically log out after period of inactivity</p>
            </div>
            <Switch
              checked={securitySettings.sessionTimeout}
              onCheckedChange={(checked) => handleSecurityToggle("sessionTimeout", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Password Expiry Reminders</Label>
              <p className="text-xs text-gray-500">Get reminded to change your password regularly</p>
            </div>
            <Switch
              checked={securitySettings.passwordExpiry}
              onCheckedChange={(checked) => handleSecurityToggle("passwordExpiry", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Login from Chrome on Windows</p>
                <p className="text-xs text-gray-500">Today at 2:30 PM • IP: 192.168.1.1</p>
              </div>
              <Badge variant="default" className="text-xs">
                Current
              </Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Login from Mobile App</p>
                <p className="text-xs text-gray-500">Yesterday at 8:15 AM • IP: 192.168.1.2</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Password Changed</p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>

          <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
            View All Activity
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
