"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSoundEnabled, playGameSound, setSoundEnabled } from "@/lib/sound";

const links = [
  { href: "/dashboard", icon: "⌂", label: "Aventura" },
  { href: "/modules", icon: "◇", label: "Territorios" },
  { href: "/progress", icon: "▥", label: "Progreso" },
  { href: "/rewards", icon: "★", label: "Logros" },
  { href: "/how-to-play", icon: "?", label: "Cómo jugar" },
  { href: "/profile", icon: "●", label: "Perfil" },
];

export function Sidebar({ name, xp }: { name: string; xp: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playGameSound("toggle");
  }

  async function logout() {
    await createClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="sidebar">
      <Link href="/dashboard" className="logo" aria-label="POOQuest inicio">
        POO<span>Quest</span><small>ADVENTURE</small>
      </Link>
      <div className="sidebar-mission-label">NAVEGACIÓN</div>
      <nav className="nav">
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(`${link.href}/`));
          return <Link className={active ? "active" : ""} href={link.href} key={link.href}><span>{link.icon}</span>{link.label}</Link>;
        })}
      </nav>
      <div className="profile-mini">
        <div className="profile-orb">{name.slice(0, 1).toUpperCase()}</div>
        <div className="profile-copy"><strong>{name}</strong><small>{xp} XP acumulada</small></div>
        <div className="profile-xp-line"><span style={{ width: `${Math.min(100, (xp % 100) || (xp ? 100 : 0))}%` }} /></div>
        <button className="sound-toggle" type="button" aria-pressed={soundOn} onClick={toggleSound}>{soundOn ? "🔊 Sonido" : "🔇 Silencio"}</button>
        <button className="btn secondary profile-logout" onClick={logout}>Cerrar sesión</button>
      </div>
    </aside>
  );
}
