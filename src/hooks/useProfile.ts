import { useState, useEffect, useCallback } from "react";
import { getMyProfile, updateProfile, updateAvatar } from "@/lib/api";
import { useAuth } from "@/contexts/useAuth";
import { toast } from "sonner";

export const useProfile = () => {
  const { logout } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getMyProfile();
      setProfileData(data);
    } catch (error) {
      toast.error("Failed to load profile", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleProfileUpdate = async (values: {
    current_password?: string;
    new_password?: string;
    avatar?: File;
  }) => {
    setIsUpdating(true);
    try {
      if (values.avatar) {
        const avatarData = await updateAvatar(values.avatar);
        setProfileData((prev: any) => ({
          ...prev,
          avatar_url: avatarData.avatar_url,
        }));
        toast.success("Avatar updated successfully");
      }

      if (values.current_password || values.new_password) {
        await updateProfile({
          current_password: values.current_password,
          new_password: values.new_password,
        });
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update profile", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      window.location.href = "/login";
    } catch (error) {
      toast.error("Failed to logout", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return {
    profileData,
    isLoading,
    isUpdating,
    handleProfileUpdate,
    handleLogout,
    refetchProfile: fetchProfile,
  };
};

export default useProfile;
