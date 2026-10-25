import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
  const initial = (profile?.name || user?.email || "E").slice(0, 1).toUpperCase();

  return (
    <div className="page">
      <div className="kicker">Identidad del explorador</div>
      <h1 className="title">Perfil</h1>
      <section className="profile-card card">
        <div className="profile-hero-orb">{initial}</div>
        <div className="profile-info"><div className="kicker">EXPLORADOR ACTIVO</div><h2>{profile?.name}</h2><p>{user?.email}</p><div className="hero-metrics"><span><b>⚡ {profile?.xp || 0}</b> XP</span><span><b>●</b> Cuenta sincronizada</span></div></div>
      </section>
      <div className="grid grid-2 profile-actions"><Link className="card" href="/progress"><div className="kicker">Bitácora</div><h2>Revisar progreso</h2><p>Consulta misiones iniciadas y completadas.</p><span>Ver progreso →</span></Link><Link className="card" href="/rewards"><div className="kicker">Colección</div><h2>Ver logros</h2><p>Revisa las insignias que has desbloqueado.</p><span>Ver recompensas →</span></Link></div>
    </div>
  );
}
