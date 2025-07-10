"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Link, Unlink, Share2, Facebook, Twitter, Linkedin, Github } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface SocialAccount {
  platform: string
  username: string
  connected: boolean
  lastSync: string
  icon: React.ReactNode
  color: string
}

interface SocialIntegrationProps {
  onSocialConnect: (platform: string, credentials: any) => Promise<void>
  onSocialDisconnect: (platform: string) => Promise<void>
  onSharingUpdate: (settings: any) => Promise<void>
}

export const SocialIntegration = ({ onSocialConnect, onSocialDisconnect, onSharingUpdate }: SocialIntegrationProps) => {
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    {
      platform: "LinkedIn",
      username: "",
      connected: false,
      lastSync: "",
      icon: <Linkedin className="w-4 h-4" />,
      color: "bg-blue-600",
    },
    {
      platform: "Twitter",
      username: "",
      connected: false,
      lastSync: "",
      icon: <Twitter className="w-4 h-4" />,
      color: "bg-sky-500",
    },
    {
      platform: "Facebook",
      username: "",
      connected: false,
      lastSync: "",
      icon: <Facebook className="w-4 h-4" />,
      color: "bg-blue-700",
    },
    {
      platform: "GitHub",
      username: "",
      connected: false,
      lastSync: "",
      icon: <Github className="w-4 h-4" />,
      color: "bg-gray-800",
    },
  ])

  const [sharingSettings, setSharingSettings] = useState({
    shareProfileUpdates: false,
    shareInspectionReports: false,
    shareAchievements: true,
    autoPost: false,
  })

  const [connectDialog, setConnectDialog] = useState<{
    open: boolean
    platform: string
    credentials: { username: string; password: string }
  }>({
    open: false,
    platform: "",
    credentials: { username: "", password: "" },
  })

  const handleConnect = async (platform: string) => {
    setConnectDialog({
      open: true,
      platform,
      credentials: { username: "", password: "" },
    })
  }

  const handleConfirmConnect = async () => {
    try {
      await onSocialConnect(connectDialog.platform, connectDialog.credentials)

      setSocialAccounts((prev) =>
        prev.map((account) =>
          account.platform === connectDialog.platform
            ? {
                ...account,
                connected: true,
                username: connectDialog.credentials.username,
                lastSync: new Date().toISOString(),
              }
            : account,
        ),
      )

      setConnectDialog({ open: false, platform: "", credentials: { username: "", password: "" } })
      toast.success(`Connected to ${connectDialog.platform} successfully`)
    } catch (error) {
      toast.error(`Failed to connect to ${connectDialog.platform}`)
    }
  }

  const handleDisconnect = async (platform: string) => {
    try {
      await onSocialDisconnect(platform)

      setSocialAccounts((prev) =>
        prev.map((account) =>
          account.platform === platform ? { ...account, connected: false, username: "", lastSync: "" } : account,
        ),
      )

      toast.success(`Disconnected from ${platform}`)
    } catch (error) {
      toast.error(`Failed to disconnect from ${platform}`)
    }
  }

  const handleSharingToggle = async (setting: string, value: boolean) => {
    try {
      const newSettings = { ...sharingSettings, [setting]: value }
      setSharingSettings(newSettings)
      await onSharingUpdate(newSettings)
      toast.success("Sharing preferences updated")
    } catch (error) {
      toast.error("Failed to update sharing preferences")
    }
  }

  return (
    <div className="space-y-6">
      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Connected Accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {socialAccounts.map((account) => (
            <div key={account.platform} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full text-white ${account.color}`}>{account.icon}</div>
                <div>
                  <h4 className="text-sm font-medium">{account.platform}</h4>
                  {account.connected ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="text-xs">
                        Connected
                      </Badge>
                      <span className="text-xs text-gray-500">@{account.username}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">Not connected</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {account.connected ? (
                  <>
                    <span className="text-xs text-gray-500">
                      Last sync: {new Date(account.lastSync).toLocaleDateString()}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => handleDisconnect(account.platform)}>
                      <Unlink className="w-4 h-4 mr-2" />
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => handleConnect(account.platform)}>
                    <Link className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sharing Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Sharing Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Share Profile Updates</Label>
              <p className="text-xs text-gray-500">Automatically share profile changes to connected accounts</p>
            </div>
            <Switch
              checked={sharingSettings.shareProfileUpdates}
              onCheckedChange={(checked) => handleSharingToggle("shareProfileUpdates", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Share Inspection Reports</Label>
              <p className="text-xs text-gray-500">Share completed inspection reports (public only)</p>
            </div>
            <Switch
              checked={sharingSettings.shareInspectionReports}
              onCheckedChange={(checked) => handleSharingToggle("shareInspectionReports", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Share Achievements</Label>
              <p className="text-xs text-gray-500">Share professional achievements and certifications</p>
            </div>
            <Switch
              checked={sharingSettings.shareAchievements}
              onCheckedChange={(checked) => handleSharingToggle("shareAchievements", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Auto-Post Updates</Label>
              <p className="text-xs text-gray-500">Automatically post updates without confirmation</p>
            </div>
            <Switch
              checked={sharingSettings.autoPost}
              onCheckedChange={(checked) => handleSharingToggle("autoPost", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Connect Account Dialog */}
      <Dialog open={connectDialog.open} onOpenChange={(open) => setConnectDialog((prev) => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to {connectDialog.platform}</DialogTitle>
            <DialogDescription>
              Enter your {connectDialog.platform} credentials to connect your account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username/Email</Label>
              <Input
                id="username"
                value={connectDialog.credentials.username}
                onChange={(e) =>
                  setConnectDialog((prev) => ({
                    ...prev,
                    credentials: { ...prev.credentials, username: e.target.value },
                  }))
                }
                placeholder="Enter your username or email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={connectDialog.credentials.password}
                onChange={(e) =>
                  setConnectDialog((prev) => ({
                    ...prev,
                    credentials: { ...prev.credentials, password: e.target.value },
                  }))
                }
                placeholder="Enter your password"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setConnectDialog({ open: false, platform: "", credentials: { username: "", password: "" } })
              }
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmConnect}>Connect Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
