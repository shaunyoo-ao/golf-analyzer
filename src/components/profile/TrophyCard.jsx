function BallMarker({ initial }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="rgba(62,118,69,0.40)" stroke="rgba(255,255,255,0.20)" strokeWidth="2" />
      <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <text
        x="50"
        y="57"
        textAnchor="middle"
        fontSize="26"
        fontWeight="bold"
        fill="rgba(255,255,255,0.75)"
        fontFamily="-apple-system, sans-serif"
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
      className="flex flex-col items-center gap-1 w-full !min-h-0"
    >
      <div
        className="w-full aspect-square rounded-full overflow-hidden"
        style={{ border: '2px solid rgba(255,255,255,0.18)' }}
      >
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
      <p
        className="text-[10px] text-center truncate w-full leading-tight px-0.5"
        style={{ color: 'rgba(255,255,255,0.72)' }}
      >
        {trophy.courseName}
      </p>
    </button>
  );
}
