"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MathsPage() {
  const [examBoard, setExamBoard] = useState("");
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any>({});
  const [score, setScore] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();

  const generateQuestions = async () => {
    console.log("CLICKED");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ examBoard, topic }),
      });

      const data = await res.json();

      if (!data.questions) {
        alert("Error generating questions");
        return;
      }

      setQuestions(data.questions);
      setAnswers({});
      setScore(null);

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const handleSubmit = async () => {
    let correct = 0;

    questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
    });

    const pointsEarned = correct * 10;
    setScore(pointsEarned);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("points")
        .eq("id", user.id)
        .single();

      await supabase
        .from("profiles")
        .update({
          points: (data?.points || 0) + pointsEarned,
        })
        .eq("id", user.id);
    }
  };

  return (
    <main className="min-h-screen flex bg-yellow-400">

      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 w-full flex justify-between items-center px-4 py-3 bg-yellow-600 z-50">
        <h2 className="font-bold">🧠 Maths</h2>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* SIDEBAR */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-yellow-600 p-6 flex flex-col
        transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static z-50
      `}>
        <h2 className="mb-6 font-bold text-lg">Giraffe 11+</h2>

        <Link href="/dashboard"><button className="sidebar-link">🏠 Home</button></Link>
        <Link href="/maths"><button className="sidebar-link">🧠 Maths</button></Link>
        <Link href="/avatar"><button className="sidebar-link">🦒 Avatar</button></Link>
        <Link href="/settings"><button className="sidebar-link">⚙️ Settings</button></Link>

        <button
          className="btn primary mt-auto"
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/");
          }}
        >
          Logout
        </button>
      </div>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 md:p-10 mt-14 md:mt-0 bg-yellow-100">

        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Maths Practice
        </h1>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">

          <select
            value={examBoard}
            onChange={(e) => setExamBoard(e.target.value)}
            className="p-3 border rounded-lg"
          >
            <option value="">Exam Board</option>
            <option value="GL">GL</option>
            <option value="CEM">CEM</option>
          </select>

          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="p-3 border rounded-lg"
          >
            <option value="">Topic</option>
            <option value="addition">Addition</option>
            <option value="subtraction">Subtraction</option>
            <option value="multiplication">Multiplication</option>
            <option value="division">Division</option>
            <option value="fractions">Fractions</option>
            <option value="decimals">Decimals</option>
            <option value="percentages">Percentages</option>
            <option value="ratio">Ratio</option>
            <option value="algebra">Algebra</option>
            <option value="word problems">Word Problems</option>
          </select>

          <button
            type="button"
            onClick={generateQuestions}
            className="bg-yellow-500 px-6 py-3 rounded-lg font-bold"
          >
            Generate
          </button>

        </div>

        {/* QUESTIONS */}
        {questions.map((q, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow mb-4">
            <p className="font-bold">{i + 1}. {q.question}</p>

            {q.options.map((opt: string, idx: number) => (
              <label key={idx} className="block">
                <input
                  type="radio"
                  name={`q-${i}`}
                  onChange={() =>
                    setAnswers({ ...answers, [i]: opt })
                  }
                /> {opt}
              </label>
            ))}

            {score !== null && (
              <p className="mt-2 text-blue-600 text-sm">
                💡 {q.explanation}
              </p>
            )}
          </div>
        ))}

        {/* SUBMIT */}
        {questions.length > 0 && (
          <button
            onClick={handleSubmit}
            className="bg-green-500 px-6 py-3 rounded-lg font-bold"
          >
            Submit
          </button>
        )}

        {/* SCORE */}
        {score !== null && (
          <p className="mt-4 text-green-600 font-bold">
            You earned {score} points 🎉
          </p>
        )}

      </div>
    </main>
  );
}