import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="auth-page adventure-auth">
      <section className="auth-art">
        <div className="login-brand">POO<span>Quest</span><small>ADVENTURE</small></div>
        <div className="auth-copy">
          <div className="kicker">Aprende jugando · Programa de verdad</div>
          <h1>Restaura los cuatro pilares de la POO.</h1>
          <p>Explora territorios, supera misiones interactivas y enfréntate a retos Java ejecutados desde la misma plataforma.</p>
          <div className="login-route">
            <span style={{ "--dot": "#36a9ff" } as React.CSSProperties}>◇<small>Abstracción</small></span>
            <i />
            <span style={{ "--dot": "#2dd4a8" } as React.CSSProperties}>⬡<small>Encapsulamiento</small></span>
            <i />
            <span style={{ "--dot": "#f6b73c" } as React.CSSProperties}>⌘<small>Herencia</small></span>
            <i />
            <span style={{ "--dot": "#a970ff" } as React.CSSProperties}>✦<small>Polimorfismo</small></span>
          </div>
        </div>
        <div className="login-foot">Next.js · Supabase · Java · Judge0</div>
      </section>
      <section className="auth-form-wrap">
        <div className="portal-ring" aria-hidden="true"><span /></div>
        <div className="auth-box">
          <div className="kicker">Portal de acceso</div>
          <h2>Entra a POOQuest</h2>
          <p className="muted">Tu progreso, XP y logros quedan guardados en tu cuenta.</p>
          <AuthForm />
        </div>
      </section>
    </div>
  );
}
