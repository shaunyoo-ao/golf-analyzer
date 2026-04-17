/**
 * Manual "Previous Round" entry form.
 * Intentionally EXCLUDES Driver Direction, Iron Direction, and Swing Form Markers.
 */
import { useState } from 'react';
import { COUNTRIES } from '../../utils/constants';
import { todayISO } from '../../utils/dateHelpers';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import SaveProgressBar from '../ui/SaveProgressBar';
import HoleScoreGrid from './HoleScoreGrid';
import CollapsibleSection from '../ui/CollapsibleSection';

const COUNTRY_OPTIONS = [
  { value: '', label: 'Select country' },
  ...COUNTRIES.map((c) => ({ value: c, label: c })),
];

function emptyForm() {
  return {
    courseName: '',
    country: '',
    date: todayISO(),
    totalScore: '',
    courseRating: '',
    slopeRating: '',
    longestDriveMeter: '',
    lostBalls: '',
    holes: {},
    avgGir: '',
    isManualEntry: true,
  };
}

export default function ManualRoundForm({ onSave, onClose }) {
  const [form, setForm] = useState(emptyForm());
  const [errors, setErrors] = useState({});
  const [saveStep, setSaveStep] = useState(0);

  const SAVE_STEPS = [
    { label: 'Saving round...', pct: 50 },
    { label: 'Saved!', pct: 100 },
  ];

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.courseName.trim()) e.courseName = 'Required';
    if (!form.country) e.country = 'Required';
    if (!form.date) e.date = 'Required';
    if (!form.totalScore) e.totalScore = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaveStep(1);
    try {
      await onSave(form);
      setSaveStep(2);
    } catch {
      setSaveStep(0);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Bottom sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-[412px] mx-auto">
        <div className="bg-white rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Handle */}
          <div className="sticky top-0 bg-white z-10 pt-3 pb-2 px-4 border-b border-golf-100">
            <div className="flex justify-center mb-3">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-golf-900 text-lg">Previous Round</h2>
                <p className="text-xs text-golf-500">Add a past round to your history</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-4 pt-4 pb-28 flex flex-col gap-3">
            {/* Required fields */}
            <Input
              label="Course Name"
              id="m-courseName"
              value={form.courseName}
              onChange={(e) => set('courseName', e.target.value)}
              placeholder="e.g. Pebble Beach"
              error={errors.courseName}
            />

            <Select
              label="Country"
              id="m-country"
              options={COUNTRY_OPTIONS}
              value={form.country}
              onChange={(e) => set('country', e.target.value)}
              error={errors.country}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Date"
                id="m-date"
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                error={errors.date}
              />
              <Input
                label="Total Score"
                id="m-totalScore"
                type="number"
                inputMode="numeric"
                value={form.totalScore}
                onChange={(e) => set('totalScore', e.target.value)}
                placeholder="—"
                error={errors.totalScore}
              />
            </div>

            {/* Optional handicap fields */}
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Course Rating"
                id="m-courseRating"
                type="number"
                inputMode="decimal"
                step="0.1"
                value={form.courseRating}
                onChange={(e) => set('courseRating', e.target.value)}
                placeholder="—"
                hint="For handicap"
              />
              <Input
                label="Slope Rating"
                id="m-slopeRating"
                type="number"
                inputMode="numeric"
                value={form.slopeRating}
                onChange={(e) => set('slopeRating', e.target.value)}
                placeholder="—"
                hint="For handicap"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Longest Drive (m)"
                id="m-longestDrive"
                type="number"
                inputMode="numeric"
                value={form.longestDriveMeter}
                onChange={(e) => set('longestDriveMeter', e.target.value)}
                placeholder="m"
              />
              <Input
                label="Lost Balls"
                id="m-lostBalls"
                type="number"
                inputMode="numeric"
                value={form.lostBalls}
                onChange={(e) => set('lostBalls', e.target.value)}
                placeholder="—"
              />
            </div>

            {/* Optional hole-by-hole */}
            <CollapsibleSection title="Hole-by-Hole" subtitle="Optional · Score & Putts">
              <div className="flex flex-col gap-4">
                <Input
                  label="Average GIR (%)"
                  id="m-avgGir"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  step="0.1"
                  value={form.avgGir || ''}
                  onChange={(e) => set('avgGir', e.target.value)}
                  placeholder="—"
                  hint="Greens in Regulation % for this round"
                />
                <HoleScoreGrid holes={form.holes} onChange={(v) => set('holes', v)} />
              </div>
            </CollapsibleSection>

            {/* Save */}
            {saveStep > 0
              ? <SaveProgressBar steps={SAVE_STEPS} step={saveStep} />
              : <Button fullWidth size="lg" onClick={handleSave}>Save Previous Round</Button>
            }
          </div>
        </div>
      </div>
    </>
  );
}
