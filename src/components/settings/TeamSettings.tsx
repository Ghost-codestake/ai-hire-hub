import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Loader2 } from "lucide-react";

interface TeamMember {
  user_id: string;
  full_name: string | null;
  email: string;
  role: string;
}

const TeamSettings = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchTeam = async () => {
      // Check if current user is admin
      const { data: adminCheck } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      setIsAdmin(!!adminCheck);

      // Fetch all roles (admins see all, recruiters see own)
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (!roles || roles.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch profiles for these users
      const userIds = [...new Set(roles.map((r) => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      const profileMap = new Map(
        (profiles || []).map((p) => [p.user_id, p.full_name])
      );

      const team: TeamMember[] = roles.map((r) => ({
        user_id: r.user_id,
        full_name: profileMap.get(r.user_id) || null,
        email: r.user_id === user.id ? user.email || "" : "",
        role: r.role,
      }));

      setMembers(team);
      setLoading(false);
    };

    fetchTeam();
  }, [user]);

  const getInitials = (name: string | null, email: string) => {
    if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    return email?.[0]?.toUpperCase() || "?";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Members
        </CardTitle>
        <CardDescription>
          {isAdmin
            ? "View and manage your team members"
            : "View your team"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No team members found.
          </p>
        ) : (
          <div className="space-y-3">
            {members.map((m) => (
              <div
                key={`${m.user_id}-${m.role}`}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/40"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {getInitials(m.full_name, m.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {m.full_name || "Unnamed"}
                      {m.user_id === user?.id && (
                        <span className="text-muted-foreground ml-1">(you)</span>
                      )}
                    </p>
                    {m.email && (
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    )}
                  </div>
                </div>
                <Badge
                  variant={m.role === "admin" ? "default" : "secondary"}
                  className="capitalize"
                >
                  {m.role}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamSettings;
