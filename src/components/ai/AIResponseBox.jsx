import { useState } from 'react';
import Button from '../ui/Button';
import FeedbackSections from './FeedbackSections';

export default function AIResponseBox({ roundId, onSave }) {
  const [raw, setRaw] = useState('');
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleVisualize = () => {
    setError('');
    try {
      const data = JSON.parse(raw.trim());
      setParsed(data);
    } catch {
      setError('Could not parse JSON. Make sure you pasted the raw AI response without extra text.');
    }
  };

  const handleSave = async () => {
    if (!parsed || !onSave) return;
    await onSave({ rawResponse: raw, parsed });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Paste area */}
      <textarea
        value={raw}
        onChange={(e) => {
          setRaw(e.target.value);
          setParsed(null);
          setError('');
        }}
        rows={6}
        placeholder="Paste the AI response here (must be valid JSON)..."
        className="w-full rounded-xl border border-golf-200 bg-white px-4 py-3 text-sm text-gray-700 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-golf-500 focus:border-golf-500 placeholder:text-golf-300"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button fullWidth onClick={handleVisualize} disabled={!raw.trim()}>
        Visualize Feedback
      </Button>

      {/* Parsed sections */}
      {parsed && (
        <>
          <FeedbackSections parsed={parsed} />
          <Button
            fullWidth
            variant="secondary"
            onClick={handleSave}
          >
            {saved ? '✓ Saved' : 'Save Response'}
          </Button>
        </>
      )}
    </div>
  );
}
