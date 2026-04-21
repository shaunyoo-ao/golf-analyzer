import { useState } from 'react';
import { useData } from '../context/DataContext';
import { golfExperienceMonths } from '../utils/dateHelpers';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';

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
    <div className="flex flex-col items-center bg-golf-800 rounded-2xl p-3 border border-golf-700 min-w-0 gap-0.5">
      <span className="text-xl font-black text-white leading-tight">{value ?? '—'}</span>
      <span className="text-[10px] text-golf-400 text-center leading-tight">{label}</span>
      {trendVal != null && (
        <span className={`text-xs leading-none ${trendVal ? 'text-green-400' : 'text-red-400'}`}>
          {trendVal ? '↗' : '↘'}
        </span>
      )}
    </div>
  );
}

function ScoreTrendChart({ data, avgScore }) {
  if (data.length < 2) return null;
  const PAD = { t: 10, r: 8, b: 22, l: 26 };
  const W = 320, H = 120;
  const cW = W - PAD.l - PAD.r;
  const cH = H - PAD.t - PAD.b;

  const sc = data.map((d) => d.score);
  const lo = Math.floor(Math.min(...sc) / 5) * 5 - 5;
  const hi = Math.ceil(Math.max(...sc) / 5) * 5 + 5;

  const xS = (i) => PAD.l + (i / (data.length - 1)) * cW;
  const yS = (v) => PAD.t + cH - ((v - lo) / (hi - lo)) * cH;

  const pts = data.map((d, i) => `${xS(i)},${yS(d.score)}`).join(' ');
  const avgY = yS(avgScore);

  const yTicks = [];
  for (let v = Math.ceil(lo / 10) * 10; v <= hi; v += 10) yTicks.push(v);

  const xLabels = [];
  const seen = new Set();
  data.forEach((d, i) => {
    const m = d.date?.slice(0, 7)?.replace('-', '.');
    if (m && !seen.has(m)) { seen.add(m); xLabels.push({ x: xS(i), label: m }); }
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={PAD.l} y1={yS(v)} x2={W - PAD.r} y2={yS(v)} stroke="#1e3a1e" strokeWidth={0.5} />
          <text x={PAD.l - 3} y={yS(v) + 3.5} fontSize={8} textAnchor="end" fill="#4a7a4a">{v}</text>
        </g>
      ))}
      <line x1={PAD.l} y1={avgY} x2={W - PAD.r} y2={avgY}
        stroke="#6db36d" strokeWidth={1.5} strokeDasharray="4,3" />
      <polyline points={pts} fill="none" stroke="#a8e6a8" strokeWidth={2}
        strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => (
        <circle key={i} cx={xS(i)} cy={yS(d.score)} r={3.5}
          fill="#0d1f0d" stroke="#a8e6a8" strokeWidth={1.5} />
      ))}
      {xLabels.map(({ x, label }) => (
        <text key={label} x={x} y={H - 4} fontSize={7} textAnchor="middle" fill="#4a7a4a">{label}</text>
      ))}
    </svg>
  );
}

const PERIOD_MONTHS = { '6m': 6, '12m': 12, '24m': 24 };

export default function Dashboard() {
  const { profile, profileLoading, rounds, roundsLoading, hasLoaded } = useData();
  const [period, setPeriod] = useState('12m');

  if (!hasLoaded && (profileLoading || roundsLoading)) return <LoadingSpinner />;

  const handicapIndex = profile?.handicapIndex;
  const expMonths = golfExperienceMonths(profile?.golfStartDate);

  const scores = rounds.map((r) => Number(r.totalScore)).filter(Boolean);
  const avgScore = scores.length ? Math.round(mean(scores)) : null;
  const bestScore = scores.length ? Math.min(...scores) : null;

  const driveVals = rounds.map((r) => r.longestDriveMeter ? Number(r.longestDriveMeter) : null).filter(Boolean);
  const lostVals = rounds.map((r) => (r.lostBalls != null && r.lostBalls !== '') ? Number(r.lostBalls) : null).filter((v) => v !== null);
  const girVals = rounds.map((r) => r.avgGir ? Number(r.avgGir) : null).filter(Boolean);
  const puttsVals = rounds.map((r) => {
    const hv = Object.values(r.holes || {}).filter((h) => h?.putts);
    return hv.length >= 9 ? hv.reduce((a, h) => a + Number(h.putts || 0), 0) / hv.length : null;
  }).filter((v) => v !== null);

  const mDrive = mean(driveVals);
  const mLost = mean(lostVals);
  const mGir = mean(girVals);
  const mPutts = mean(puttsVals);

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - PERIOD_MONTHS[period]);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const chartData = [...rounds]
    .filter((r) => r.totalScore && r.date && r.date >= cutoffStr)
    .slice(0, 20)
    .reverse()
    .map((r) => ({ date: r.date, score: Number(r.totalScore) }));

  return (
    <div className="flex flex-col gap-4">
      {/* Handicap card */}
      <Card className="bg-golf-700 border-golf-600 text-center py-6">
        <p className="text-golf-300 text-sm font-medium uppercase tracking-wide">
          Handicap Index
        </p>
        <p className="text-6xl font-black text-white mt-2">
          {handicapIndex != null ? handicapIndex : '—'}
        </p>
        {handicapIndex == null && (
          <p className="text-golf-400 text-xs mt-2">Log 8+ rounds to unlock</p>
        )}
      </Card>

      {/* Stats grid — 4×2 */}
      <div className="grid grid-cols-4 gap-2">
        <StatCard label="Rounds" value={rounds.length} />
        <StatCard label="Avg. Score" value={avgScore} />
        <StatCard label="Best Score" value={bestScore} />
        <StatCard label={`Exp.\n(months)`} value={expMonths} />
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
        <p className="text-xs font-bold text-golf-400 uppercase tracking-widest mb-2">
          Cumulative Trends
        </p>
        {/* Period toggle */}
        <div className="flex gap-1 mb-2">
          {['6m', '12m', '24m'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`flex-1 text-xs py-1.5 rounded-lg font-semibold transition-colors ${
                period === p
                  ? 'bg-golf-600 text-white'
                  : 'bg-golf-800 text-golf-400 border border-golf-700'
              }`}
            >
              {p === '6m' ? '6 Months' : p === '12m' ? '12 Months' : '24 Months'}
            </button>
          ))}
        </div>
        <Card className="bg-golf-800 border-golf-700 py-3 px-2">
          <p className="text-[10px] font-bold text-golf-400 uppercase tracking-widest text-center mb-2">
            Score Trend
          </p>
          {chartData.length >= 2
            ? <ScoreTrendChart data={chartData} avgScore={avgScore} />
            : <p className="text-xs text-golf-500 text-center py-4">Not enough data for this period</p>
          }
        </Card>
      </div>

      {rounds.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-4xl mb-2">🏌️</p>
          <p className="text-golf-700 font-medium">No rounds yet</p>
          <p className="text-golf-400 text-sm mt-1">Log your first round to get started</p>
        </Card>
      )}
    </div>
  );
}
