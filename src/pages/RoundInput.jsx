import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRound } from '../hooks/useRounds';
import { useData } from '../context/DataContext';
import { useAIResponse } from '../hooks/useAIResponses';
import { todayISO, formatDate } from '../utils/dateHelpers';
import { emptySwingForm } from '../components/round/SwingFormPanel';
import { COUNTRIES } from '../utils/constants';
import JsonAutoFill from '../components/round/JsonAutoFill';

import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import CollapsibleSection from '../components/ui/CollapsibleSection';
import HoleScoreGrid from '../components/round/HoleScoreGrid';
import ClubDirectionPanel from '../components/round/ClubDirectionPanel';
import SwingFormPanel from '../components/round/SwingFormPanel';
import AIPromptBox from '../components/ai/AIPromptBox';
import AIResponseBox from '../components/ai/AIResponseBox';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const COUNTRY_OPTIONS = [{ value: '', label: 'Select country' }, ...COUNTRIES.map((c) => ({ value: c, label: c }))];
const TEE_OPTIONS = [
  { value: '', label: 'Select tee' },
  { value: 'Yellow', label: 'Yellow' },
  { value: 'White', label: 'White' },
  { value: 'Blue', label: 'Blue' },
  { value: 'Red', label: 'Red' },
];


function emptyRound() {
  return {
    date: todayISO(),
    courseName: '',
    country: '',
    teeBox: '',
    totalScore: '',
    courseRating: '',
    slopeRating: '',
    longestDriveMeter: '',
    lostBalls: '',
    holes: {},
    avgGir: '',
    clubDirections: {},
    swingForm: emptySwingForm(),
  };
}

function SaveProgress({ step }) {
  const steps = [
    { label: 'Saving round data...', pct: 33 },
    { label: 'Computing handicap...', pct: 66 },
    { label: 'Complete!', pct: 100 },
  ];
  const current = steps[(step - 1)] || steps[0];
  return (
    <div className="w-full flex flex-col gap-2 py-2">
      <div className="flex justify-between text-sm text-golf-700 font-medium px-1">
        <span>{current.label}</span>
        <span>{current.pct}%</span>
      </div>
      <div className="w-full h-2 bg-golf-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-golf-600 rounded-full transition-all duration-500"
          style={{ width: `${current.pct}%` }}
        />
      </div>
    </div>
  );
}

export default function RoundInput() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { saveRound, removeRound, rounds, profile } = useData();
  const { round: existingRound, loading } = useRound(id);
  const { saveResponse, aiResponse } = useAIResponse(id);

  const [form, setForm] = useState(emptyRound());
  const [saveStep, setSaveStep] = useState(0); // 0=idle 1=saving 2=handicap 3=done
  const [saveError, setSaveError] = useState(null);
  const [errors, setErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (existingRound) {
      setForm({
        ...emptyRound(),
        ...existingRound,
        swingForm: existingRound.swingForm || emptySwingForm(),
      });
    }
  }, [existingRound]);

  useEffect(() => {
    if (id) return;
    const raw = localStorage.getItem('handi0_pending_game');
    if (!raw) return;
    try {
      const g = JSON.parse(raw);
      setForm((f) => ({
        ...f,
        ...(g.date && { date: g.date }),
        ...(g.courseName && { courseName: g.courseName }),
        ...(g.totalScore && { totalScore: String(g.totalScore) }),
      }));
    } catch {}
    localStorage.removeItem('handi0_pending_game');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  // Load a favorite course into the form
  const loadFavorite = (idx) => {
    const favs = profile?.favoriteCourses || [];
    const fav = favs[Number(idx)];
    if (!fav) return;
    setForm((f) => ({
      ...f,
      courseName: fav.courseName || f.courseName,
      country: fav.country || f.country,
      teeBox: fav.teeBox || f.teeBox,
      courseRating: fav.courseRating || f.courseRating,
      slopeRating: fav.slopeRating || f.slopeRating,
    }));
  };

  // Hole sum check
  const holeValues = Object.values(form.holes);
  const filledHoles = holeValues.filter((h) => h?.score);
  const allHolesFilled = filledHoles.length === 18;
  const holeSum = holeValues.reduce((a, h) => a + Number(h?.score || 0), 0);
  const scoresMismatch = allHolesFilled && form.totalScore && Number(form.totalScore) !== holeSum;

  const validate = () => {
    const e = {};
    if (!form.courseName.trim()) e.courseName = 'Course name is required';
    if (!form.country) e.country = 'Country is required';
    if (!form.date) e.date = 'Date is required';
    if (!form.totalScore) e.totalScore = 'Total score is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaveError(null);
    setSaveStep(1);
    try {
      const roundId = await saveRound({ ...form, id }, (step) => setSaveStep(step));
      setSaveStep(3);
      setTimeout(() => {
        setSaveStep(0);
        if (!id) navigate(`/round/${roundId}`);
      }, 900);
    } catch (err) {
      setSaveError(err?.message || 'Save failed. Please try again.');
      setSaveStep(0);
    }
  };

  const handleDelete = async () => {
    await removeRound(id);
    navigate('/history');
  };

  if (loading) return <LoadingSpinner />;

  const favoriteCourses = profile?.favoriteCourses || [];

  const applyJsonPatch = (patch) => setForm((f) => ({ ...f, ...patch }));

  return (
    <div className="flex flex-col gap-3">
      {/* ── Section 0: JSON Auto-fill (new rounds only) ── */}
      {!id && (
        <CollapsibleSection title="Auto-fill via JSON" subtitle="Paste AI-generated data instantly">
          <JsonAutoFill onApply={applyJsonPatch} />
        </CollapsibleSection>
      )}

      {/* ── Section 1: Required info ── */}
      <CollapsibleSection
        title="Round Info"
        subtitle="Required fields"
        badge={id && existingRound?.updatedAt && (
          <span className="text-[10px] text-golf-400 font-medium">Updated {formatDate(existingRound.updatedAt)}</span>
        )}
        defaultOpen
      >
        <div className="flex flex-col gap-3">
          {/* 1. Date — full width */}
          <Input
            label="Date"
            id="date"
            type="date"
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
            error={errors.date}
          />
          {/* 2. Load Favorite Course */}
          {favoriteCourses.length > 0 && (
            <Select
              label="Load Favorite Course"
              id="favLoad"
              options={[
                { value: '', label: 'Select to preload…' },
                ...favoriteCourses.map((f, i) => ({ value: String(i), label: `${f.courseName} (${f.country})` })),
              ]}
              value=""
              onChange={(e) => { if (e.target.value !== '') loadFavorite(e.target.value); }}
            />
          )}
          {/* 3. Country */}
          <Select
            label="Country"
            id="country"
            options={COUNTRY_OPTIONS}
            value={form.country}
            onChange={(e) => set('country', e.target.value)}
            error={errors.country}
          />
          {/* 4. Course Name */}
          <Input
            label="Course Name"
            id="courseName"
            value={form.courseName}
            onChange={(e) => set('courseName', e.target.value)}
            placeholder="e.g. Pebble Beach"
            error={errors.courseName}
          />
          {/* 5. Total Score  6. Tee Box */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Total Score"
              id="totalScore"
              type="number"
              inputMode="numeric"
              value={form.totalScore}
              onChange={(e) => set('totalScore', e.target.value)}
              placeholder="—"
              error={errors.totalScore}
            />
            <Select
              label="Tee Box"
              id="teeBox"
              options={TEE_OPTIONS}
              value={form.teeBox}
              onChange={(e) => set('teeBox', e.target.value)}
            />
          </div>
          {scoresMismatch && (
            <p className="text-xs text-amber-600">
              ⚠ Total score ({form.totalScore}) differs from hole sum ({holeSum})
            </p>
          )}
          {/* 7. Course Rating  8. Slope Rating */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Course Rating"
              id="courseRating"
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
              id="slopeRating"
              type="number"
              inputMode="numeric"
              value={form.slopeRating}
              onChange={(e) => set('slopeRating', e.target.value)}
              placeholder="—"
              hint="For handicap"
            />
          </div>
          {/* 9. Longest Drive  10. Lost Balls */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Longest Drive (m)"
              id="longestDriveMeter"
              type="number"
              inputMode="numeric"
              value={form.longestDriveMeter}
              onChange={(e) => set('longestDriveMeter', e.target.value)}
              placeholder="m"
            />
            <Input
              label="Lost Balls"
              id="lostBalls"
              type="number"
              inputMode="numeric"
              value={form.lostBalls}
              onChange={(e) => set('lostBalls', e.target.value)}
              placeholder="—"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* ── Section 2: Hole-by-hole ── */}
      <CollapsibleSection title="Hole-by-Hole" subtitle="Optional · Score & Putts per hole" defaultOpen>
        <div className="flex flex-col gap-4">
          <Input
            label="Average GIR (%)"
            id="avgGir"
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

      {/* ── Section 3: Club Directions ── */}
      <CollapsibleSection title="Club Directions" subtitle="Optional · Shot tendency sliders">
        <ClubDirectionPanel
          directions={form.clubDirections}
          onChange={(v) => set('clubDirections', v)}
        />
      </CollapsibleSection>

      {/* ── Section 4: Swing Feedback ── */}
      <CollapsibleSection title="Swing Feedback" subtitle="Optional · Notes per swing stage">
        <SwingFormPanel
          swingForm={form.swingForm}
          onChange={(v) => set('swingForm', v)}
        />
      </CollapsibleSection>

      {/* ── Save button / progress bar ── */}
      {saveStep === 0 ? (
        <Button fullWidth size="lg" onClick={handleSave}>
          {id ? 'Update Round' : 'Save Round'}
        </Button>
      ) : (
        <SaveProgress step={saveStep} />
      )}
      {saveError && (
        <p className="text-sm text-red-500 text-center px-2">{saveError}</p>
      )}

      {/* ── Section 5: AI Analysis (only visible after saving) ── */}
      {id && (
        <CollapsibleSection
          title="🤖 AI Analysis"
          subtitle="Generate prompt · Paste response"
        >
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-bold text-golf-600 uppercase tracking-wide mb-2">
                1. Generate Prompt
              </p>
              <AIPromptBox profile={profile} round={form} allRounds={rounds} />
            </div>
            <div>
              <p className="text-xs font-bold text-golf-600 uppercase tracking-wide mb-2">
                2. Paste AI Response
              </p>
              <AIResponseBox
                onSave={saveResponse}
                existingResponse={aiResponse}
              />
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* ── Delete (only when editing, at the very bottom) ── */}
      {id && saveStep === 0 && (
        confirmDelete ? (
          <div className="flex gap-2">
            <Button fullWidth variant="ghost" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Yes, Delete
            </Button>
          </div>
        ) : (
          <Button fullWidth variant="ghost" onClick={() => setConfirmDelete(true)}>
            Delete Round
          </Button>
        )
      )}
    </div>
  );
}
