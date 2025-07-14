import banner1 from "@/assets/banner1.png";
import { LoadingWave } from "@/components/ui/loading-wave";
import { AvatarEditor } from "./components/AvatarEditor";
import { ProfileDetails } from "./components/ProfileDetails";

interface ProfileInfoProps {
  profileData: any;
  isLoading: boolean;
  isUpdating: boolean;
  onUpdate: (values: {
    current_password?: string;
    new_password?: string;
    avatar?: File;
  }) => Promise<void>;
  onLogout: () => Promise<void>;
}

export function ProfileInfo({
  profileData: profile,
  isLoading,
  isUpdating,
  onUpdate,
}: ProfileInfoProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingWave message="Loading profile..." />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center py-20">
        <p>Failed to load profile data</p>
      </div>
    );
  }

  const initials = `${profile.first_name?.[0] || ""}${
    profile.last_name?.[0] || ""
  }`;

  return (
    <div className="w-full mx-auto">
      {/* Cover Photo Section */}
      <div className="relative md:h-50 lg:h-80 bg-gradient-to-r from--500 to-light-600 rounded-t-lg overflow-hidden shadow-md">
        <img src={banner1} alt="Cover" className="w-full h-full object-cover" />
      </div>

      {/* Profile Header Section */}
      <div className="relative px-4">
        <div className="flex justify-between items-start">
          <AvatarEditor
            avatarUrl={profile?.avatar_url}
            initials={initials}
            isUpdating={isUpdating}
            onSave={async (file) => await onUpdate({ avatar: file })}
          />
        </div>

        <ProfileDetails profile={profile} />
      </div>
    </div>
  );
}
