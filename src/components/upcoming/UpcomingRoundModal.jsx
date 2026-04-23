import { useState } from 'react';
import { fetchWeather } from '../../utils/weatherApi';
import { formatDate } from '../../utils/dateHelpers';
import Button from '../ui/Button';

export default function UpcomingRoundModal({ upcomingRound, onDelete, onClose }) {
  const [hours, setHours] = useState(null);
  const [weatherError, setWeatherError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const refresh = () => {
    if (!upcomingRound?.lat || !upcomingRound?.lng) return;
    setLoading(true);
    setWeatherError(null);
    fetchWeather(upcomingRound.lat, upcomingRound.lng, upcomingRound.date)
      .then((h) => { setHours(h); setLoading(false); })
      .catch(() => { setWeatherError('Weather data unavailable'); setLoading(false); });
  };

  const dayHours = hours?.filter((h) => h.time >= '06:00' && h.time <= '18:00') ?? [];

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative mt-auto w-full max-h-[90vh] rounded-t-2xl flex flex-col" style={{ background: 'rgba(10,22,10,0.96)', borderTop: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'rgba(100,200,100,0.85)' }}>Upcoming Round</p>
            <h2 className="text-base font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>{upcomingRound.courseName}</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {upcomingRound.country} · {formatDate(upcomingRound.date)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {upcomingRound.lat && (
              <button
                type="button"
                onClick={refresh}
                disabled={loading}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                style={{ color: loading ? 'rgba(255,255,255,0.25)' : 'rgba(100,200,100,0.80)' }}
              >
                <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
            <button type="button" onClick={onClose} className="text-xl p-1 !min-h-0 ml-1" style={{ color: 'var(--text-secondary)' }}>✕</button>
          </div>
        </div>

        {/* Weather content */}
        <div className="overflow-y-auto px-4 py-3 flex flex-col gap-4 pb-24">
          {!upcomingRound.lat && (
            <p className="text-sm text-center py-3" style={{ color: 'var(--text-secondary)' }}>
              📍 Course location could not be determined — weather unavailable
            </p>
          )}

          {upcomingRound.lat && !hours && !weatherError && !loading && (
            <p className="text-sm text-center py-3" style={{ color: 'var(--text-secondary)' }}>
              Tap ↻ to load weather forecast
            </p>
          )}

          {loading && (
            <p className="text-sm text-center py-3" style={{ color: 'var(--text-secondary)' }}>Loading weather…</p>
          )}

          {weatherError && (
            <p className="text-sm text-center py-3" style={{ color: 'var(--text-secondary)' }}>{weatherError}</p>
          )}

          {dayHours.length > 0 && (
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-secondary)' }}>
                Hourly Forecast · {upcomingRound.geocodedName || upcomingRound.courseName}
              </p>
              <div className="grid grid-cols-5 text-[10px] font-semibold uppercase px-2 pb-1" style={{ color: 'var(--text-secondary)' }}>
                <span>Time</span><span className="text-center">Sky</span><span className="text-center">Temp</span><span className="text-center">Rain</span><span className="text-center">Wind</span>
              </div>
              {dayHours.map((h) => (
                <div key={h.time} className="grid grid-cols-5 items-center text-xs px-2 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{h.time}</span>
                  <span className="text-center text-base">{h.icon}</span>
                  <span className="text-center font-medium" style={{ color: 'var(--text-primary)' }}>{h.temp}°</span>
                  <span className="text-center" style={{ color: h.precip >= 50 ? 'rgba(100,160,255,0.90)' : 'var(--text-secondary)' }}>{h.precip}%</span>
                  <span className="text-center" style={{ color: 'var(--text-secondary)' }}>{h.wind}km/h</span>
                </div>
              ))}
              <p className="text-[10px] text-right mt-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Powered by Open-Meteo (open-meteo.com)
              </p>
            </div>
          )}

          {/* Delete */}
          {confirmDelete ? (
            <div className="flex gap-2 mt-2">
              <Button fullWidth variant="ghost" onClick={() => setConfirmDelete(false)}>Cancel</Button>
              <Button fullWidth onClick={onDelete} className="bg-red-500 hover:bg-red-600 text-white">Yes, Delete</Button>
            </div>
          ) : (
            <Button fullWidth variant="ghost" onClick={() => setConfirmDelete(true)}>Delete Upcoming Round</Button>
          )}
        </div>
      </div>
    </div>
  );
}
