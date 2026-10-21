"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function Sidebar({ name, xp }: { name: string; xp: number }) {
  const router = useRouter();
  async function logout() { await createClient().auth.signOut(); router.replace("/login"); router.refresh(); }
  return <aside className="sidebar">
    <div className="logo">POO<span>Quest</span></div>
    <nav className="nav">
      <Link href="/dashboard">⌂ Inicio</Link>
      <Link href="/modules">◈ Módulos</Link>
      <Link href="/progress">▥ Progreso</Link>
      <Link href="/rewards">★ Recompensas</Link>
      <Link href="/profile">● Perfil</Link>
    </nav>
    <div className="profile-mini">
      <div style={{fontWeight:800}}>{name}</div><small className="muted">{xp} XP</small>
      <button className="btn secondary" style={{width:"100%", marginTop:10}} onClick={logout}>Cerrar sesión</button>
    </div>
  </aside>;
}
