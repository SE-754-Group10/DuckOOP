"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ResultsScreen from "./results";

type Option = { id: string; label: string };
type GradeResult = {
  correct: boolean;
  correctAnswerId: string;
  explanation: string;
};

// Shared types to be used by both the quiz and results screens, and the API routes
export type Question = { id: string; text: string; options: Option[] };
export type Answer = { answerId: string; result: GradeResult };

function shuffleOptions<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

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
      .then((qs) =>
        setQuestions(qs.map((q: Question) => ({ ...q, options: shuffleOptions(q.options) }))),
      )
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
    setQuestions((prev) =>
      prev.map((q) => ({ ...q, options: shuffleOptions(q.options) })),
    );
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

        <div className="relative w-full py-2">
          <div className="relative w-full h-5 bg-blue-100 rounded-full overflow-visible">
            <div
              className="absolute left-0 top-0 h-full bg-blue-400 rounded-full transition-all duration-500"
              style={{
                width: `${Math.round((Object.keys(answers).length / QUESTION_IDS.length) * 100)}%`,
              }}
            />
            <Image
              src="/images/DuckIcon.png"
              alt="Duck swimming"
              width={34}
              height={34}
              className="absolute bottom-0 transition-all duration-500 drop-shadow-sm"
              style={{
                left: `max(0px, calc(${Math.round((Object.keys(answers).length / QUESTION_IDS.length) * 100)}% - 17px))`,
              }}
            />
          </div>
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

          <div className="min-h-[88px]">
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
        </div>

        <div className="flex items-center justify-end">
          {allAnswered && currentIndex === QUESTION_IDS.length - 1 ? (
            <button
              className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              onClick={() => setSubmitted(true)}
            >
              Submit Quiz
            </button>
          ) : (
            <button
              className="px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              onClick={() => setCurrentIndex((i) => i + 1)}
              disabled={!answer || currentIndex === QUESTION_IDS.length - 1}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
