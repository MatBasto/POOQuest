export function ProgressBar({ value }: { value: number }) {
  const safe = Math.max(0, Math.min(100, Math.round(value)));
  return <div className="progress" aria-label={`Progreso ${safe}%`}><span style={{ width: `${safe}%` }} /></div>;
}
