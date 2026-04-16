/**
 * iOS-style toggle switch.
 */
export default function Toggle({ checked, onChange, label, id }) {
  return (
    <label
      htmlFor={id}
      className="flex items-center justify-between gap-3 cursor-pointer select-none py-1"
    >
      {label && <span className="text-sm font-medium text-golf-800">{label}</span>}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-7 w-12 shrink-0 rounded-full border-2 border-transparent',
          'transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-golf-500',
          '!min-h-0',
          checked ? 'bg-golf-600' : 'bg-gray-200',
        ].join(' ')}
      >
        <span
          className={[
            'pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow',
            'transform ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0',
          ].join(' ')}
        />
      </button>
    </label>
  );
}
