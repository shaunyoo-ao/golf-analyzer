import { useEffect, useState } from 'react';
import { fetchWeather, wmoIcon } from '../../utils/weatherApi';
import { formatDate } from '../../utils/dateHelpers';

export default function UpcomingRoundSlot({ upcomingRound, onClick }) {
  const [precipIcon, setPrecipIcon] = useState(null);
  const [maxPrecip, setMaxPrecip] = useState(null);

  useEffect(() => {
    if (!upcomingRound?.lat || !upcomingRound?.lng) return;
    fetchWeather(upcomingRound.lat, upcomingRound.lng, upcomingRound.date)
      .then((hours) => {
        const dayHours = hours.filter((h) => h.time >= '06:00' && h.time <= '18:00');
        const sample = dayHours[Math.floor(dayHours.length / 2)] || hours[6];
        const maxP = Math.max(...dayHours.map((h) => h.precip ?? 0));
        setPrecipIcon(sample?.icon ?? '🌡');
        setMaxPrecip(maxP);
      })
      .catch(() => {});
  }, [upcomingRound]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl px-4 py-2.5 flex items-center gap-3 text-left"
      style={{ background: 'rgba(100,200,100,0.12)', border: '1px solid rgba(100,200,100,0.28)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      <span className="text-xl shrink-0">⛳</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{upcomingRound.courseName}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          {formatDate(upcomingRound.date)}
          {precipIcon && <span className="ml-1.5">{precipIcon}</span>}
          {maxPrecip != null && <span className="ml-0.5">{maxPrecip}%</span>}
        </p>
      </div>
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--text-secondary)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
