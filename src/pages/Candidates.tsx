import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

const Candidates = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Candidates</h1>
        <p className="text-muted-foreground mt-1">Manage and review candidates</p>
      </div>
      <Card>
        <CardContent className="py-16 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-lg">Candidate management will be built in Phase 3.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Candidates;
