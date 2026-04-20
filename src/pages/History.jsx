import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { formatDate } from '../utils/dateHelpers';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ManualRoundForm from '../components/round/ManualRoundForm';
import FeedbackModal from '../components/ai/FeedbackModal';

export default function History() {
  const { rounds, roundsLoading, hasLoaded, saveRound } = useData();
  const navigate = useNavigate();
  const [showManual, setShowManual] = useState(false);
  const [feedbackRoundId, setFeedbackRoundId] = useState(null);

  if (!hasLoaded && roundsLoading) return <LoadingSpinner />;

  const handleManualSave = async (roundData) => {
    await saveRound(roundData);
    setShowManual(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-golf-600 uppercase tracking-wide">
          All Rounds ({rounds.length})
        </p>
        <Button size="sm" variant="secondary" onClick={() => setShowManual(true)}>
          + Previous Round
        </Button>
      </div>

      {/* Manual round form modal */}
      {showManual && (
        <ManualRoundForm
          onSave={handleManualSave}
          onClose={() => setShowManual(false)}
        />
      )}

      {/* Round list */}
      {rounds.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-4xl mb-2">📋</p>
          <p className="text-golf-700 font-medium">No rounds logged yet</p>
          <p className="text-golf-400 text-sm mt-1">Log your first round to see history</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {rounds.map((r) => (
            <Card
              key={r.id}
              onClick={() => navigate(`/round/${r.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-golf-900 truncate">
                      {r.courseName}
                    </p>
                    {r.isManualEntry && (
                      <span className="text-[9px] bg-golf-100 text-golf-600 rounded px-1 py-0.5 shrink-0">
                        manual
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-golf-500 mt-0.5">
                    {r.country} · {formatDate(r.date)}
                  </p>
                  <div className="flex gap-3 mt-1">
                    {r.longestDriveMeter && (
                      <span className="text-[10px] text-golf-400">🏌 {r.longestDriveMeter}m</span>
                    )}
                    {Number(r.lostBalls) > 0 && (
                      <span className="text-[10px] text-golf-400">⚪ {r.lostBalls} lost</span>
                    )}
                    {r.scoreDifferential != null && (
                      <span className="text-[10px] text-golf-400">
                        Diff: {r.scoreDifferential.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 ml-3 shrink-0">
                  <span className="text-2xl font-black text-golf-700">{r.totalScore}</span>
                  {r.hasAIResponse && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFeedbackRoundId(r.id); }}
                      className="text-[10px] bg-blue-100 text-blue-700 rounded-md px-2 py-0.5 font-medium !min-h-0"
                    >
                      💬 AI Feedback
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* AI Feedback modal */}
      {feedbackRoundId && (
        <FeedbackModal
          roundId={feedbackRoundId}
          onClose={() => setFeedbackRoundId(null)}
        />
      )}
    </div>
  );
}
