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
    <div className="fixed inset-0 z-50 flex flex-col" style={{ maxWidth: '412px', left: '50%', transform: 'translateX(-50%)' }}>
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative mt-auto max-h-[88vh] bg-white rounded-t-2xl overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <h2 className="font-bold text-golf-900 text-base">AI Feedback</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-golf-400 hover:text-golf-700 text-xl p-1 leading-none !min-h-0"
          >
            ✕
          </button>
        </div>
        {/* Content */}
        <div className="overflow-y-auto p-4 pb-8">
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
