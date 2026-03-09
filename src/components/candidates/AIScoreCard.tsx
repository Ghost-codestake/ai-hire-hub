import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Loader2, CheckCircle, XCircle, MessageSquareText } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface AIScore {
  match_score: number;
  strengths: string[];
  skill_gaps: string[];
  recommendation: string | null;
  interview_questions: any[];
}

interface AIScoreCardProps {
  aiScore: AIScore | null;
  isScoring: boolean;
  onScore: () => void;
  jobTitle: string;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-destructive";
};

const AIScoreCard = ({ aiScore, isScoring, onScore, jobTitle }: AIScoreCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> AI Match Score — {jobTitle}
        </CardTitle>
        <Button size="sm" variant="outline" onClick={onScore} disabled={isScoring}>
          {isScoring ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Scoring...</> : aiScore ? "Re-score" : "Score Candidate"}
        </Button>
      </CardHeader>
      <CardContent>
        {!aiScore && !isScoring && (
          <p className="text-sm text-muted-foreground">Click "Score Candidate" to generate an AI-powered match assessment.</p>
        )}
        {aiScore && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`text-3xl font-bold font-display ${getScoreColor(aiScore.match_score)}`}>
                {aiScore.match_score}%
              </div>
              <Progress value={aiScore.match_score} className="flex-1 h-3" />
            </div>

            {aiScore.recommendation && (
              <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                {aiScore.recommendation}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiScore.strengths?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-success" /> Strengths
                  </h4>
                  <ul className="space-y-1">
                    {aiScore.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-muted-foreground">• {s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {aiScore.skill_gaps?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                    <XCircle className="h-3.5 w-3.5 text-destructive" /> Skill Gaps
                  </h4>
                  <ul className="space-y-1">
                    {aiScore.skill_gaps.map((g, i) => (
                      <li key={i} className="text-sm text-muted-foreground">• {g}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {aiScore.interview_questions?.length > 0 && (
              <Accordion type="single" collapsible>
                <AccordionItem value="questions">
                  <AccordionTrigger className="text-sm font-semibold">
                    <span className="flex items-center gap-1">
                      <MessageSquareText className="h-3.5 w-3.5" /> Interview Questions ({aiScore.interview_questions.length})
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      {aiScore.interview_questions.map((q: any, i: number) => (
                        <div key={i} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs capitalize">{q.type}</Badge>
                            <span className="text-sm font-medium">{q.question}</span>
                          </div>
                          {q.rationale && (
                            <p className="text-xs text-muted-foreground ml-[calc(theme(spacing.2)+4rem)]">{q.rationale}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIScoreCard;
