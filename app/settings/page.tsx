"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Settings() {
  const [name, setName] = useState("");
  const [examBoard, setExamBoard] = useState("");
  const [birthday, setBirthday] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setName(data.name || "");
        setExamBoard(data.exam_board || "");
        setBirthday(data.birthday || "");
      }
    };

    loadProfile();
  }, [router]);

  const handleSave = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) return;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      name,
      exam_board: examBoard,
      birthday,
    });

    if (error) {
      setMessage("❌ Failed to save settings");
      setSuccess(false);
    } else {
      setMessage("✅ Settings saved!");
      setSuccess(true);
    }
  };

  return (
    <main className="min-h-screen flex bg-yellow-400">

      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 w-full flex justify-between items-center px-4 py-3 bg-yellow-600 shadow-md z-50">
        <h2 className="font-bold text-lg">🦒 Settings</h2>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl"
        >
          ☰
        </button>
      </div>

      {/* SIDEBAR */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-yellow-600 p-6 flex flex-col z-50
          transform transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static
        `}
      >
        <h2 className="title mb-6">Giraffe 11 Plus</h2>

        <div className="flex flex-col gap-2">
          <Link href="/dashboard"><button className="sidebar-link">🏠 Home</button></Link>
          <button className="sidebar-link">📊 Progress</button>
          <button className="sidebar-link">🧠 Maths</button>
          <button className="sidebar-link">🔤 English</button>
          <button className="sidebar-link">🧩 VR</button>
          <button className="sidebar-link">🎮 Games</button>
        <Link href="/avatar"><button className="sidebar-link">🧍 Avatar</button></Link>
          <Link href="/settings"><button className="sidebar-link">⚙️ Settings</button></Link>
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

      {/* OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 md:p-10 bg-white text-black mt-12 md:mt-0">

        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Account Settings
        </h1>

        {/* MESSAGE */}
        {message && (
          <p className={`mb-4 font-semibold ${success ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        <div className="max-w-xl space-y-6">

          <input
            type="text"
            placeholder="Child's Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          <select
            value={examBoard}
            onChange={(e) => setExamBoard(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select exam board</option>
            <option value="GL">GL</option>
            <option value="CEM">CEM</option>
          </select>

          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          <button
            onClick={handleSave}
            className="bg-yellow-500 px-6 py-3 rounded-lg font-bold hover:bg-yellow-600"
          >
            Save Changes
          </button>

        </div>
      </div>
    </main>
  );
}