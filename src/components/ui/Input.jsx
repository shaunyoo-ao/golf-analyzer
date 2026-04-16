/**
 * text-base (16px) prevents iOS Safari zoom on focus.
 */
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
        <label htmlFor={id} className="text-sm font-medium text-golf-800">
          {label}
        </label>
      )}
      <input
        id={id}
        className={[
          'w-full rounded-xl border bg-white px-4 py-3 text-base text-golf-900',
          'placeholder:text-golf-400 min-h-[44px]',
          'focus:outline-none focus:ring-2 focus:ring-golf-500 focus:border-golf-500',
          error ? 'border-red-400' : 'border-golf-300',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {hint && !error && <p className="text-xs text-golf-500">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
