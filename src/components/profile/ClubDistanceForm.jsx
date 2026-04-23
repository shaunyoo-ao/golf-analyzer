import { WOODS, HYBRIDS, IRONS, WEDGES } from '../../utils/constants';

function ClubInput({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs w-28 shrink-0" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min="0"
        max="400"
        value={value || ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
        placeholder="m"
        className="glass-input !py-2 !px-3 flex-1 !w-auto"
        style={{ minHeight: 40 }}
      />
    </div>
  );
}

function WedgeInput({ label, data = {}, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val });
  return (
    <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
      <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      <div className="grid grid-cols-3 gap-2">
        {[['loft', '°', 'Loft (°)', 30, 70], ['full', 'm', 'Full (m)', 0, 200], ['half', 'm', 'Half (m)', 0, 200]].map(([key, , lbl, min, max]) => (
          <div key={key}>
            <label className="text-[10px] block mb-1" style={{ color: 'var(--text-secondary)' }}>{lbl}</label>
            <input
              type="number"
              inputMode="numeric"
              min={min}
              max={max}
              value={data[key] || ''}
              onChange={(e) => set(key, e.target.value ? Number(e.target.value) : '')}
              placeholder={key === 'loft' ? '°' : 'm'}
              className="glass-input !py-2 !px-2 !w-full"
              style={{ minHeight: 40 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandInput({ value, onChange }) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Brand / Model (e.g. TaylorMade Qi10)"
      className="glass-input !mb-2"
    />
  );
}

function SectionHeader({ label }) {
  return (
    <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--text-secondary)' }}>
      {label}
    </p>
  );
}

export default function ClubDistanceForm({ distances = {}, onChange, brands = {}, onBrandsChange }) {
  const set = (key, val) => onChange({ ...distances, [key]: val });
  const setBrand = (key, val) => onBrandsChange({ ...brands, [key]: val });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Enter carry distances in meters (m).</p>

      {/* Driver */}
      <div>
        <SectionHeader label="Driver" />
        <BrandInput value={brands.driver} onChange={(v) => setBrand('driver', v)} />
        <ClubInput label="Driver" value={distances['Driver']} onChange={(v) => set('Driver', v)} />
      </div>

      {/* Woods */}
      <div>
        <SectionHeader label="Woods" />
        <BrandInput value={brands.woods} onChange={(v) => setBrand('woods', v)} />
        <div className="flex flex-col gap-2">
          {WOODS.map((club) => (
            <ClubInput key={club} label={club} value={distances[club]} onChange={(v) => set(club, v)} />
          ))}
        </div>
      </div>

      {/* Hybrids */}
      <div>
        <SectionHeader label="Hybrids" />
        <BrandInput value={brands.hybrids} onChange={(v) => setBrand('hybrids', v)} />
        <div className="flex flex-col gap-2">
          {HYBRIDS.map((club) => (
            <ClubInput key={club} label={club} value={distances[club]} onChange={(v) => set(club, v)} />
          ))}
        </div>
      </div>

      {/* Irons (includes PW) */}
      <div>
        <SectionHeader label="Irons" />
        <BrandInput value={brands.irons} onChange={(v) => setBrand('irons', v)} />
        <div className="flex flex-col gap-2">
          {IRONS.map((club) => (
            <ClubInput key={club} label={club} value={distances[club]} onChange={(v) => set(club, v)} />
          ))}
        </div>
      </div>

      {/* Wedges */}
      <div>
        <SectionHeader label="Wedges" />
        <BrandInput value={brands.wedges} onChange={(v) => setBrand('wedges', v)} />
        <div className="flex flex-col gap-3">
          {WEDGES.map((w) => (
            <WedgeInput key={w.key} label={w.label} data={distances[w.key]} onChange={(d) => set(w.key, d)} />
          ))}
        </div>
      </div>
    </div>
  );
}
