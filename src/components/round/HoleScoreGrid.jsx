/**
 * 18-hole grid: Par + Score + Putts per hole (GIR is entered as a single round-level average).
 */
const HOLES = Array.from({ length: 18 }, (_, i) => i + 1);

function HoleCell({ hole, data = {}, onChange }) {
  const { par = '', score = '', putts = '' } = data;
  const diff = par && score ? Number(score) - Number(par) : null;
  const scoreColor = diff == null ? 'text-golf-900' : diff < 0 ? 'text-red-600' : diff === 0 ? 'text-golf-900' : 'text-blue-600';

  return (
    <div className="flex flex-col items-center gap-0.5">
      {/* Hole number */}
      <span className="text-[9px] font-bold text-golf-600 w-full text-center leading-tight">{hole}</span>

      {/* Par */}
      <input
        type="number"
        inputMode="numeric"
        min="3"
        max="6"
        value={par}
        onChange={(e) => onChange({ ...data, par: e.target.value })}
        placeholder="P"
        className="w-full h-7 text-center text-[11px] rounded-md border border-golf-100 bg-golf-50 focus:outline-none focus:ring-1 focus:ring-golf-500 text-golf-500 px-0"
      />

      {/* Score */}
      <input
        type="number"
        inputMode="numeric"
        min="1"
        max="15"
        value={score}
        onChange={(e) => onChange({ ...data, score: e.target.value })}
        placeholder="—"
        className={`w-full h-8 text-center text-xs font-semibold rounded-md border border-golf-200 bg-white focus:outline-none focus:ring-1 focus:ring-golf-500 ${scoreColor} px-0`}
      />

      {/* Putts */}
      <input
        type="number"
        inputMode="numeric"
        min="0"
        max="6"
        value={putts}
        onChange={(e) => onChange({ ...data, putts: e.target.value })}
        placeholder="—"
        className="w-full h-8 text-center text-xs rounded-md border border-golf-200 bg-white focus:outline-none focus:ring-1 focus:ring-golf-500 text-golf-600 px-0"
      />
    </div>
  );
}

export default function HoleScoreGrid({ holes = {}, onChange }) {
  const handleHole = (holeNum, data) => {
    onChange({ ...holes, [holeNum]: data });
  };

  const front9 = HOLES.slice(0, 9);
  const back9 = HOLES.slice(9);
  const parTotal = (list) => list.reduce((a, h) => a + Number(holes[h]?.par || 0), 0);
  const parLabel = (list) => (parTotal(list) ? ` · Par ${parTotal(list)}` : '');

  return (
    <div className="flex flex-col gap-4">
      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-golf-500">
        <span className="text-golf-400">Par</span>
        <span className="font-bold text-golf-600">Score</span>
        <span className="text-golf-500">Putts</span>
      </div>

      {/* Front 9 */}
      <div>
        <p className="text-xs font-semibold text-golf-600 mb-2">Front 9 (OUT){parLabel(front9)}</p>
        <div className="grid grid-cols-9 gap-0.5">
          {front9.map((h) => (
            <HoleCell
              key={h}
              hole={h}
              data={holes[h]}
              onChange={(d) => handleHole(h, d)}
            />
          ))}
        </div>
      </div>

      {/* Back 9 */}
      <div>
        <p className="text-xs font-semibold text-golf-600 mb-2">Back 9 (IN){parLabel(back9)}</p>
        <div className="grid grid-cols-9 gap-0.5">
          {back9.map((h) => (
            <HoleCell
              key={h}
              hole={h}
              data={holes[h]}
              onChange={(d) => handleHole(h, d)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
