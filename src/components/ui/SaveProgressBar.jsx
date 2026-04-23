export default function SaveProgressBar({ steps, step }) {
  const current = steps[step - 1] || steps[0];
  return (
    <div className="w-full flex flex-col gap-2 py-2">
      <div className="flex justify-between text-sm font-medium px-1" style={{ color: 'var(--text-secondary)' }}>
        <span>{current.label}</span>
        <span>{current.pct}%</span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.10)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${current.pct}%`, background: 'var(--accent-green)' }}
        />
      </div>
    </div>
  );
}
