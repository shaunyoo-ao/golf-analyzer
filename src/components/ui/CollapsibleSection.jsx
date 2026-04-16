import { useState } from 'react';

export default function CollapsibleSection({
  title,
  subtitle,
  badge,
  defaultOpen = false,
  className = '',
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`border border-golf-200 rounded-2xl overflow-hidden bg-white ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-4 text-left min-h-[56px]"
      >
        <div>
          <span className="font-semibold text-golf-900 text-base">{title}</span>
          {subtitle && (
            <p className="text-xs text-golf-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {badge && badge}
          <svg
            className={`w-5 h-5 text-golf-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-golf-100">
          <div className="pt-4">{children}</div>
        </div>
      )}
    </div>
  );
}
