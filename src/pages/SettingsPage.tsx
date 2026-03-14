import ProfileSettings from "@/components/settings/ProfileSettings";
import TeamSettings from "@/components/settings/TeamSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";

const SettingsPage = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold font-display">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account, team, and preferences
        </p>
      </div>
      <ProfileSettings />
      <AppearanceSettings />
      <TeamSettings />
    </div>
  );
};

export default SettingsPage;
