import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Loader2, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("recruiter");
  const [inviting, setInviting] = useState(false);

  const fetchTeam = async () => {
    if (!user) return;

    const { data: adminCheck } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    setIsAdmin(!!adminCheck);

    const { data: roles } = await supabase
      .from("user_roles")
      .select("user_id, role");

    if (!roles || roles.length === 0) {
      setLoading(false);
      return;
    }

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

  useEffect(() => {
    fetchTeam();
  }, [user]);

  const handleAddMember = async () => {
    if (!inviteEmail.trim()) return;

    setInviting(true);
    try {
      const { data, error } = await supabase.functions.invoke("add-team-member", {
        body: { email: inviteEmail.trim(), role: inviteRole },
      });

      if (error) {
        const message = data?.error || error.message || "Failed to add team member";
        toast({ title: "Error", description: message, variant: "destructive" });
      } else if (data?.error) {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Team member added successfully" });
        setInviteEmail("");
        setInviteRole("recruiter");
        setLoading(true);
        await fetchTeam();
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setInviting(false);
    }
  };

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
    <div className="space-y-4">
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

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add Team Member
            </CardTitle>
            <CardDescription>
              Add an existing user to your team by their email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Email address"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1"
              />
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recruiter">Recruiter</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddMember} disabled={inviting || !inviteEmail.trim()}>
                {inviting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Add Member
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              The user must have an existing account. They'll appear in the team list once added.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamSettings;
