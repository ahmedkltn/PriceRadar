import { useEffect, useState } from "react";
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from "@/store/auth/authApiSlice";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountSettingsLayout } from "@/components/account/AccountSettingsLayout";
import { Loader2 } from "lucide-react";

export default function UserProfilePage() {
  const { toast } = useToast();
  const { data: profile, isLoading } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email || "",
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData).unwrap();
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.detail || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <AccountSettingsLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AccountSettingsLayout>
    );
  }

  return (
    <AccountSettingsLayout>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">User Profile</CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your account information and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Username
              </Label>
              <Input
                id="username"
                value={profile?.username || ""}
                disabled
                className="bg-muted text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">
                Username cannot be changed.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-foreground">
                  First Name
                </Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-foreground">
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="submit"
                disabled={isUpdating}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AccountSettingsLayout>
  );
}
