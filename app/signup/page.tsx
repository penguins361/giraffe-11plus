"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 👈 NEW
  const [success, setSuccess] = useState(""); // 👈 optional
  const router = useRouter();

  const handleSignup = async () => {
    setError("");
    setSuccess("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Account created! You can now log in.");
      setTimeout(() => router.push("/login"), 1500);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-yellow-400 px-6">
      <div className="card w-full max-w-md text-center">
        <h1 className="hero-title mb-6 text-black">Create Account</h1>
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

        {/* 🔴 ERROR */}
        {error && <p className="error-text">{error}</p>}

        {/* 🟢 SUCCESS */}
        {success && <p className="success-text">{success}</p>}

        <button onClick={handleSignup} className="btn primary w-full mb-4">
          Sign Up
        </button>

        <Link href="/login" className="text-sm underline">
          Already have an account? Login
        </Link>

        <Link href="/" className="btn primary mt-4 inline-block">
            Back to Home
        </Link>
      </div>
    </main>
  );
}