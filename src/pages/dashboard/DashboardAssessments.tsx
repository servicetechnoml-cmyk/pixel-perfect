import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, PlayCircle, FileCheck2, Lock, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Assessment = {
  id: string; domain_id: string; title: string; type: string;
  duration_minutes: number; questions_count: number; is_active: boolean;
};
type Question = {
  id: string; assessment_id: string; question_text: string;
  option_a: string; option_b: string; option_c: string; option_d: string;
  correct_option: string; order_number: number;
};
type AssessmentResult = {
  id: string; assessment_id: string; status: string; score: string | null;
};

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  pending: "bg-primary/10 text-primary border-primary/20",
  locked: "bg-muted text-muted-foreground border-border",
};

const DashboardAssessments = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Quiz state
  const [activeQuiz, setActiveQuiz] = useState<Assessment | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null);

  useEffect(() => { if (user) fetchAssessments(); }, [user]);

  const fetchAssessments = async () => {
    if (!user) return;
    setLoading(true);
    const { data: apps } = await supabase
      .from("internship_applications").select("domain_id, status").eq("user_id", user.id);
    const approved = (apps || []).filter(a => a.status === "approved").map(a => a.domain_id);

    if (approved.length > 0) {
      const { data: assts } = await supabase
        .from("internship_assessments").select("*").in("domain_id", approved).eq("is_active", true);
      setAssessments(assts || []);
      const { data: res } = await supabase
        .from("assessment_results").select("*").eq("user_id", user.id);
      setResults(res || []);
    } else {
      setAssessments([]); setResults([]);
    }
    setLoading(false);
  };

  const startQuiz = async (assessment: Assessment) => {
    const { data: qs } = await supabase
      .from("assessment_questions").select("*")
      .eq("assessment_id", assessment.id).order("order_number");
    if (!qs || qs.length === 0) {
      toast({ title: "No questions", description: "This assessment has no questions yet.", variant: "destructive" });
      return;
    }
    setActiveQuiz(assessment);
    setQuizQuestions(qs);
    setCurrentQ(0);
    setAnswers({});
    setQuizResult(null);
  };

  const selectAnswer = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const submitQuiz = async () => {
    if (!user || !activeQuiz) return;
    setSubmitting(true);
    let correct = 0;
    quizQuestions.forEach(q => {
      if (answers[q.id] === q.correct_option) correct++;
    });
    const total = quizQuestions.length;
    const scoreText = `${correct}/${total}`;

    const { error } = await supabase.from("assessment_results").insert({
      user_id: user.id,
      assessment_id: activeQuiz.id,
      status: "completed",
      score: scoreText,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setQuizResult({ score: correct, total });
      fetchAssessments();
    }
  };

  // Quiz UI
  if (activeQuiz && quizQuestions.length > 0) {
    // Show result screen
    if (quizResult) {
      const percent = Math.round((quizResult.score / quizResult.total) * 100);
      const passed = percent >= 50;
      return (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className={`rounded-2xl border-2 p-8 text-center ${passed ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"}`}>
            <div className={`inline-flex items-center justify-center h-20 w-20 rounded-full mb-4 ${passed ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
              <span className={`text-3xl font-bold ${passed ? "text-emerald-600" : "text-red-600"}`}>{percent}%</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{passed ? "Congratulations! 🎉" : "Keep Trying! 💪"}</h2>
            <p className="text-muted-foreground text-sm mb-1">You scored <strong className="text-foreground">{quizResult.score} out of {quizResult.total}</strong></p>
            <p className="text-muted-foreground text-xs">{activeQuiz.title}</p>
            <div className="flex gap-3 justify-center mt-6">
              <Button variant="outline" onClick={() => { setActiveQuiz(null); setQuizResult(null); }}>
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Assessments
              </Button>
            </div>
          </div>

          {/* Review answers */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Review Your Answers</h3>
            {quizQuestions.map((q, i) => {
              const userAns = answers[q.id];
              const isCorrect = userAns === q.correct_option;
              return (
                <div key={q.id} className={`rounded-xl border p-4 ${isCorrect ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"}`}>
                  <p className="text-sm font-medium text-foreground mb-2">
                    <span className="font-bold text-primary mr-1">Q{i + 1}.</span> {q.question_text}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(["a", "b", "c", "d"] as const).map(opt => {
                      const optText = opt === "a" ? q.option_a : opt === "b" ? q.option_b : opt === "c" ? q.option_c : q.option_d;
                      const isRight = q.correct_option === opt;
                      const isChosen = userAns === opt;
                      return (
                        <div key={opt} className={`text-xs px-2 py-1.5 rounded-md border ${isRight ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-700 font-semibold" : isChosen ? "bg-red-500/10 border-red-500/30 text-red-600 line-through" : "bg-muted/30 border-border/30 text-muted-foreground"}`}>
                          <span className="font-bold mr-1">{opt.toUpperCase()}.</span>{optText}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Active quiz UI
    const q = quizQuestions[currentQ];
    const progress = Math.round(((currentQ + 1) / quizQuestions.length) * 100);
    const allAnswered = quizQuestions.every(qq => answers[qq.id]);
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => { setActiveQuiz(null); }} className="gap-1 text-xs">
            <ArrowLeft size={14} /> Exit Quiz
          </Button>
          <Badge variant="outline" className="text-xs">{activeQuiz.title}</Badge>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Question {currentQ + 1} of {quizQuestions.length}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question Card */}
        <div className="rounded-2xl border border-border/50 bg-card shadow-sm p-6">
          <p className="text-lg font-semibold text-foreground mb-6">
            <span className="text-primary font-bold mr-2">Q{currentQ + 1}.</span>{q.question_text}
          </p>
          <div className="space-y-3">
            {(["a", "b", "c", "d"] as const).map(opt => {
              const optText = opt === "a" ? q.option_a : opt === "b" ? q.option_b : opt === "c" ? q.option_c : q.option_d;
              const isSelected = answers[q.id] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => selectAnswer(q.id, opt)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm ${isSelected
                    ? "border-primary bg-primary/5 text-foreground font-medium shadow-sm"
                    : "border-border/40 bg-background hover:border-primary/40 hover:bg-muted/30 text-foreground"
                  }`}
                >
                  <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold mr-3 ${isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                    {opt.toUpperCase()}
                  </span>
                  {optText}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" disabled={currentQ === 0} onClick={() => setCurrentQ(c => c - 1)}>
            <ArrowLeft size={14} className="mr-1" /> Previous
          </Button>

          {currentQ < quizQuestions.length - 1 ? (
            <Button size="sm" onClick={() => setCurrentQ(c => c + 1)}>
              Next <ArrowRight size={14} className="ml-1" />
            </Button>
          ) : (
            <Button size="sm" onClick={submitQuiz} disabled={!allAnswered || submitting} className="bg-emerald-600 hover:bg-emerald-700">
              {submitting ? "Submitting..." : "Submit Quiz ✓"}
            </Button>
          )}
        </div>

        {/* Question dots */}
        <div className="flex justify-center gap-1.5 flex-wrap">
          {quizQuestions.map((qq, i) => (
            <button
              key={qq.id}
              onClick={() => setCurrentQ(i)}
              className={`h-7 w-7 rounded-full text-[10px] font-bold transition-all ${i === currentQ
                ? "bg-primary text-white scale-110"
                : answers[qq.id]
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">Assessments</h1>
          <p className="text-muted-foreground text-sm">Test your knowledge and unlock new internship milestone certificates.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />)}
        </div>
      </div>
    );
  }

  // Assessment cards list
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">Assessments</h1>
        <p className="text-muted-foreground text-sm">Test your knowledge and unlock new internship milestone certificates.</p>
      </div>

      {assessments.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground text-sm">No assessments are currently available for your domain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assessments.map((a) => {
            const result = results.find(r => r.assessment_id === a.id);
            const status = result?.status === "completed" ? "completed" : "pending";

            return (
              <div key={a.id} className="rounded-xl border shadow-sm flex flex-col bg-card border-border/50">
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <Badge className={`capitalize text-[11px] font-semibold ${statusStyles[status]}`}>{status}</Badge>
                    {status === "completed" && result?.score && (
                      <strong className="text-emerald-600 text-sm font-bold">{result.score}</strong>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">{a.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-auto">
                    <span className="flex items-center gap-1"><FileCheck2 className="h-3.5 w-3.5" /> {a.type}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {a.duration_minutes} mins</span>
                  </div>
                  <div className="mt-5 pt-4 border-t border-border/40">
                    {status === "completed" ? (
                      <Button variant="outline" className="w-full rounded-lg text-xs text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100" disabled>
                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Completed
                      </Button>
                    ) : (
                      <Button className="w-full rounded-lg text-xs" onClick={() => startQuiz(a)}>
                        <PlayCircle className="mr-1.5 h-3.5 w-3.5" /> Take Assessment
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardAssessments;
