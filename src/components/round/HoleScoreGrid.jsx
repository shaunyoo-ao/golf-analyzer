/**
 * 18-hole grid: Score, GIR toggle, Putts — two rows of 9.
 */
const HOLES = Array.from({ length: 18 }, (_, i) => i + 1);

function HoleCell({ hole, data = {}, onChange }) {
  const { score = '', gir = false, putts = '' } = data;

  return (
    <div className="flex flex-col items-center gap-1 min-w-[34px]">
      {/* Hole number */}
      <span className="text-[10px] font-bold text-golf-600 w-full text-center">{hole}</span>

      {/* Score */}
      <input
        type="number"
        inputMode="numeric"
        min="1"
        max="15"
        value={score}
        onChange={(e) => onChange({ score: e.target.value, gir, putts })}
        placeholder="—"
        className="w-8 h-8 text-center text-sm font-semibold rounded-lg border border-golf-200 bg-white focus:outline-none focus:ring-1 focus:ring-golf-500 text-golf-900"
      />

      {/* GIR toggle */}
      <button
        type="button"
        onClick={() => onChange({ score, gir: !gir, putts })}
        className={[
          'w-8 h-6 rounded text-[9px] font-bold border transition-colors',
          gir
            ? 'bg-golf-600 text-white border-golf-600'
            : 'bg-white text-golf-400 border-golf-200',
        ].join(' ')}
        title={gir ? 'GIR: Yes' : 'GIR: No'}
      >
        GIR
      </button>

      {/* Putts */}
      <input
        type="number"
        inputMode="numeric"
        min="0"
        max="6"
        value={putts}
        onChange={(e) => onChange({ score, gir, putts: e.target.value })}
        placeholder="—"
        className="w-8 h-8 text-center text-sm rounded-lg border border-golf-200 bg-white focus:outline-none focus:ring-1 focus:ring-golf-500 text-golf-600"
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

  return (
    <div className="flex flex-col gap-4">
      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-golf-500">
        <span className="font-bold text-golf-600">Score</span>
        <span className="text-golf-600 font-bold">GIR</span>
        <span className="text-golf-500">Putts</span>
      </div>

      {/* Front 9 */}
      <div>
        <p className="text-xs font-semibold text-golf-600 mb-2">Front 9</p>
        <div className="flex gap-1 overflow-x-auto pb-1">
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
        <p className="text-xs font-semibold text-golf-600 mb-2">Back 9</p>
        <div className="flex gap-1 overflow-x-auto pb-1">
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
