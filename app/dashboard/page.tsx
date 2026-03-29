"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
      }
    };

    getUser();
  }, []);

  return (
    <main className="min-h-screen flex bg-yellow-400">

      {/* Sidebar */}
      <div className="w-64 bg-yellow-600 text-black p-6 flex flex-col shadow-md">

        <div className="flex items-center gap-3 mb-6">
          <img src="/giraffe-logo.png" className="logo" />
          <h2 className="title">Dashboard</h2>
        </div>

        <div className="flex flex-col gap-2">
          <button className="sidebar-link">🏠 Home</button>
          <button className="sidebar-link">📊 Progress</button>
          <button className="sidebar-link">🧠 Maths</button>
          <button className="sidebar-link">🔤 English</button>
          <button className="sidebar-link">🧩 VR</button>
          <button className="sidebar-link">🎮 Games</button>
          <button className="sidebar-link">🧍 Avatar</button>
          <button className="sidebar-link">⚙️ Settings</button>
        </div>

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

      {/* Main Content */}
      <div className="flex-1 p-10 bg-yellow-100">

        <h1 className="hero-title text-black mb-6">
          Welcome {user?.email}
        </h1>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">

          <div className="card text-center">
            <h3 className="font-bold text-lg">⭐ Points</h3>
            <p className="text-3xl mt-2">1200</p>
          </div>

          <div className="card text-center">
            <h3 className="font-bold text-lg">📊 Last Score</h3>
            <p className="text-3xl mt-2">85%</p>
          </div>

          <div className="card text-center">
            <h3 className="font-bold text-lg">🔥 Streak</h3>
            <p className="text-3xl mt-2">5 days</p>
          </div>

        </div>

        {/* Recent Activity */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4 text-black">
            Recent Scores
          </h2>

          <div className="card">
            <p>Maths Practice - 85%</p>
            <p>English Quiz - 78%</p>
            <p>VR Test - 90%</p>
          </div>
        </div>

      </div>

    </main>
  );
}