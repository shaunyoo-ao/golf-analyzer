import { useState } from 'react';
import Button from '../ui/Button';
import SaveProgressBar from '../ui/SaveProgressBar';
import FeedbackModal from './FeedbackModal';

export default function AIResponseBox({ onSave, existingResponse }) {
  const [raw, setRaw] = useState('');
  const [error, setError] = useState('');
  const [saveStep, setSaveStep] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const SAVE_STEPS = [
    { label: 'Saving response...', pct: 50 },
    { label: 'Saved!', pct: 100 },
  ];
  const [savedParsed, setSavedParsed] = useState(null);

  const displayParsed = savedParsed || existingResponse?.parsed;

  const handleSaveAndVisualize = async () => {
    setError('');
    let parsed;
    try {
      parsed = JSON.parse(raw.trim());
    } catch {
      setError('Invalid JSON. Paste the raw AI response without extra text.');
      return;
    }
    setSaveStep(1);
    try {
      await onSave({ rawResponse: raw, parsed });
      setSavedParsed(parsed);
      setSaveStep(2);
      setTimeout(() => { setSaveStep(0); setModalOpen(true); }, 800);
    } catch (err) {
      setError(err?.message || 'Save failed. Please try again.');
      setSaveStep(0);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Paste area */}
      <textarea
        value={raw}
        onChange={(e) => { setRaw(e.target.value); setError(''); }}
        rows={6}
        placeholder="Paste the AI response here (must be valid JSON)..."
        className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-gray-700 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder:text-golf-300"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      {saveStep > 0
        ? <SaveProgressBar steps={SAVE_STEPS} step={saveStep} />
        : <Button fullWidth onClick={handleSaveAndVisualize} disabled={!raw.trim()}>Save & Visualize</Button>
      }

      {displayParsed && (
        <Button fullWidth variant="secondary" onClick={() => setModalOpen(true)}>
          View Saved Feedback
        </Button>
      )}

      {modalOpen && (
        <FeedbackModal
          parsed={displayParsed}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
