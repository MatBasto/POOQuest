import { Sidebar } from "./Sidebar";
import { AdventureOnboarding } from "@/components/game/AdventureOnboarding";

export function AppShell({ children, name, xp }: { children: React.ReactNode; name: string; xp: number }) {
  return (
    <div className="app-shell">
      <a href="#contenido-principal" className="skip-to-content">Saltar al contenido principal</a>
      <Sidebar name={name} xp={xp} />
      <main className="app-main" id="contenido-principal" tabIndex={-1}>{children}</main>
      <AdventureOnboarding name={name} />
    </div>
  );
}
