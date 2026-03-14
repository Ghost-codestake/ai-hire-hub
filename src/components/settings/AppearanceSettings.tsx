import { useTheme } from "@/hooks/useTheme";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const options = [
  { value: "light" as const, label: "Light", icon: Sun },
  { value: "dark" as const, label: "Dark", icon: Moon },
  { value: "system" as const, label: "System", icon: Monitor },
];

const AppearanceSettings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Appearance
        </CardTitle>
        <CardDescription>Choose your preferred theme</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {options.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                theme === value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-muted-foreground/30 text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
