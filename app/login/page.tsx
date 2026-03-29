"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 👈 NEW
  const router = useRouter();

  const handleLogin = async () => {
    setError(""); // reset

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message); // 👈 show on screen
    } else {
        router.push("/dashboard");    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-yellow-400 px-6">
      <div className="card w-full max-w-md text-center">
        <h1 className="hero-title mb-6 text-black">Login</h1>
        <input
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* 🔴 ERROR MESSAGE */}
        {error && <p className="error-text">{error}</p>}

        <button onClick={handleLogin} className="btn primary w-full mb-4">
          Log In
        </button>

        <Link href="/signup" className="text-sm underline">
          Don’t have an account? Sign up
        </Link>

        <Link href="/" className="btn primary mt-4 inline-block">
            Back to Home
        </Link>
      </div>
    </main>
  );
}