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
    <div className={`glass-card !p-0 overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-4 text-left min-h-[56px]"
      >
        <div>
          <span className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
            {title}
          </span>
          {subtitle && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {badge && badge}
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            style={{ color: 'var(--text-secondary)' }}
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
        <div className="px-4 pb-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
          <div className="pt-4">{children}</div>
        </div>
      )}
    </div>
  );
}
