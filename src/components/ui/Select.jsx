export default function Select({ label, id, options = [], error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-golf-800">
          {label}
        </label>
      )}
      <select
        id={id}
        className={[
          'w-full rounded-xl border bg-white px-4 py-3 text-base text-golf-900',
          'min-h-[44px] focus:outline-none focus:ring-2 focus:ring-golf-500 focus:border-golf-500',
          'appearance-none',
          error ? 'border-red-400' : 'border-golf-300',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const label = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
