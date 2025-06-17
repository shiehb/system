import { ProfileInfo } from "@/features/profile/Profile";

export default function ProfilePage() {
  return (
    <div className="flex flex-1">
      <div className="container mx-auto px-4 py-6 md:px-10 lg:px-25">
        <ProfileInfo />
      </div>
    </div>
  );
}
