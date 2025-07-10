import banner1 from "@/assets/banner1.png"
import { AvatarEditor } from "./AvatarEditor"
import { Badge } from "@/components/ui/badge"
import { Calendar, Mail, Phone, Shield } from "lucide-react"

interface ProfileHeaderProps {
  profile: any
  isUpdating: boolean
  onAvatarUpdate: (file: File) => Promise<void>
}

export const ProfileHeader = ({ profile, isUpdating, onAvatarUpdate }: ProfileHeaderProps) => {
  const initials = `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`

  return (
    <div className="w-full mx-auto">
      {/* Cover Photo Section */}
      <div className="relative md:h-50 lg:h-80 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg overflow-hidden shadow-md">
        <img src={banner1 || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Profile Header Section */}
      <div className="relative px-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <AvatarEditor
              avatarUrl={profile?.avatar_url}
              initials={initials}
              isUpdating={isUpdating}
              onSave={onAvatarUpdate}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">
                  {profile.first_name} {profile.last_name}
                </h1>
                {profile.using_default_password && (
                  <Badge variant="destructive" className="text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Default Password
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {profile.phone}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(profile.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {profile.user_level?.replace(/_/g, " ").toUpperCase()}
                </Badge>
                <Badge variant={profile.status === "active" ? "default" : "secondary"} className="text-xs">
                  {profile.status?.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
