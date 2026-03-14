import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const STAGES = [
  { key: "applied", label: "Applied", color: "bg-muted text-muted-foreground", accent: "border-muted-foreground/30" },
  { key: "shortlisted", label: "Shortlisted", color: "bg-warning/15 text-warning", accent: "border-warning/40" },
  { key: "interview", label: "Interview", color: "bg-primary/15 text-primary", accent: "border-primary/40" },
  { key: "hired", label: "Hired", color: "bg-success/15 text-success", accent: "border-success/40" },
  { key: "rejected", label: "Rejected", color: "bg-destructive/15 text-destructive", accent: "border-destructive/40" },
] as const;

interface KanbanApplication {
  id: string;
  stage: string;
  candidate_id: string;
  job_id: string;
  candidate_name: string;
  candidate_email: string;
  job_title: string;
}

interface KanbanBoardProps {
  applications: KanbanApplication[];
  onStageChange: (applicationId: string, newStage: string) => void;
}

const KanbanBoard = ({ applications, onStageChange }: KanbanBoardProps) => {
  const navigate = useNavigate();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newStage = result.destination.droppableId;
    const appId = result.draggableId;
    const app = applications.find((a) => a.id === appId);
    if (app && app.stage !== newStage) {
      onStageChange(appId, newStage);
    }
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[60vh]">
        {STAGES.map((stage) => {
          const stageApps = applications.filter((a) => a.stage === stage.key);
          return (
            <div key={stage.key} className="flex-shrink-0 w-64">
              <div className={cn("flex items-center gap-2 mb-3 px-1")}>
                <Badge className={cn("font-medium", stage.color)}>{stage.label}</Badge>
                <span className="text-xs text-muted-foreground font-medium">{stageApps.length}</span>
              </div>
              <Droppable droppableId={stage.key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "space-y-2 p-2 rounded-lg min-h-[200px] transition-colors border-2 border-dashed",
                      snapshot.isDraggingOver
                        ? cn("bg-accent/50", stage.accent)
                        : "border-transparent bg-muted/30"
                    )}
                  >
                    {stageApps.map((app, index) => (
                      <Draggable key={app.id} draggableId={app.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "cursor-grab active:cursor-grabbing transition-shadow",
                              snapshot.isDragging && "shadow-lg ring-2 ring-primary/20"
                            )}
                            onClick={() => navigate(`/dashboard/candidates/${app.candidate_id}`)}
                          >
                            <CardContent className="p-3 space-y-2">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-7 w-7">
                                  <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                                    {getInitials(app.candidate_name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-sm truncate">{app.candidate_name}</span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{app.job_title}</p>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
