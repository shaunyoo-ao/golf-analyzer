import { useState } from 'react';
import { useData } from '../context/DataContext';
import { golfExperienceMonths } from '../utils/dateHelpers';
import { handicapIndex as computeHandicapIndex } from '../utils/handicap';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useUpcomingRound } from '../hooks/useUpcomingRound';
import UpcomingRoundSlot from '../components/upcoming/UpcomingRoundSlot';
import UpcomingRoundModal from '../components/upcoming/UpcomingRoundModal';

function mean(arr) {
  const v = arr.filter((x) => x != null && !isNaN(x));
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
}

function trend(values, higherIsBetter) {
  if (values.length < 6) return null;
  const mid = Math.floor(values.length / 2);
  const r = mean(values.slice(0, mid));
  const o = mean(values.slice(mid));
  if (r == null || o == null || Math.abs(r - o) < 0.3) return null;
  return higherIsBetter ? r > o : r < o;
}

function StatCard({ label, value, trendVal }) {
  return (
    <div className="glass-card !p-3 !rounded-2xl flex flex-col items-center min-w-0 gap-0.5">
      <span className="text-xl font-black leading-tight" style={{ color: 'var(--text-primary)' }}>
        {value ?? '—'}
      </span>
      <span className="text-[10px] text-center leading-tight" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
      {trendVal != null && (
        <span className={`text-xs leading-none ${trendVal ? 'text-green-400' : 'text-red-400'}`}>
          {trendVal ? '↗' : '↘'}
        </span>
      )}
    </div>
  );
}

function ScoreTrendChart({ data, startDate, endDate }) {
  const PAD = { t: 10, r: 8, b: 22, l: 26 };
  const W = 320, H = 120;
  const cW = W - PAD.l - PAD.r;
  const cH = H - PAD.t - PAD.b;

  const startMs = new Date(startDate).getTime();
  const endMs = new Date(endDate).getTime();
  const spanMs = endMs - startMs;

  const sc = data.map((d) => d.score);
  const lo = Math.floor(Math.min(...sc) / 5) * 5 - 5;
  const hi = Math.ceil(Math.max(...sc) / 5) * 5 + 5;

  const xS = (dateStr) => PAD.l + ((new Date(dateStr).getTime() - startMs) / spanMs) * cW;
  const yS = (v) => PAD.t + cH - ((v - lo) / (hi - lo)) * cH;

  const avgScore = Math.round(data.reduce((a, d) => a + d.score, 0) / data.length);
  const avgY = yS(avgScore);
  const pts = data.map((d) => `${xS(d.date)},${yS(d.score)}`).join(' ');

  const yTicks = [];
  for (let v = Math.ceil(lo / 10) * 10; v <= hi; v += 10) yTicks.push(v);

  const totalMonths = Math.round(spanMs / (30.44 * 24 * 3600 * 1000));
  const step = totalMonths <= 6 ? 1 : totalMonths <= 12 ? 2 : 4;
  const xLabels = [];
  const cur = new Date(startDate);
  cur.setDate(1);
  while (cur.getTime() <= endMs) {
    const x = xS(cur.toISOString().slice(0, 10));
    if (x >= PAD.l && x <= W - PAD.r) {
      xLabels.push({
        x,
        label: `${cur.getFullYear()}.${String(cur.getMonth() + 1).padStart(2, '0')}`,
      });
    }
    cur.setMonth(cur.getMonth() + step);
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={PAD.l} y1={yS(v)} x2={W - PAD.r} y2={yS(v)} stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />
          <text x={PAD.l - 3} y={yS(v) + 3.5} fontSize={8} textAnchor="end" fill="rgba(255,255,255,0.35)">{v}</text>
        </g>
      ))}
      <line x1={PAD.l} y1={avgY} x2={W - PAD.r} y2={avgY}
        stroke="rgba(100,200,100,0.55)" strokeWidth={1.5} strokeDasharray="4,3" />
      {data.length >= 2 && (
        <polyline points={pts} fill="none" stroke="rgba(100,200,100,0.85)" strokeWidth={2}
          strokeLinecap="round" strokeLinejoin="round" />
      )}
      {data.map((d, i) => (
        <circle key={i} cx={xS(d.date)} cy={yS(d.score)} r={3.5}
          fill="#0d1f0d" stroke="rgba(100,200,100,0.85)" strokeWidth={1.5} />
      ))}
      {xLabels.map(({ x, label }) => (
        <text key={label} x={x} y={H - 4} fontSize={7} textAnchor="middle" fill="rgba(255,255,255,0.35)">{label}</text>
      ))}
    </svg>
  );
}

const PERIOD_MONTHS = { '6m': 6, '12m': 12, '24m': 24 };

export default function Dashboard() {
  const { profile, profileLoading, rounds, roundsLoading, hasLoaded } = useData();
  const [period, setPeriod] = useState('6m');
  const { upcomingRound, deleteUpcomingRound } = useUpcomingRound();
  const [showUpcomingModal, setShowUpcomingModal] = useState(false);

  if (!hasLoaded && (profileLoading || roundsLoading)) return <LoadingSpinner />;

  const todayStr = new Date().toISOString().slice(0, 10);
  const activeUpcoming = upcomingRound?.date >= todayStr ? upcomingRound : null;

  const handicapIndex = computeHandicapIndex(rounds) ?? profile?.handicapIndex;
  const expMonths = golfExperienceMonths(profile?.golfStartDate);

  const scores = rounds.map((r) => Number(r.totalScore)).filter(Boolean);
  const bestScore = scores.length ? Math.min(...scores) : null;

  // Avg. stats: last 6 months only
  const sixMoCutoff = new Date();
  sixMoCutoff.setMonth(sixMoCutoff.getMonth() - 6);
  const sixMoStr = sixMoCutoff.toISOString().slice(0, 10);
  const recentRounds = rounds.filter((r) => r.date >= sixMoStr);

  const recentScores = recentRounds.map((r) => Number(r.totalScore)).filter(Boolean);
  const avgScore = recentScores.length ? Math.round(mean(recentScores)) : null;

  const driveVals = recentRounds.map((r) => r.longestDriveMeter ? Number(r.longestDriveMeter) : null).filter(Boolean);
  const lostVals = recentRounds.map((r) => (r.lostBalls != null && r.lostBalls !== '') ? Number(r.lostBalls) : null).filter((v) => v !== null);
  const girVals = recentRounds.map((r) => r.avgGir ? Number(r.avgGir) : null).filter(Boolean);
  const puttsVals = recentRounds.map((r) => {
    const hv = Object.values(r.holes || {}).filter((h) => h?.putts);
    return hv.length >= 9 ? hv.reduce((a, h) => a + Number(h.putts || 0), 0) / hv.length : null;
  }).filter((v) => v !== null);

  const mDrive = mean(driveVals);
  const mLost = mean(lostVals);
  const mGir = mean(girVals);
  const mPutts = mean(puttsVals);

  // Chart: filter by selected period, date-positioned
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - PERIOD_MONTHS[period]);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const chartData = [...rounds]
    .filter((r) => r.totalScore && r.date && r.date >= cutoffStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((r) => ({ date: r.date, score: Number(r.totalScore) }));

  return (
    <div className="flex flex-col gap-4">
      {/* Upcoming Round slot */}
      {activeUpcoming && (
        <UpcomingRoundSlot upcomingRound={activeUpcoming} onClick={() => setShowUpcomingModal(true)} />
      )}

      {/* Upcoming Round modal */}
      {showUpcomingModal && activeUpcoming && (
        <UpcomingRoundModal
          upcomingRound={activeUpcoming}
          onDelete={async () => { await deleteUpcomingRound(); setShowUpcomingModal(false); }}
          onClose={() => setShowUpcomingModal(false)}
        />
      )}

      {/* Handicap card */}
      <div className="glass-card text-center py-6">
        <p className="text-sm font-medium uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
          Handicap Index
        </p>
        <p className="text-6xl font-black mt-2" style={{ color: 'var(--text-primary)' }}>
          {handicapIndex != null ? handicapIndex : '—'}
        </p>
        {handicapIndex == null && (
          <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>Log 8+ rounds to unlock</p>
        )}
      </div>

      {/* Stats grid — 4×2 */}
      <div className="grid grid-cols-4 gap-2">
        <StatCard label={`Exp.\n(months)`} value={expMonths} />
        <StatCard label="Rounds" value={rounds.length} />
        <StatCard label="Best Score" value={bestScore} />
        <StatCard label="Avg. Score" value={avgScore} />
        <StatCard
          label="Avg. Driver (m)"
          value={mDrive != null ? Math.round(mDrive) : null}
          trendVal={trend(driveVals, true)}
        />
        <StatCard
          label="Avg. GIR %"
          value={mGir != null ? `${Math.round(mGir)}%` : null}
          trendVal={trend(girVals, true)}
        />
        <StatCard
          label="Avg. Putts"
          value={mPutts != null ? mPutts.toFixed(1) : null}
          trendVal={trend(puttsVals, false)}
        />
        <StatCard
          label="Avg. Lost"
          value={mLost != null ? mLost.toFixed(1) : null}
          trendVal={trend(lostVals, false)}
        />
      </div>

      {/* Score Trend chart */}
      <div>
        <p className="text-[10px] text-right mb-1" style={{ color: 'var(--text-secondary)' }}>
          * Avg. values based on last 6 months
        </p>
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>
          Cumulative Trends
        </p>
        <div className="flex gap-1 mb-2">
          {['6m', '12m', '24m'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`flex-1 text-xs py-1.5 rounded-lg font-semibold transition-colors ${
                period === p ? 'btn-glass' : ''
              }`}
              style={period !== p ? { color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' } : {}}
            >
              {p === '6m' ? '6 Months' : p === '12m' ? '12 Months' : '24 Months'}
            </button>
          ))}
        </div>
        <Card className="py-3 px-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-center mb-2" style={{ color: 'var(--text-secondary)' }}>
            Score Trend
          </p>
          {chartData.length >= 1
            ? <ScoreTrendChart key={period} data={chartData} startDate={cutoffStr} endDate={todayStr} />
            : <p className="text-xs text-center py-4" style={{ color: 'var(--text-secondary)' }}>Not enough data for this period</p>
          }
        </Card>
      </div>

      {rounds.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-4xl mb-2">🏌️</p>
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>No rounds yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Log your first round to get started</p>
        </Card>
      )}
    </div>
  );
}
