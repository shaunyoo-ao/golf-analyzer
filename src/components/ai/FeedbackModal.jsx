import { useAIResponse } from '../../hooks/useAIResponses';
import FeedbackSections from './FeedbackSections';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * Bottom-sheet modal showing AI feedback.
 * Pass `parsed` directly (already fetched) OR `roundId` (auto-fetch).
 */
export default function FeedbackModal({ roundId, parsed: parsedProp, onClose }) {
  const { aiResponse, loading } = useAIResponse(parsedProp ? null : roundId);
  const parsed = parsedProp || aiResponse?.parsed;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative mt-auto w-full max-h-[88vh] rounded-t-2xl overflow-hidden flex flex-col" style={{ background: 'rgba(10,22,10,0.96)', borderTop: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
          <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>AI Feedback</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xl p-1 leading-none !min-h-0"
            style={{ color: 'var(--text-secondary)' }}
          >
            ✕
          </button>
        </div>
        {/* Content — pb-24 clears bottom nav bar */}
        <div className="overflow-y-auto p-4 pb-24">
          {loading ? (
            <div className="py-8"><LoadingSpinner /></div>
          ) : parsed ? (
            <FeedbackSections parsed={parsed} />
          ) : (
            <p className="text-center text-golf-400 py-8">No AI feedback saved yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
