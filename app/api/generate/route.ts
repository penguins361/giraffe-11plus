import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { examBoard, topic } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `
Create 5 multiple choice 11+ maths questions.

Exam board: ${examBoard}
Topic: ${topic}

Return ONLY JSON like:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correct": "A",
    "explanation": "..."
  }
]
            `,
          },
        ],
      }),
    });

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "[]";

    let questions = [];

    try {
      questions = JSON.parse(text);
    } catch {
      questions = [
        {
          question: "⚠️ AI formatting error",
          options: ["Retry"],
          correct: "Retry",
          explanation: text,
        },
      ];
    }

    return NextResponse.json({ questions });

  } catch (err) {
    return NextResponse.json({
      questions: [
        {
          question: "❌ Server error",
          options: ["Check terminal"],
          correct: "Check terminal",
          explanation: String(err),
        },
      ],
    });
  }
}