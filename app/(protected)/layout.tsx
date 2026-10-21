import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("name,xp").eq("id", user.id).single();
  return <AppShell name={profile?.name || user.email?.split("@")[0] || "Estudiante"} xp={profile?.xp || 0}>{children}</AppShell>;
}
