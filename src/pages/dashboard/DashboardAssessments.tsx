import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, PlayCircle, FileCheck2, Lock } from "lucide-react";

const assessments = [
  { title: "Core Fundamentals MCQ", type: "Multiple Choice", duration: "30 mins", questions: 20, status: "completed" as const, score: "18/20" },
  { title: "Practical Coding Task", type: "Coding Task", duration: "60 mins", questions: 2, status: "pending" as const, score: null },
  { title: "Advanced Patterns Quiz", type: "Multiple Choice", duration: "45 mins", questions: 25, status: "locked" as const, score: null },
  { title: "Final Capstone Evaluation", type: "Project Review", duration: "2 hours", questions: 1, status: "locked" as const, score: null },
];

const statusStyles = {
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  pending: "bg-primary/10 text-primary border-primary/20",
  locked: "bg-muted text-muted-foreground border-border",
};

const DashboardAssessments = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">Assessments</h1>
        <p className="text-muted-foreground text-sm">Test your knowledge and unlock new internship milestone certificates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assessments.map((a, i) => (
          <div
            key={i}
            className={`rounded-xl border shadow-sm flex flex-col ${
              a.status === "locked"
                ? "bg-muted/30 border-border/40 opacity-75"
                : "bg-card border-border/50"
            }`}
          >
            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4">
                <Badge className={`capitalize text-[11px] font-semibold ${statusStyles[a.status]}`}>
                  {a.status}
                </Badge>
                {a.status === "completed" && a.score && (
                  <strong className="text-emerald-600 text-sm font-bold">{a.score}</strong>
                )}
              </div>

              <h3 className="text-base font-bold text-foreground mb-2">{a.title}</h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-auto">
                <span className="flex items-center gap-1">
                  <FileCheck2 className="h-3.5 w-3.5" /> {a.type}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {a.duration}
                </span>
              </div>

              <div className="mt-5 pt-4 border-t border-border/40">
                {a.status === "completed" && (
                  <Button variant="outline" className="w-full rounded-lg text-xs text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100">
                    View Results
                  </Button>
                )}
                {a.status === "pending" && (
                  <Button className="w-full rounded-lg text-xs">
                    <PlayCircle className="mr-1.5 h-3.5 w-3.5" /> Start Assessment
                  </Button>
                )}
                {a.status === "locked" && (
                  <Button variant="secondary" className="w-full rounded-lg text-xs" disabled>
                    <Lock className="mr-1.5 h-3.5 w-3.5" /> Locked
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardAssessments;
