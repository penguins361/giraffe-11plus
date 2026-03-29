"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  const updateStreak = async (userId: string) => {
    const today = new Date();
    const todayStr = today.toDateString();

    const { data } = await supabase
      .from("profiles")
      .select("streak, last_active")
      .eq("id", userId)
      .single();

    let newStreak = 1;

    if (data?.last_active) {
      const lastDate = new Date(data.last_active);
      const lastStr = lastDate.toDateString();

      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (lastStr === yesterday.toDateString()) {
        newStreak = (data.streak || 0) + 1;
      } else if (lastStr === todayStr) {
        newStreak = data.streak;
      }
    }

    await supabase
      .from("profiles")
      .update({
        streak: newStreak,
        last_active: new Date().toISOString(),
      })
      .eq("id", userId);

    return newStreak;
  };

  useEffect(() => {
    const loadData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      let streakValue = data?.streak || 1;

      if (data) {
        streakValue = await updateStreak(user.id);
      }

      setProfile({ ...data, streak: streakValue });
    };

    loadData();
  }, [router]);

  return (
    <main className="min-h-screen flex bg-yellow-400">

      {/* Sidebar */}
      <div className="w-64 bg-yellow-600 text-black p-6 flex flex-col">
        <h2 className="title mb-6">Settings</h2>

        <div className="flex flex-col gap-2">
          <Link href="/dashboard">
            <button className="sidebar-link">🏠 Home</button>
          </Link>

          <button className="sidebar-link">📊 Progress</button>
          <button className="sidebar-link">🧠 Maths</button>
          <button className="sidebar-link">🔤 English</button>
          <button className="sidebar-link">🧩 VR</button>
          <button className="sidebar-link">🎮 Games</button>
          <button className="sidebar-link">🧍 Avatar</button>

          <Link href="/settings">
            <button className="sidebar-link">⚙️ Settings</button>
          </Link>
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

      {/* Main */}
      <div className="flex-1 p-10 bg-yellow-100 text-black">

        <h1 className="text-3xl font-bold mb-6">
          Welcome {profile?.name || user?.email}
        </h1>

        <p className="mb-2">
          Exam Board: {profile?.exam_board || "Not set"}
        </p>

        <p className="mb-6">
          Birthday: {profile?.birthday || "Not set"}
        </p>

        {/* ✅ STREAK CARD */}
        <div className="mt-6 p-6 bg-white rounded-xl shadow text-center">
          <h3 className="text-xl font-bold">🔥 Streak</h3>
          <p className="text-4xl mt-2">
            {profile?.streak || 1} days
          </p>
        </div>

      </div>
    </main>
  );
}