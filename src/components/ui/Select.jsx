export default function Select({ label, id, options = [], error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="glass-label">
          {label}
        </label>
      )}
      <select
        id={id}
        className={[
          'glass-input appearance-none',
          error ? '!border-red-400/70' : '',
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
            <option key={value} value={value} style={{ background: '#0d1f0d', color: 'rgba(255,255,255,0.92)' }}>
              {label}
            </option>
          );
        })}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
