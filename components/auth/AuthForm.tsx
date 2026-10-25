"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const name = String(form.get("name") || "");
    const supabase = createClient();

    if (mode === "register") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name }, emailRedirectTo: `${location.origin}/auth/callback` },
      });
      if (error) setMessage(error.message);
      else setMessage("Cuenta creada. Ya puedes entrar a la aventura.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage("No fue posible iniciar sesión. Verifica correo y contraseña.");
      else {
        router.replace("/dashboard");
        router.refresh();
      }
    }
    setLoading(false);
  }

  return (
    <div className="auth-form">
      <div className="auth-tabs">
        <button type="button" className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setMessage(""); }}>Iniciar sesión</button>
        <button type="button" className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setMessage(""); }}>Crear cuenta</button>
      </div>
      <form className="stack" onSubmit={submit}>
        {mode === "register" && <label><span className="label">Nombre de explorador</span><input className="input" name="name" placeholder="Tu nombre" required minLength={2} /></label>}
        <label><span className="label">Correo electrónico</span><input className="input" type="email" name="email" placeholder="correo@ejemplo.com" required /></label>
        <label><span className="label">Contraseña</span><input className="input" type="password" name="password" placeholder="Mínimo 6 caracteres" required minLength={6} /></label>
        <button className="btn auth-submit" disabled={loading}>{loading ? "Conectando con el Núcleo..." : mode === "login" ? "Entrar a la aventura →" : "Crear explorador →"}</button>
        {message && <div className="auth-message">{message}</div>}
      </form>
    </div>
  );
}
