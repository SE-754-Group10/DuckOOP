"use client";

import { useState } from "react";
import Image from "next/image";
import { Question, Answer } from "./quiz";

export default function ResultsScreen({
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
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 p-6 py-12">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-200 text-center flex flex-col items-center gap-3">
          <h2 className="text-2xl font-semibold text-zinc-900">
            Quiz Complete
          </h2>
          <Image
            src={scoreImage(pct)}
            alt={scoreLabel(pct)}
            width={160}
            height={160}
            className="rounded-xl"
          />
          <p className="text-5xl font-bold text-zinc-900">
            {score}
            <span className="text-2xl text-zinc-400">/{total}</span>
          </p>
          <p className="text-zinc-500">
            {pct}% - {scoreLabel(pct)}
          </p>
          <button
            className="mt-2 px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            onClick={onRestart}
          >
            Start New Quiz
          </button>
        </div>

        <div className="flex flex-col gap-2" role="list">
          {questions.map((q, i) => {
            const ans = answers[q.id];
            if (!ans) return null;
            const correct = ans.result.correct;
            const isOpen = !!expanded[q.id];
            const buttonId = `btn-${q.id}`;
            const panelId = `panel-${q.id}`;
            const userOption = q.options.find((o) => o.id === ans.answerId);
            const correctOption = q.options.find(
              (o) => o.id === ans.result.correctAnswerId,
            );

            return (
              <div
                key={q.id}
                role="listitem"
                className="bg-white rounded-xl border border-zinc-200 overflow-hidden"
              >
                <button
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(q.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50 transition-colors"
                >
                  <span className="text-xs font-medium text-zinc-400 w-7 shrink-0">
                    Q{i + 1}
                  </span>
                  <p className="flex-1 text-sm font-medium text-zinc-800">
                    {q.text}
                  </p>
                  <span
                    className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                      correct
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {correct ? "Correct" : "Review"}
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-zinc-400 text-xs"
                  >
                    {isOpen ? "▲" : "▼"}
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-4 pb-4 pt-2 border-t border-zinc-100 flex flex-col gap-1.5"
                  >
                    {correct ? (
                      <p className="text-sm text-zinc-600">
                        You answered:{" "}
                        <span className="font-medium text-green-700">
                          {userOption?.label}
                        </span>
                      </p>
                    ) : (
                      <>
                        <p className="text-sm text-zinc-600">
                          Your answer:{" "}
                          <span className="font-medium text-zinc-700">
                            {userOption?.label}
                          </span>
                        </p>
                        <p className="text-sm text-zinc-600">
                          Correct answer:{" "}
                          <span className="font-medium text-green-700">
                            {correctOption?.label}
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function scoreImage(pct: number) {
  if (pct === 100) return "/images/Perfect Duck.png";
  if (pct >= 80) return "/images/GreatWorkDuck.png";
  if (pct >= 60) return "/images/GoodEffortDuck.png";
  if (pct >= 40) return "/images/GrowingDuck.png";
  return "/images/BeginnerDuck.png";
}

function scoreLabel(pct: number) {
  if (pct === 100) return "Perfect!";
  if (pct >= 80) return "Great work!";
  if (pct >= 60) return "Good effort!";
  if (pct >= 40) return "You're getting there!";
  return "Every attempt helps you grow!";
}
