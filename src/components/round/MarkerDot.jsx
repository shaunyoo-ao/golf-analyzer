/**
 * Absolutely-positioned tappable dot on the swing image.
 * x, y are percentages (0-100) of the image container.
 */
export default function MarkerDot({ label, x, y, note, onClick }) {
  const hasNote = note && note.trim().length > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      style={{ left: `${x}%`, top: `${y}%` }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group"
    >
      {/* Dot */}
      <span
        className={[
          'flex items-center justify-center w-6 h-6 rounded-full border-2 border-white shadow-md',
          'transition-transform active:scale-110',
          hasNote ? 'bg-amber-400' : 'bg-golf-500',
        ].join(' ')}
      >
        {hasNote && (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        )}
      </span>
      {/* Label tooltip */}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-gray-900 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 group-active:opacity-100 pointer-events-none transition-opacity">
        {label}
      </span>
    </button>
  );
}
