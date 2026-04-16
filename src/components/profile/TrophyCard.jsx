import { formatDate } from '../../utils/dateHelpers';

function BallMarker({ initial }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#e8f0e8" stroke="#3d6b3d" strokeWidth="3" />
      <circle cx="50" cy="50" r="36" fill="none" stroke="#3d6b3d" strokeWidth="1.5" opacity="0.4" />
      <circle cx="50" cy="50" r="22" fill="none" stroke="#3d6b3d" strokeWidth="1" opacity="0.25" />
      {/* Decorative lines */}
      <line x1="50" y1="14" x2="50" y2="22" stroke="#3d6b3d" strokeWidth="1.5" opacity="0.4" />
      <line x1="50" y1="78" x2="50" y2="86" stroke="#3d6b3d" strokeWidth="1.5" opacity="0.4" />
      <line x1="14" y1="50" x2="22" y2="50" stroke="#3d6b3d" strokeWidth="1.5" opacity="0.4" />
      <line x1="78" y1="50" x2="86" y2="50" stroke="#3d6b3d" strokeWidth="1.5" opacity="0.4" />
      <text
        x="50"
        y="56"
        textAnchor="middle"
        fontSize="22"
        fontWeight="bold"
        fill="#3d6b3d"
        fontFamily="serif"
      >
        {initial}
      </text>
    </svg>
  );
}

export default function TrophyCard({ trophy, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-stretch rounded-xl overflow-hidden border border-golf-100 bg-white active:bg-golf-50 text-left w-full"
    >
      {/* 1:1 image area */}
      <div className="aspect-square w-full overflow-hidden bg-golf-50">
        {trophy.imageUrl ? (
          <img
            src={trophy.imageUrl}
            alt={trophy.courseName}
            className="w-full h-full object-cover"
          />
        ) : (
          <BallMarker initial={(trophy.courseName?.[0] || '?').toUpperCase()} />
        )}
      </div>
      {/* Info */}
      <div className="p-1.5 flex flex-col gap-0.5">
        <p className="text-[11px] font-semibold text-golf-900 leading-tight truncate">
          {trophy.courseName}
        </p>
        <p className="text-[9px] text-golf-500 truncate">{trophy.country}</p>
        <p className="text-[9px] text-golf-400">{trophy.date ? formatDate(trophy.date) : ''}</p>
        <p className="text-xs font-bold text-golf-800">{trophy.bestScore}</p>
      </div>
    </button>
  );
}
