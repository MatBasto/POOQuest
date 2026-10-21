import { Sidebar } from "./Sidebar";
export function AppShell({ children, name, xp }: { children: React.ReactNode; name: string; xp: number }) {
  return <div className="app-shell"><Sidebar name={name} xp={xp}/><main>{children}</main></div>;
}
