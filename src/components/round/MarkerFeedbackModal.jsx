import { useState, useEffect } from 'react';

export default function MarkerFeedbackModal({ stage, marker, initialNote, onSave, onClose }) {
  const [note, setNote] = useState(initialNote || '');

  useEffect(() => {
    setNote(initialNote || '');
  }, [initialNote, marker, stage]);

  const handleSave = () => {
    onSave(note.trim());
    onClose();
  };

  const handleClear = () => {
    onSave('');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-[412px] mx-auto">
        <div className="bg-white rounded-t-2xl shadow-2xl px-4 pb-safe-bottom">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-golf-500 uppercase tracking-wide font-medium">{stage}</p>
              <h3 className="text-base font-bold text-golf-900">{marker}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Textarea */}
          <textarea
            autoFocus
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 200))}
            placeholder={`Enter feedback for ${marker} at ${stage}...`}
            rows={4}
            className="w-full rounded-xl border border-golf-200 bg-golf-50 px-4 py-3 text-base text-golf-900 placeholder:text-golf-400 resize-none focus:outline-none focus:ring-2 focus:ring-golf-500 focus:border-golf-500"
          />
          <p className="text-right text-xs text-golf-400 mt-1">{note.length}/200</p>

          {/* Actions */}
          <div className="flex gap-3 mt-4 pb-4">
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 py-3 rounded-xl border border-golf-200 text-golf-600 font-semibold text-base min-h-[44px] active:bg-golf-50"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl bg-golf-600 text-white font-semibold text-base min-h-[44px] active:bg-golf-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
