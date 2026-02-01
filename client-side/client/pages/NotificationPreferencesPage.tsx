import { useEffect, useState } from "react";
import { useGetPreferencesQuery, useUpdatePreferencesMutation } from "@/store/notifications/notificationApiSlice";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AccountSettingsLayout } from "@/components/account/AccountSettingsLayout";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotificationPreferencesPage() {
  const { toast } = useToast();
  const { data: preferences, isLoading, refetch } = useGetPreferencesQuery();
  const [updatePreferences, { isLoading: isUpdating }] = useUpdatePreferencesMutation();

  const [inAppEnabled, setInAppEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [priceDropThreshold, setPriceDropThreshold] = useState<string>("");

  useEffect(() => {
    if (preferences) {
      setInAppEnabled(preferences.in_app_enabled);
      setEmailEnabled(preferences.email_enabled);
      setPriceDropThreshold(
        preferences.price_drop_threshold?.toString() || ""
      );
    }
  }, [preferences]);

  const handleSave = async () => {
    try {
      const threshold = priceDropThreshold
        ? parseFloat(priceDropThreshold)
        : null;

      if (threshold !== null && (threshold < 0 || threshold > 100)) {
        toast({
          title: "Invalid Threshold",
          description: "Price drop threshold must be between 0 and 100.",
          variant: "destructive",
        });
        return;
      }

      await updatePreferences({
        in_app_enabled: inAppEnabled,
        email_enabled: emailEnabled,
        price_drop_threshold: threshold,
      }).unwrap();

      toast({
        title: "Preferences Updated",
        description: "Your notification preferences have been saved.",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.error || "Failed to update preferences",
        variant: "destructive",
      });
    }
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
          <CardTitle className="text-2xl font-bold text-foreground">Notification Preferences</CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage how you receive notifications about price changes and updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* In-App Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="in-app" className="text-base font-semibold">
                  In-App Notifications
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Receive real-time notifications in your browser when prices change.
                </p>
              </div>
              <Switch
                id="in-app"
                checked={inAppEnabled}
                onCheckedChange={setInAppEnabled}
              />
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="email" className="text-base font-semibold">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Receive email alerts when prices drop for your saved products.
                </p>
              </div>
              <Switch
                id="email"
                checked={emailEnabled}
                onCheckedChange={setEmailEnabled}
              />
            </div>

            {/* Price Drop Threshold */}
            <div className="space-y-2">
              <Label htmlFor="threshold" className="text-base font-semibold">
                Price Drop Threshold (Optional)
              </Label>
              <p className="text-sm text-muted-foreground">
                Only notify me when the price drops by at least this percentage (0-100).
                Leave empty to receive notifications for any price drop.
              </p>
              <Input
                id="threshold"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={priceDropThreshold}
                onChange={(e) => setPriceDropThreshold(e.target.value)}
                placeholder="e.g., 5.0 for 5%"
                className="max-w-xs"
              />
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-border">
              <Button
                onClick={handleSave}
                disabled={isUpdating}
                className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Preferences"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AccountSettingsLayout>
  );
}
