import questions from "@/lib/questions";

export async function GET(request, { params }) {
  const question = questions[params.id];
  if (!question) {
    return Response.json({ error: "Question not found" }, { status: 404 });
  }
  return Response.json({
    id: question.id,
    text: question.text,
    options: question.options,
    topic: question.topic,
  });
}
