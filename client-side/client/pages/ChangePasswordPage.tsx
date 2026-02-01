import { useState } from "react";
import { useChangePasswordMutation } from "@/store/auth/authApiSlice";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountSettingsLayout } from "@/components/account/AccountSettingsLayout";
import { Loader2 } from "lucide-react";

export default function ChangePasswordPage() {
  const { toast } = useToast();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    new_password2: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.current_password) {
      newErrors.current_password = "Current password is required.";
    }

    if (!formData.new_password) {
      newErrors.new_password = "New password is required.";
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = "Password must be at least 8 characters long.";
    }

    if (!formData.new_password2) {
      newErrors.new_password2 = "Please confirm your new password.";
    } else if (formData.new_password !== formData.new_password2) {
      newErrors.new_password2 = "Passwords do not match.";
    }

    if (formData.current_password && formData.new_password === formData.current_password) {
      newErrors.new_password = "New password must be different from current password.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await changePassword(formData).unwrap();
      toast({
        title: "Password Changed",
        description: "Your password has been successfully changed.",
      });
      // Clear form
      setFormData({
        current_password: "",
        new_password: "",
        new_password2: "",
      });
    } catch (error: any) {
      const errorMessage = error?.data?.error || error?.data?.detail || "Failed to change password. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <AccountSettingsLayout>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">Change Password</CardTitle>
          <CardDescription className="text-muted-foreground">
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="current_password" className="text-foreground">
                Current Password
              </Label>
              <Input
                id="current_password"
                name="current_password"
                type="password"
                value={formData.current_password}
                onChange={handleChange}
                required
                className={errors.current_password ? "border-destructive" : "bg-input border-border text-foreground"}
              />
              {errors.current_password && (
                <p className="text-xs text-destructive">{errors.current_password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password" className="text-foreground">
                New Password
              </Label>
              <Input
                id="new_password"
                name="new_password"
                type="password"
                value={formData.new_password}
                onChange={handleChange}
                required
                className={errors.new_password ? "border-destructive" : "bg-input border-border text-foreground"}
              />
              {errors.new_password && (
                <p className="text-xs text-destructive">{errors.new_password}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password2" className="text-foreground">
                Confirm New Password
              </Label>
              <Input
                id="new_password2"
                name="new_password2"
                type="password"
                value={formData.new_password2}
                onChange={handleChange}
                required
                className={errors.new_password2 ? "border-destructive" : "bg-input border-border text-foreground"}
              />
              {errors.new_password2 && (
                <p className="text-xs text-destructive">{errors.new_password2}</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AccountSettingsLayout>
  );
}
