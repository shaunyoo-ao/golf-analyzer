import { useState } from 'react';
import { COUNTRIES } from '../../utils/constants';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const COUNTRY_OPTIONS = [{ value: '', label: 'Select country' }, ...COUNTRIES.map((c) => ({ value: c, label: c }))];
const TEE_OPTIONS = [
  { value: '', label: 'Select tee' },
  { value: 'Yellow', label: 'Yellow' },
  { value: 'White', label: 'White' },
  { value: 'Blue', label: 'Blue' },
  { value: 'Red', label: 'Red' },
];

function emptyFav() {
  return { courseName: '', country: '', teeBox: '', courseRating: '', slopeRating: '' };
}

export default function FavoriteCourseForm({ favorites = [], onChange }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyFav());
  const [error, setError] = useState('');

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleAdd = () => {
    if (!form.courseName.trim()) { setError('Course name is required'); return; }
    if (!form.country) { setError('Country is required'); return; }
    onChange([...favorites, { ...form }]);
    setForm(emptyFav());
    setError('');
    setAdding(false);
  };

  const handleRemove = (idx) => {
    onChange(favorites.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-golf-500">
        Save your regular courses. They can be preloaded when logging a round.
      </p>

      {/* Existing favorites */}
      {favorites.map((fav, idx) => (
        <div key={idx} className="bg-golf-50 rounded-xl px-3 py-3 border border-golf-100 flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-golf-900 truncate">{fav.courseName}</p>
            <p className="text-xs text-golf-500">{fav.country}{fav.teeBox ? ` · ${fav.teeBox} Tee` : ''}</p>
            {(fav.courseRating || fav.slopeRating) && (
              <p className="text-xs text-golf-400 mt-0.5">
                {fav.courseRating ? `CR: ${fav.courseRating}` : ''}
                {fav.courseRating && fav.slopeRating ? ' / ' : ''}
                {fav.slopeRating ? `Slope: ${fav.slopeRating}` : ''}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleRemove(idx)}
            className="text-golf-400 hover:text-red-500 text-base px-1 !min-h-0 shrink-0"
          >
            ✕
          </button>
        </div>
      ))}

      {/* Add form */}
      {adding ? (
        <div className="flex flex-col gap-3 bg-golf-50 rounded-xl p-3 border border-golf-200">
          <Input
            label="Course Name"
            id="favCourseName"
            value={form.courseName}
            onChange={(e) => set('courseName', e.target.value)}
            placeholder="e.g. Pebble Beach"
          />
          <Select
            label="Country"
            id="favCountry"
            options={COUNTRY_OPTIONS}
            value={form.country}
            onChange={(e) => set('country', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Tee Box"
              id="favTeeBox"
              options={TEE_OPTIONS}
              value={form.teeBox}
              onChange={(e) => set('teeBox', e.target.value)}
            />
            <Input
              label="Course Rating"
              id="favCourseRating"
              type="number"
              inputMode="decimal"
              step="0.1"
              value={form.courseRating}
              onChange={(e) => set('courseRating', e.target.value)}
              placeholder="—"
            />
          </div>
          <Input
            label="Slope Rating"
            id="favSlopeRating"
            type="number"
            inputMode="numeric"
            value={form.slopeRating}
            onChange={(e) => set('slopeRating', e.target.value)}
            placeholder="—"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2">
            <Button fullWidth onClick={handleAdd}>Add Course</Button>
            <Button fullWidth variant="ghost" onClick={() => { setAdding(false); setError(''); }}>Cancel</Button>
          </div>
        </div>
      ) : (
        <Button variant="secondary" onClick={() => setAdding(true)}>
          + Add Favorite Course
        </Button>
      )}
    </div>
  );
}
