import { getCurrentDbUser } from "@/lib/auth/getCurrentUser";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Mail, User, Calendar, UserCircle } from "lucide-react";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { DeleteAccountDialog } from "@/components/profile/DeleteAccountDialog";

export default async function ProfilePage() {
  const user = await getCurrentDbUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get user initials for avatar fallback
  const initials = [user.firstName, user.lastName]
    .filter(Boolean)
    .map((name) => name![0])
    .join("")
    .toUpperCase() || user.email[0].toUpperCase();

  // Format dates
  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const lastUpdated = new Date(user.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <div className="flex gap-2">
          <EditProfileDialog
            user={{
              firstName: user.firstName,
              lastName: user.lastName,
              username: user.username,
            }}
          />
          <DeleteAccountDialog />
        </div>
      </div>

      <div className="grid gap-6">
        {/* Profile Header Card */}
        <Card className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <Avatar className="h-32 w-32">
              <AvatarImage src={user.imageUrl || undefined} alt={user.username || user.email} />
              <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username || "User"}
                </h2>
                {user.username && (
                  <p className="text-muted-foreground">@{user.username}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {/* Email */}
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>

                {/* Member Since */}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Member since {joinedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Account Details Card */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            Account Details
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">First Name</label>
              <p className="text-base mt-1">{user.firstName || "Not provided"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Name</label>
              <p className="text-base mt-1">{user.lastName || "Not provided"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Username</label>
              <p className="text-base mt-1">{user.username || "Not set"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Email Address</label>
              <p className="text-base mt-1">{user.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Account Created</label>
              <p className="text-base mt-1">{joinedDate}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <p className="text-base mt-1">{lastUpdated}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">User ID</label>
              <p className="text-base mt-1 font-mono text-xs break-all">{user.id}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
