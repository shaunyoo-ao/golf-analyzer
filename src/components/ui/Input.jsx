export default function Input({
  label,
  id,
  hint,
  error,
  className = '',
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="glass-label">
          {label}
        </label>
      )}
      <input
        id={id}
        className={[
          'glass-input',
          error ? '!border-red-400/70' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {hint && !error && <p className="glass-hint">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
