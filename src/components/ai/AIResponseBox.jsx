import { useState } from 'react';
import Button from '../ui/Button';
import FeedbackModal from './FeedbackModal';

export default function AIResponseBox({ onSave, existingResponse }) {
  const [raw, setRaw] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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
    setSaving(true);
    try {
      await onSave({ rawResponse: raw, parsed });
      setSavedParsed(parsed);
      setModalOpen(true);
    } catch (err) {
      setError(err?.message || 'Save failed. Please try again.');
    } finally {
      setSaving(false);
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

      <Button fullWidth onClick={handleSaveAndVisualize} disabled={!raw.trim() || saving}>
        {saving ? 'Saving...' : 'Save & Visualize'}
      </Button>

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
