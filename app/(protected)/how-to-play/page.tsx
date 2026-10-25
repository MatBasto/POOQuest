import Link from "next/link";

export default function HowToPlayPage() {
  return (
    <div className="page how-page">
      <div className="kicker">Manual del explorador</div>
      <h1 className="title">¿Cómo se juega POOQuest?</h1>
      <p className="subtitle lead">No necesitas memorizar un manual. La regla principal es simple: aprende una idea, úsala dentro de una misión y demuéstrala programando.</p>

      <section className="how-loop">
        <div><b>1</b><strong>Descubre</strong><span>Lee una explicación breve y observa el concepto en acción.</span></div>
        <div className="how-arrow">→</div>
        <div><b>2</b><strong>Supera la misión</strong><span>Clasifica, construye, ordena o toma una decisión.</span></div>
        <div className="how-arrow">→</div>
        <div><b>3</b><strong>Enfrenta al jefe</strong><span>En los retos finales, escribe Java real y ejecútalo con Judge0.</span></div>
      </section>

      <div className="grid grid-3 how-grid">
        <section className="card how-card"><div className="how-icon">⚡</div><h2>Experiencia</h2><p>Las respuestas correctas, los retos y los niveles completados entregan XP. La XP abre nuevas misiones.</p></section>
        <section className="card how-card"><div className="how-icon">★★★</div><h2>Dominio</h2><p>Las estrellas muestran qué tan limpia fue tu mejor partida: sin errores ni pistas puedes conseguir las tres.</p></section>
        <section className="card how-card"><div className="how-icon">P00</div><h2>Pistas</h2><p>Cuando una actividad no sea clara, abre la pista de P00. Seguirás pudiendo superar la misión, aunque afectará la puntuación de estrellas de esa partida.</p></section>
      </div>

      <section className="card territory-guide">
        <div>
          <div className="kicker">El mapa</div>
          <h2>Cuatro territorios, cuatro pilares</h2>
        </div>
        <div className="territory-mini-grid">
          <div style={{ "--mini": "#36a9ff" } as React.CSSProperties}><span>◇</span><strong>Laboratorio de Modelos</strong><small>Abstracción</small></div>
          <div style={{ "--mini": "#2dd4a8" } as React.CSSProperties}><span>⬡</span><strong>Fortaleza de Datos</strong><small>Encapsulamiento</small></div>
          <div style={{ "--mini": "#f6b73c" } as React.CSSProperties}><span>⌘</span><strong>Árbol de Linajes</strong><small>Herencia</small></div>
          <div style={{ "--mini": "#a970ff" } as React.CSSProperties}><span>✦</span><strong>Arena de Formas</strong><small>Polimorfismo</small></div>
        </div>
      </section>

      <section className="card how-rules">
        <div className="kicker">Reglas rápidas</div>
        <h2>Lo importante mientras juegas</h2>
        <div className="rule-list">
          <p><b>01.</b> Puedes repetir una misión, pero la XP de esa actividad se entrega una sola vez.</p>
          <p><b>02.</b> Los niveles bloqueados muestran la experiencia necesaria para abrirlos.</p>
          <p><b>03.</b> Un reto Java solo se supera cuando el programa compila y produce la salida esperada.</p>
          <p><b>04.</b> Tu progreso, XP, intentos, mejor puntuación de estrellas y logros se guardan en Supabase.</p>
          <p><b>05.</b> Repasar una misión puede mejorar tus estrellas, pero nunca vuelve a entregar XP.</p>
          <p><b>06.</b> Al completar un territorio recuperas un Fragmento del Núcleo y desbloqueas un logro especial.</p>
          <p><b>07.</b> Los sonidos acompañan aciertos, errores y momentos importantes. Puedes silenciarlos desde la barra lateral.</p>
        </div>
      </section>

      <Link className="btn how-cta" href="/dashboard">Volver al mapa de aventura →</Link>
    </div>
  );
}
