"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SHOP_ITEMS = [
  { id: "hat1", name: "🎩 Top Hat", price: 200, type: "hat" },
  { id: "glasses1", name: "🕶️ Glasses", price: 150, type: "face" },
  { id: "bg1", name: "🌅 Background", price: 300, type: "background" },
];

export default function AvatarPage() {
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
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

      setProfile({
        ...data,
        owned_items: data?.owned_items || [],
        equipped_items: data?.equipped_items || [],
        points: data?.points || 0,
      });
    };

    load();
  }, []);

  const updateProfile = async (updates: any) => {
    const { data } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    setProfile({
      ...data,
      owned_items: data?.owned_items || [],
      equipped_items: data?.equipped_items || [],
    });
  };

  const buyItem = async (item: any) => {
    if (profile.points < item.price) return;

    if (profile.owned_items.includes(item.id)) return;

    const newOwned = [...profile.owned_items, item.id];
    const newEquipped = [...profile.equipped_items, item.id];

    await updateProfile({
      points: profile.points - item.price,
      owned_items: newOwned,
      equipped_items: newEquipped,
    });
  };

  const equipItem = async (item: any) => {
    let newEquipped = profile.equipped_items.filter((id: string) => {
      const existing = SHOP_ITEMS.find((i) => i.id === id);
      return existing?.type !== item.type;
    });

    newEquipped.push(item.id);

    await updateProfile({
      equipped_items: newEquipped,
    });
  };

  if (!profile) return <p className="p-10">Loading...</p>;

  return (
    <main className="min-h-screen flex bg-yellow-400 text-black">

      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 w-full flex justify-between items-center px-4 py-3 bg-yellow-600 shadow-md z-50">
        <h2 className="font-bold">🦒 Avatar</h2>
        <button onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </div>

      {/* SIDEBAR */}
      <div className={`
        fixed md:static top-0 left-0 h-full w-64 bg-yellow-600 p-6 flex flex-col z-50
        transform ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 transition-transform duration-300
      `}>
        <h2 className="title mb-6">Giraffe 11+</h2>

        <div className="flex flex-col gap-2">
          <Link href="/dashboard"><button className="sidebar-link">🏠 Home</button></Link>
          <button className="sidebar-link">📊 Progress</button>
          <button className="sidebar-link">🧠 Maths</button>
          <button className="sidebar-link">🔤 English</button>
          <button className="sidebar-link">🧩 VR</button>
          <button className="sidebar-link">🎮 Games</button>
          <Link href="/avatar"><button className="sidebar-link">🦒 Avatar</button></Link>
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
          className="fixed inset-0 bg-black/40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 md:p-10 mt-12 md:mt-0 flex flex-col md:flex-row gap-8">

        {/* LEFT: AVATAR */}
        <div className="flex-1 flex flex-col items-center">

          <h1 className="text-2xl font-bold mb-4">Your Avatar</h1>

          <div className="w-64 h-64 bg-white rounded-xl shadow flex items-center justify-center relative">

            {profile.equipped_items.includes("bg1") && (
              <div className="absolute inset-0 bg-orange-300 rounded-xl"></div>
            )}

            <img
              src={profile.avatar_gender ? "/giraffe-girl.png" : "/giraffe-boy.png"}
              className="w-32 z-10"
            />

            {profile.equipped_items.includes("hat1") && (
              <div className="absolute top-2 text-3xl">🎩</div>
            )}

            {profile.equipped_items.includes("glasses1") && (
              <div className="absolute top-16 text-2xl">🕶️</div>
            )}

          </div>

          <div className="mt-4 flex gap-4">
            <button onClick={() => updateProfile({ avatar_gender: false })} className="btn secondary">
              Boy
            </button>
            <button onClick={() => updateProfile({ avatar_gender: true })} className="btn secondary">
              Girl
            </button>
          </div>

          <p className="mt-4 font-bold">⭐ {profile.points} points</p>

        </div>

        {/* RIGHT: SHOP */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-bold mb-4">Shop</h2>

          <div className="grid grid-cols-2 gap-4">
            {SHOP_ITEMS.map((item) => {
              const owned = profile.owned_items.includes(item.id);

              return (
                <div key={item.id} className="p-4 border rounded-lg text-center">
                  <p>{item.name}</p>
                  <p className="text-sm">{item.price} pts</p>

                  {!owned ? (
                    <button onClick={() => buyItem(item)} className="btn primary mt-2">
                      Buy
                    </button>
                  ) : (
                    <button onClick={() => equipItem(item)} className="btn secondary mt-2">
                      Equip
                    </button>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </main>
  );
}