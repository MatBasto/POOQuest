export function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return <div className="card stat"><span className="muted">{label}</span><strong>{value}</strong>{hint && <small className="muted">{hint}</small>}</div>;
}
