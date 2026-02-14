import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings</p>
      </div>
      <Card>
        <CardContent className="py-16 text-center">
          <Settings className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-lg">Settings page coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
