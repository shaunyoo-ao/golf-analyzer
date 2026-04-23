import { useState } from 'react';
import { COUNTRIES } from '../../utils/constants';
import { todayISO } from '../../utils/dateHelpers';
import { geocodeCourse } from '../../utils/weatherApi';
import Input from '../ui/Input';
import Select from '../ui/Select';
import SaveProgressBar from '../ui/SaveProgressBar';

const COUNTRY_OPTIONS = [{ value: '', label: 'Select country' }, ...COUNTRIES.map((c) => ({ value: c, label: c }))];
const SAVE_STEPS = [{ label: 'Finding course location…', pct: 50 }, { label: 'Saved!', pct: 100 }];

export default function UpcomingRoundForm({ onSave, onClose, favoriteCourses = [] }) {
  const [form, setForm] = useState({ date: todayISO(), courseName: '', country: '' });
  const [selectedFav, setSelectedFav] = useState('');
  const [errors, setErrors] = useState({});
  const [saveStep, setSaveStep] = useState(0);
  const [saveError, setSaveError] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const loadFavorite = (idx) => {
    const fav = favoriteCourses[Number(idx)];
    if (fav) setForm((f) => ({ ...f, courseName: fav.courseName || f.courseName, country: fav.country || f.country }));
  };

  const validate = () => {
    const e = {};
    if (!form.date) e.date = 'Required';
    if (!form.country) e.country = 'Required';
    if (!form.courseName.trim()) e.courseName = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaveError(null);
    setSaveStep(1);
    try {
      const geo = await geocodeCourse(form.courseName, form.country);
      await onSave({ ...form, ...geo });
      setSaveStep(2);
    } catch (err) {
      setSaveStep(1);
      // Save without geo if geocoding fails
      try {
        await onSave({ ...form, lat: null, lng: null, geocodedName: null });
        setSaveStep(2);
      } catch {
        setSaveError(err?.message || 'Save failed');
        setSaveStep(0);
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-[412px] mx-auto">
        <div className="rounded-t-2xl max-h-[85vh] overflow-y-auto" style={{ background: 'rgba(10,22,10,0.96)', borderTop: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="sticky top-0 z-10 pt-3 pb-2 px-4" style={{ background: 'rgba(10,22,10,0.98)', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
            <div className="flex justify-center mb-3"><div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.25)' }} /></div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Upcoming Round</h2>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Schedule a future round</p>
              </div>
              <button onClick={onClose} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center" style={{ color: 'var(--text-secondary)' }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          <div className="px-4 pt-4 pb-28 flex flex-col gap-3">
            <Input label="Date" id="up-date" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} error={errors.date} />

            {favoriteCourses.length > 0 && (
              <Select
                label="Load Favorite Course"
                id="up-fav"
                options={[{ value: '', label: 'Select to preload…' }, ...favoriteCourses.map((f, i) => ({ value: String(i), label: `${f.courseName} (${f.country})` }))]}
                value={selectedFav}
                onChange={(e) => { setSelectedFav(e.target.value); if (e.target.value !== '') loadFavorite(e.target.value); }}
              />
            )}

            <Select label="Country" id="up-country" options={COUNTRY_OPTIONS} value={form.country} onChange={(e) => set('country', e.target.value)} error={errors.country} />
            <Input label="Course Name" id="up-courseName" value={form.courseName} onChange={(e) => set('courseName', e.target.value)} placeholder="e.g. Pebble Beach" error={errors.courseName} />

            {saveError && <p className="text-sm text-red-400 text-center">{saveError}</p>}
            {saveStep > 0
              ? <SaveProgressBar steps={SAVE_STEPS} step={saveStep} />
              : (
                <button type="button" onClick={handleSave} className="w-full btn-glass rounded-2xl py-4 text-lg font-semibold min-h-[56px]">
                  Save Upcoming Round
                </button>
              )
            }
          </div>
        </div>
      </div>
    </>
  );
}
