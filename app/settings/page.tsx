"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

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

      setProfile(data);
    };

    loadData();
  }, [router]);

  return (
    <main className="min-h-screen flex bg-yellow-400">

      {/* Sidebar */}
      <div className="w-64 bg-yellow-600 p-6 flex flex-col">
        <h2 className="title mb-6">Dashboard</h2>

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

      </div>
    </main>
  );
}