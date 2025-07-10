import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileHeader } from "./components/ProfileHeader"
import { PersonalInformation } from "./components/PersonalInformation"
import { SecuritySettings } from "./components/SecuritySettings"
import { NotificationSettings } from "./components/NotificationSettings"
import { PrivacySettings } from "./components/PrivacySettings"
import { ActivityHistory } from "./components/ActivityHistory"
import { SocialIntegration } from "./components/SocialIntegration"
import { DocumentManager } from "./components/DocumentManager"
import { useProfile } from "@/hooks/useProfile"
import { LoadingWave } from "@/components/ui/loading-wave"
import { toast } from "sonner"

export function ProfileManagement() {
  const { profileData, isLoading, isUpdating, handleProfileUpdate, handleLogout } = useProfile()

  const handlePersonalInfoUpdate = async (data: any) => {
    try {
      await handleProfileUpdate(data)
      toast.success("Personal information updated successfully")
    } catch (error) {
      toast.error("Failed to update personal information")
      throw error
    }
  }

  const handleSecurityUpdate = async (settings: any) => {
    // Handle security settings update
    console.log("Security settings:", settings)
    toast.success("Security settings updated")
  }

  const handleNotificationUpdate = async (settings: any) => {
    // Handle notification settings update
    console.log("Notification settings:", settings)
    toast.success("Notification preferences updated")
  }

  const handlePrivacyUpdate = async (settings: any) => {
    // Handle privacy settings update
    console.log("Privacy settings:", settings)
    toast.success("Privacy settings updated")
  }

  const handleDataExport = async () => {
    // Handle data export
    console.log("Exporting user data...")
    toast.success("Data export initiated")
  }

  const handleAccountDelete = async () => {
    // Handle account deletion
    console.log("Account deletion requested...")
    toast.success("Account deletion request submitted")
  }

  const handleActivityExport = async (filters: any) => {
    // Handle activity export
    console.log("Exporting activity data:", filters)
    toast.success("Activity data exported")
  }

  const handleSocialConnect = async (platform: string, credentials: any) => {
    // Handle social media connection
    console.log("Connecting to", platform, credentials)
    toast.success(`Connected to ${platform}`)
  }

  const handleSocialDisconnect = async (platform: string) => {
    // Handle social media disconnection
    console.log("Disconnecting from", platform)
    toast.success(`Disconnected from ${platform}`)
  }

  const handleSharingUpdate = async (settings: any) => {
    // Handle sharing settings update
    console.log("Sharing settings:", settings)
    toast.success("Sharing preferences updated")
  }

  const handleDocumentUpload = async (files: FileList, category: string) => {
    // Handle document upload
    console.log("Uploading documents:", files, "Category:", category)
    toast.success("Documents uploaded successfully")
  }

  const handleDocumentDelete = async (documentId: string) => {
    // Handle document deletion
    console.log("Deleting document:", documentId)
    toast.success("Document deleted")
  }

  const handleDocumentDownload = async (document: any) => {
    // Handle document download
    console.log("Downloading document:", document)
    toast.success("Download started")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingWave message="Loading profile..." />
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center py-20">
        <p>Failed to load profile data</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Profile Header */}
      <ProfileHeader
        profile={profileData}
        isUpdating={isUpdating}
        onAvatarUpdate={async (file) => await handleProfileUpdate({ avatar: file })}
      />

      {/* Profile Management Tabs */}
      <div className="mt-8">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="personal" className="space-y-6">
              <PersonalInformation profile={profileData} onUpdate={handlePersonalInfoUpdate} isUpdating={isUpdating} />
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <SecuritySettings profile={profileData} onSecurityUpdate={handleSecurityUpdate} />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <NotificationSettings onNotificationUpdate={handleNotificationUpdate} />
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <PrivacySettings
                onPrivacyUpdate={handlePrivacyUpdate}
                onDataExport={handleDataExport}
                onAccountDelete={handleAccountDelete}
              />
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <ActivityHistory onExportActivity={handleActivityExport} />
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <SocialIntegration
                onSocialConnect={handleSocialConnect}
                onSocialDisconnect={handleSocialDisconnect}
                onSharingUpdate={handleSharingUpdate}
              />
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <DocumentManager
                onUpload={handleDocumentUpload}
                onDelete={handleDocumentDelete}
                onDownload={handleDocumentDownload}
              />
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <div className="text-center py-8 text-gray-500">
                <p>Additional preferences and settings coming soon...</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
