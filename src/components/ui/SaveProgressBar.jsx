export default function SaveProgressBar({ steps, step }) {
  const current = steps[step - 1] || steps[0];
  return (
    <div className="w-full flex flex-col gap-2 py-2">
      <div className="flex justify-between text-sm text-golf-700 font-medium px-1">
        <span>{current.label}</span>
        <span>{current.pct}%</span>
      </div>
      <div className="w-full h-2 bg-golf-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-golf-600 rounded-full transition-all duration-500"
          style={{ width: `${current.pct}%` }}
        />
      </div>
    </div>
  );
}
