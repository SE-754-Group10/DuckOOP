export function gradeAnswer(question, answerId) {
  return {
    correct: question.correctId === answerId,
    correctAnswerId: question.correctId,
    explanation: question.explanation,
  };
}
