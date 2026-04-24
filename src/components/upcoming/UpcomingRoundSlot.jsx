import { useEffect, useState } from 'react';
import { fetchWeather } from '../../utils/weatherApi';
import { formatDate, dayOfWeek } from '../../utils/dateHelpers';

export default function UpcomingRoundSlot({ upcomingRound, onClick }) {
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [highTemp, setHighTemp] = useState(null);
  const [lowTemp, setLowTemp] = useState(null);
  const [maxPrecip, setMaxPrecip] = useState(null);

  useEffect(() => {
    if (!upcomingRound?.lat || !upcomingRound?.lng) return;
    fetchWeather(upcomingRound.lat, upcomingRound.lng, upcomingRound.date)
      .then((hours) => {
        const dayHours = hours.filter((h) => h.time >= '06:00' && h.time <= '18:00');
        if (!dayHours.length) return;
        const mid = dayHours[Math.floor(dayHours.length / 2)];
        setWeatherIcon(mid?.icon ?? null);
        setHighTemp(Math.round(Math.max(...dayHours.map((h) => h.temp ?? -99))));
        setLowTemp(Math.round(Math.min(...dayHours.map((h) => h.temp ?? 99))));
        setMaxPrecip(Math.max(...dayHours.map((h) => h.precip ?? 0)));
      })
      .catch(() => {});
  }, [upcomingRound]);

  const hasWeather = weatherIcon != null && highTemp != null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl px-4 py-2.5 flex items-center gap-3 text-left"
      style={{ background: 'rgba(100,200,100,0.12)', border: '1px solid rgba(100,200,100,0.28)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
          <span className="font-semibold" style={{ color: 'rgba(100,200,100,0.85)' }}>{dayOfWeek(upcomingRound.date)} </span>
          🏌️‍♂️ {upcomingRound.courseName}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          {formatDate(upcomingRound.date)}
          {hasWeather && <span> {weatherIcon} High {highTemp} Low {lowTemp} {maxPrecip}%</span>}
        </p>
      </div>
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--text-secondary)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
