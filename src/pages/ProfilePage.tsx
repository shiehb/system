import { ProfileInfo } from "@/features/profile/ProfileInfo";
import { useProfile } from "@/hooks/useProfile";

export default function ProfilePage() {
  const {
    profileData,
    isLoading,
    isUpdating,
    handleProfileUpdate,
    handleLogout,
  } = useProfile();

  return (
    <div className="flex flex-1">
      <div className="container mx-auto px-4 py-6 md:px-10 lg:px-25">
        <ProfileInfo
          profileData={profileData}
          isLoading={isLoading}
          isUpdating={isUpdating}
          onUpdate={handleProfileUpdate}
          onLogout={handleLogout}
        />
      </div>
    </div>
  );
}
