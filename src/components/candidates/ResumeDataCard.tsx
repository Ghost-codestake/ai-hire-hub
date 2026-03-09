import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Loader2 } from "lucide-react";

interface ResumeData {
  summary: string | null;
  skills: string[];
  experience: any[];
  education: any[];
}

interface ResumeDataCardProps {
  resumeData: ResumeData | null;
  isAnalyzing: boolean;
  hasResume: boolean;
  onAnalyze: () => void;
}

const ResumeDataCard = ({ resumeData, isAnalyzing, hasResume, onAnalyze }: ResumeDataCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" /> AI Resume Analysis
        </CardTitle>
        {hasResume && (
          <Button size="sm" variant="outline" onClick={onAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Analyzing...</> : resumeData ? "Re-analyze" : "Analyze Resume"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!hasResume && (
          <p className="text-sm text-muted-foreground">Upload a resume to enable AI analysis.</p>
        )}
        {hasResume && !resumeData && !isAnalyzing && (
          <p className="text-sm text-muted-foreground">Click "Analyze Resume" to parse and extract data using AI.</p>
        )}
        {resumeData && (
          <div className="space-y-4">
            {resumeData.summary && (
              <div>
                <h4 className="text-sm font-semibold mb-1">Summary</h4>
                <p className="text-sm text-muted-foreground">{resumeData.summary}</p>
              </div>
            )}
            {resumeData.skills?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {resumeData.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
            {resumeData.experience?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Experience</h4>
                <div className="space-y-2">
                  {resumeData.experience.map((exp: any, i: number) => (
                    <div key={i} className="text-sm">
                      <span className="font-medium">{exp.title}</span> at <span className="text-muted-foreground">{exp.company}</span>
                      {exp.duration && <span className="text-muted-foreground ml-1">· {exp.duration}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {resumeData.education?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Education</h4>
                <div className="space-y-1">
                  {resumeData.education.map((edu: any, i: number) => (
                    <div key={i} className="text-sm">
                      <span className="font-medium">{edu.degree}</span> — <span className="text-muted-foreground">{edu.institution}</span>
                      {edu.year && <span className="text-muted-foreground ml-1">({edu.year})</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeDataCard;
