import { Sidebar } from "./Sidebar";
import { AdventureOnboarding } from "@/components/game/AdventureOnboarding";

export function AppShell({ children, name, xp }: { children: React.ReactNode; name: string; xp: number }) {
  return (
    <div className="app-shell">
      <Sidebar name={name} xp={xp} />
      <main className="app-main">{children}</main>
      <AdventureOnboarding name={name} />
    </div>
  );
}
