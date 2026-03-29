"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setMouse({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <main className="min-h-screen flex flex-col overflow-hidden">
      
      {/* 5 Reactive Pencils */}
      {[0.01, 0.02, 0.03, 0.04, 0.05].map((speed, i) => (
        <div
          key={i}
          className={`floating p${i}`}
          style={{
            transform: `translate(${mouse.x * speed}px, ${mouse.y * speed}px)`
          }}
        >
          ✏️
        </div>
      ))}

      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-yellow-600 shadow-md">        
        <div className="flex items-center gap-4">
          <img src="/giraffe-logo.png" alt="logo" className="logo" />
          <h1 className="title">
            Giraffe 11+ Academy
          </h1>
        </div>

        <div>
          <Link href="/login">
            <button className="btn secondary mr-4">Login</button>
          </Link>

          <Link href="/signup">
            <button className="btn primary">Sign Up</button>
          </Link>
        </div>

      </nav>

      {/* Hero */}
      <section className="bg-yellow-400 flex flex-col md:flex-row items-center justify-center px-6 py-16 gap-12">
        
        <img 
          src="/giraffe-mascot.png" 
          alt="giraffe mascot" 
          className="giraffe"
        />

        <div className="text-center md:text-left max-w-xl text-black">
          <h2 className="hero-title">
            Help Your Child Succeed in the 11+
          </h2>

          <p className="mt-6 text-lg">
            Practice maths, English, verbal and non-verbal reasoning with engaging questions designed for real exam success.
          </p>

          <button className="btn primary big mt-8">
            Start Practice
          </button>
        </div>

      </section>

      {/* Features */}
      <section className="bg-white py-16 px-6 text-black">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          
          <div className="card">
            <h3 className="text-xl font-bold">📊 Track Progress</h3>
            <p className="mt-2 text-sm text-gray-700">
              Monitor improvement and identify strengths and weaknesses.
            </p>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold">🧠 Exam Practice</h3>
            <p className="mt-2 text-sm text-gray-700">
              Realistic 11+ style questions across all subjects.
            </p>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold">🎮 Fun Learning</h3>
            <p className="mt-2 text-sm text-gray-700">
              Keep students engaged with interactive learning.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}