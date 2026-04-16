import Input from '../ui/Input';
import { WOODS, HYBRIDS, IRONS, WEDGES } from '../../utils/constants';

function ClubInput({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-golf-700 w-28 shrink-0">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min="0"
        max="400"
        value={value || ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
        placeholder="m"
        className="w-full rounded-lg border border-golf-200 bg-white px-3 py-2 text-base text-golf-900 min-h-[40px] focus:outline-none focus:ring-1 focus:ring-golf-500"
      />
    </div>
  );
}

function WedgeInput({ label, data = {}, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val });
  return (
    <div className="bg-golf-50 rounded-xl p-3 border border-golf-100">
      <p className="text-xs font-semibold text-golf-700 mb-2">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[10px] text-golf-500 block mb-1">Loft (°)</label>
          <input
            type="number"
            inputMode="numeric"
            min="30"
            max="70"
            value={data.loft || ''}
            onChange={(e) => set('loft', e.target.value ? Number(e.target.value) : '')}
            placeholder="°"
            className="w-full rounded-lg border border-golf-200 bg-white px-2 py-2 text-base text-golf-900 min-h-[40px] focus:outline-none focus:ring-1 focus:ring-golf-500"
          />
        </div>
        <div>
          <label className="text-[10px] text-golf-500 block mb-1">Full (m)</label>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            max="200"
            value={data.full || ''}
            onChange={(e) => set('full', e.target.value ? Number(e.target.value) : '')}
            placeholder="m"
            className="w-full rounded-lg border border-golf-200 bg-white px-2 py-2 text-base text-golf-900 min-h-[40px] focus:outline-none focus:ring-1 focus:ring-golf-500"
          />
        </div>
        <div>
          <label className="text-[10px] text-golf-500 block mb-1">Half (m)</label>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            max="200"
            value={data.half || ''}
            onChange={(e) => set('half', e.target.value ? Number(e.target.value) : '')}
            placeholder="m"
            className="w-full rounded-lg border border-golf-200 bg-white px-2 py-2 text-base text-golf-900 min-h-[40px] focus:outline-none focus:ring-1 focus:ring-golf-500"
          />
        </div>
      </div>
    </div>
  );
}

export default function ClubDistanceForm({ distances = {}, onChange }) {
  const set = (key, val) => onChange({ ...distances, [key]: val });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-golf-500">Enter carry distances in meters (m).</p>

      {/* Woods */}
      <div>
        <p className="text-xs font-bold text-golf-600 uppercase tracking-wide mb-2">Woods</p>
        <div className="flex flex-col gap-2">
          {WOODS.map((club) => (
            <ClubInput
              key={club}
              label={club}
              value={distances[club]}
              onChange={(v) => set(club, v)}
            />
          ))}
        </div>
      </div>

      {/* Hybrids */}
      <div>
        <p className="text-xs font-bold text-golf-600 uppercase tracking-wide mb-2">Hybrids</p>
        <div className="flex flex-col gap-2">
          {HYBRIDS.map((club) => (
            <ClubInput
              key={club}
              label={club}
              value={distances[club]}
              onChange={(v) => set(club, v)}
            />
          ))}
        </div>
      </div>

      {/* Irons */}
      <div>
        <p className="text-xs font-bold text-golf-600 uppercase tracking-wide mb-2">Irons</p>
        <div className="flex flex-col gap-2">
          {IRONS.map((club) => (
            <ClubInput
              key={club}
              label={club}
              value={distances[club]}
              onChange={(v) => set(club, v)}
            />
          ))}
        </div>
      </div>

      {/* Wedges */}
      <div>
        <p className="text-xs font-bold text-golf-600 uppercase tracking-wide mb-2">Wedges</p>
        <div className="flex flex-col gap-3">
          {WEDGES.map((w) => (
            <WedgeInput
              key={w.key}
              label={w.label}
              data={distances[w.key]}
              onChange={(d) => set(w.key, d)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
