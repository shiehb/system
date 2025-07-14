import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

interface ProfileDetailsProps {
  profile: {
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    email?: string;
    user_level?: string;
  };
}

export const ProfileDetails = ({ profile }: ProfileDetailsProps) => {
  return (
    <Card className="mt-6 rounded-lg shadow-sm">
      <CardHeader>
        <CardDescription className="text-lg font-bold text-foreground">
          <div>
            <span className="text-muted-foreground">Name: </span>
            {profile.last_name}, {profile.first_name} {profile.middle_name}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {profile.email && (
          <div>
            <span className="p-2 text-base font-medium text-right">Email:</span>
            <span>{profile.email}</span>
          </div>
        )}

        {profile.user_level && (
          <div>
            <span className="p-2 text-base font-medium text-right">
              User Level:
            </span>
            <span>{profile.user_level}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
