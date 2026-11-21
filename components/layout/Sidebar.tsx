"use client";

import Link from "next/link";
import { NavIcon } from "@/components/ui/QuestIcons";
import { P00Avatar } from "@/components/game/P00Coach";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSoundEnabled, playGameSound, setSoundEnabled } from "@/lib/sound";

const links = [
  { href: "/dashboard", icon: "home" as const, label: "Aventura" },
  { href: "/modules", icon: "compass" as const, label: "Territorios" },
  { href: "/progress", icon: "chart" as const, label: "Progreso" },
  { href: "/rewards", icon: "trophy" as const, label: "Logros" },
  { href: "/how-to-play", icon: "help" as const, label: "Cómo jugar" },
  { href: "/profile", icon: "user" as const, label: "Perfil" },
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
        <span className="v7-brand-mark">P<span>Q</span></span><span className="v7-brand-word">POO<span>Quest</span><small>EXPEDICIÓN AL NÚCLEO</small></span>
      </Link>
      <div className="sidebar-mission-label">CENTRO DE EXPLORACIÓN</div>
      <nav className="nav" aria-label="Navegación principal">
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(`${link.href}/`));
          return <Link aria-current={active ? "page" : undefined} className={active ? "active" : ""} href={link.href} key={link.href}><span aria-hidden="true"><NavIcon name={link.icon}/></span>{link.label}</Link>;
        })}
      </nav>
      <div className="v7-sidebar-guide"><P00Avatar small/><div><strong>¿Necesitas orientación?</strong><Link href="/how-to-play">Consulta tu guía de campo →</Link></div></div>
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
