"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthForm() {
  const [mode, setMode] = useState<"login"|"register">("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setMessage("");
    const fd = new FormData(e.currentTarget); const email = String(fd.get("email")||""); const password = String(fd.get("password")||""); const name = String(fd.get("name")||"");
    const supabase = createClient();
    if (mode === "register") {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name }, emailRedirectTo: `${location.origin}/auth/callback` } });
      if (error) setMessage(error.message); else setMessage("Cuenta creada. Revisa tu correo si Supabase tiene confirmación de email activada.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage("No fue posible iniciar sesión. Verifica correo y contraseña."); else { router.replace("/dashboard"); router.refresh(); }
    }
    setLoading(false);
  }
  return <div className="auth-form card">
    <div className="tabs"><button className={`tab ${mode==="login"?"active":""}`} onClick={()=>setMode("login")}>Iniciar sesión</button><button className={`tab ${mode==="register"?"active":""}`} onClick={()=>setMode("register")}>Registrarse</button></div>
    <form className="stack" onSubmit={submit}>
      {mode === "register" && <label><span className="label">Nombre</span><input className="input" name="name" required minLength={2}/></label>}
      <label><span className="label">Correo electrónico</span><input className="input" type="email" name="email" required/></label>
      <label><span className="label">Contraseña</span><input className="input" type="password" name="password" required minLength={6}/></label>
      <button className="btn" disabled={loading}>{loading ? "Procesando..." : mode === "login" ? "Entrar a POOQuest" : "Crear cuenta"}</button>
      {message && <div className="badge">{message}</div>}
    </form>
  </div>;
}
