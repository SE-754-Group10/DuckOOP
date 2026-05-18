import questions from "@/lib/questions";
import { gradeAnswer } from "@/lib/grading";

export async function POST(request) {
  const body = await request.json();
  const { questionId, answerId } = body;

  if (!questionId || !answerId) {
    return Response.json(
      { error: "Missing questionId or answerId" },
      { status: 400 },
    );
  }

  const question = questions[questionId];
  if (!question) {
    return Response.json({ error: "Question not found" }, { status: 404 });
  }

  const result = gradeAnswer(question, answerId);
  return Response.json(result);
}
