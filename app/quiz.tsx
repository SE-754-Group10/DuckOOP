"use client";

import { useState, useEffect } from "react";

type Option = { id: string; label: string };
type Question = { id: string; text: string; options: Option[] };
type GradeResult = {
  correct: boolean;
  correctAnswerId: string;
  explanation: string;
};
type Answer = { answerId: string; result: GradeResult };

const QUESTION_IDS = [
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
  "q10",
];

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [gradingId, setGradingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all(
      QUESTION_IDS.map((id) =>
        fetch(`/api/questions/${id}`).then((r) => r.json()),
      ),
    )
      .then(setQuestions)
      .finally(() => setLoading(false));
  }, []);

  async function selectAnswer(questionId: string, answerId: string) {
    if (answers[questionId] || gradingId) return;
    setGradingId(questionId);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, answerId }),
      });
      const result: GradeResult = await res.json();
      setAnswers((prev) => ({ ...prev, [questionId]: { answerId, result } }));
    } finally {
      setGradingId(null);
    }
  }

  function startNew() {
    setAnswers({});
    setCurrentIndex(0);
    setSubmitted(false);
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-zinc-500">Loading questions…</p>
      </div>
    );
  }

  const allAnswered = QUESTION_IDS.every((id) => answers[id]);

  if (submitted) {
    const score = Object.values(answers).filter((a) => a.result.correct).length;
    return (
      <ResultsScreen
        questions={questions}
        answers={answers}
        score={score}
        total={QUESTION_IDS.length}
        onRestart={startNew}
      />
    );
  }

  const question = questions[currentIndex];
  if (!question) return null;

  const answer = answers[question.id];
  const isGrading = gradingId === question.id;

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-zinc-900">OOP Quiz</h1>
          <span className="text-sm text-zinc-500">
            {Object.keys(answers).length} / {QUESTION_IDS.length} answered
          </span>
        </div>

        <div className="flex gap-2 flex-wrap">
          {QUESTION_IDS.map((id, i) => {
            const ans = answers[id];
            const isCurrent = i === currentIndex;
            const base =
              "w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center cursor-pointer transition-all ";
            const ring = isCurrent ? "ring-2 ring-offset-2 ring-zinc-700 " : "";
            const color = ans
              ? ans.result.correct
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
              : "bg-zinc-200 text-zinc-600";
            return (
              <button
                key={id}
                className={base + ring + color}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Question ${i + 1}`}
                aria-current={isCurrent ? "step" : undefined}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200 flex flex-col gap-5">
          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">
              Question {currentIndex + 1} of {QUESTION_IDS.length}
            </p>
            <p className="text-base font-medium text-zinc-900 leading-relaxed">
              {question.text}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {question.options.map((option) => {
              let cls =
                "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ";
              if (answer) {
                if (option.id === answer.result.correctAnswerId) {
                  cls += "bg-green-50 border-green-400 text-green-800";
                } else if (option.id === answer.answerId) {
                  cls += "bg-red-50 border-red-400 text-red-800";
                } else {
                  cls += "bg-white border-zinc-200 text-zinc-400";
                }
              } else {
                cls +=
                  "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 cursor-pointer";
              }
              return (
                <button
                  key={option.id}
                  className={cls}
                  onClick={() => selectAnswer(question.id, option.id)}
                  disabled={!!answer || !!gradingId}
                >
                  <span className="font-bold mr-2">
                    {option.id.toUpperCase()}.
                  </span>
                  {option.label}
                </button>
              );
            })}
          </div>

          {isGrading && (
            <p className="text-sm text-zinc-400">Checking answer…</p>
          )}

          {answer && (
            <div
              className={`p-4 rounded-xl text-sm border ${
                answer.result.correct
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <p
                className={`font-semibold mb-1 ${
                  answer.result.correct ? "text-green-800" : "text-red-800"
                }`}
              >
                {answer.result.correct ? "✓ Correct!" : "✗ Incorrect"}
              </p>
              <p className="text-zinc-700 leading-relaxed">
                {answer.result.explanation}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            className="px-4 py-2 rounded-lg border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            onClick={() => setCurrentIndex((i) => i - 1)}
            disabled={currentIndex === 0}
          >
            ← Previous
          </button>

          <div className="flex items-center gap-3">
            {allAnswered && (
              <button
                className="px-5 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors"
                onClick={() => setSubmitted(true)}
              >
                Submit Quiz
              </button>
            )}
            <button
              className="px-4 py-2 rounded-lg border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              onClick={() => setCurrentIndex((i) => i + 1)}
              disabled={currentIndex === QUESTION_IDS.length - 1}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsScreen({
  questions,
  answers,
  score,
  total,
  onRestart,
}: {
  questions: Question[];
  answers: Record<string, Answer>;
  score: number;
  total: number;
  onRestart: () => void;
}) {
  const pct = Math.round((score / total) * 100);

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 p-6 py-12">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-200 text-center flex flex-col items-center gap-3">
          <h2 className="text-2xl font-semibold text-zinc-900">
            Quiz Complete
          </h2>
          <p className="text-5xl font-bold text-zinc-900">
            {score}
            <span className="text-2xl text-zinc-400">/{total}</span>
          </p>
          <p className="text-zinc-500">
            {pct}% — {scoreLabel(pct)}
          </p>
          <button
            className="mt-2 px-6 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors"
            onClick={onRestart}
          >
            Start New Quiz
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {questions.map((q, i) => {
            const ans = answers[q.id];
            if (!ans) return null;
            const correct = ans.result.correct;
            return (
              <div
                key={q.id}
                className="bg-white rounded-xl p-4 border border-zinc-200 flex flex-col gap-2"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                      correct
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {correct ? "✓" : "✗"}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs text-zinc-400 mb-0.5">Q{i + 1}</p>
                    <p className="text-sm font-medium text-zinc-800">
                      {q.text}
                    </p>
                    {!correct && (
                      <p className="text-xs text-zinc-500 mt-1">
                        Your answer:{" "}
                        <span className="text-red-600 font-medium">
                          {q.options.find((o) => o.id === ans.answerId)?.label}
                        </span>
                        {" · "}Correct:{" "}
                        <span className="text-green-700 font-medium">
                          {
                            q.options.find(
                              (o) => o.id === ans.result.correctAnswerId,
                            )?.label
                          }
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function scoreLabel(pct: number) {
  if (pct === 100) return "Perfect!";
  if (pct >= 80) return "Great work";
  if (pct >= 60) return "Good effort";
  if (pct >= 40) return "Keep practising";
  return "Review the material";
}
