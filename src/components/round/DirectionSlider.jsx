/**
 * Horizontal directional slider: Hook/Pull ←——→ Straight ←——→ Slice/Push
 * Range: -5 (hard left) to +5 (hard right). Default 0 = Straight.
 * No text input — slider only.
 */
export default function DirectionSlider({ clubName, value = 0, onChange }) {
  const labels = {
    '-5': 'Strong Hook',
    '-4': 'Hook',
    '-3': 'Draw',
    '-2': 'Slight Draw',
    '-1': 'Slight Left',
    '0': 'Straight',
    '1': 'Slight Right',
    '2': 'Slight Fade',
    '3': 'Fade',
    '4': 'Slice',
    '5': 'Strong Slice',
  };

  const numVal = Number(value);
  const isLeft = numVal < 0;
  const isRight = numVal > 0;
  const isCenter = numVal === 0;

  return (
    <div className="py-2">
      {clubName && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-golf-800">{clubName}</span>
          <span
            className={[
              'text-xs font-medium px-2 py-0.5 rounded-full',
              isLeft ? 'bg-blue-100 text-blue-700' :
              isRight ? 'bg-orange-100 text-orange-700' :
              'bg-golf-100 text-golf-700',
            ].join(' ')}
          >
            {labels[String(numVal)]}
          </span>
        </div>
      )}

      {/* Label row */}
      <div className="flex justify-between text-[10px] text-gray-400 mb-1 px-1">
        <span>Hook / Pull</span>
        <span>Straight</span>
        <span>Slice / Push</span>
      </div>

      {/* Slider track wrapper */}
      <div className="relative">
        <input
          type="range"
          min="-5"
          max="5"
          step="1"
          value={numVal}
          onChange={(e) => onChange(Number(e.target.value))}
          className="direction-slider w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: buildGradient(numVal),
          }}
        />
        {/* Center tick mark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 bg-gray-300 pointer-events-none rounded-full" />
      </div>

      {/* Tick labels */}
      <div className="flex justify-between text-[9px] text-gray-300 mt-1 px-0.5">
        <span>-5</span>
        <span className="text-gray-400">0</span>
        <span>+5</span>
      </div>
    </div>
  );
}

function buildGradient(val) {
  // Convert -5..+5 to 0..100%
  const pct = ((val + 5) / 10) * 100;
  const left = '#93c5fd';   // blue-300 for hook/left
  const center = '#86efac'; // green-300 for straight
  const right = '#fdba74';  // orange-300 for slice/right

  if (val < 0) {
    return `linear-gradient(to right, ${left} 0%, ${center} ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`;
  }
  if (val > 0) {
    return `linear-gradient(to right, #e5e7eb 0%, #e5e7eb 50%, ${center} 50%, ${right} ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`;
  }
  return `linear-gradient(to right, #e5e7eb 0%, ${center} 50%, #e5e7eb 100%)`;
}
