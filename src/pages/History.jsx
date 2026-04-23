import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { formatDate } from '../utils/dateHelpers';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ManualRoundForm from '../components/round/ManualRoundForm';
import FeedbackModal from '../components/ai/FeedbackModal';
import UpcomingRoundForm from '../components/upcoming/UpcomingRoundForm';
import { useUpcomingRound } from '../hooks/useUpcomingRound';

export default function History() {
  const { rounds, roundsLoading, hasLoaded, saveRound, profile } = useData();
  const navigate = useNavigate();
  const [showManual, setShowManual] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [feedbackRoundId, setFeedbackRoundId] = useState(null);
  const { saveUpcomingRound } = useUpcomingRound();

  if (!hasLoaded && roundsLoading) return <LoadingSpinner />;

  const handleManualSave = async (roundData) => {
    await saveRound(roundData);
    setShowManual(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
          All Rounds ({rounds.length})
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setShowUpcoming(true)}>
            + Upcoming
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setShowManual(true)}>
            + Previous
          </Button>
        </div>
      </div>

      {/* Manual round form modal */}
      {showManual && (
        <ManualRoundForm
          onSave={handleManualSave}
          onClose={() => setShowManual(false)}
          favoriteCourses={profile?.favoriteCourses || []}
        />
      )}

      {/* Upcoming round form modal */}
      {showUpcoming && (
        <UpcomingRoundForm
          onSave={async (data) => { await saveUpcomingRound(data); setShowUpcoming(false); }}
          onClose={() => setShowUpcoming(false)}
          favoriteCourses={profile?.favoriteCourses || []}
        />
      )}

      {/* Round list */}
      {rounds.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-4xl mb-2">📋</p>
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>No rounds logged yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Log your first round to see history</p>
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
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {r.courseName}
                    </p>
                    {r.isManualEntry && (
                      <span
                        className="text-[9px] rounded px-1 py-0.5 shrink-0"
                        style={{ background: 'rgba(255,255,255,0.10)', color: 'var(--text-secondary)' }}
                      >
                        manual
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {r.country} · {formatDate(r.date)}
                  </p>
                  <div className="flex gap-3 mt-1">
                    {r.longestDriveMeter && (
                      <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>🏌 {r.longestDriveMeter}m</span>
                    )}
                    {Number(r.lostBalls) > 0 && (
                      <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>⚪ {r.lostBalls} lost</span>
                    )}
                    {r.scoreDifferential != null && (
                      <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                        Diff: {Number(r.scoreDifferential).toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 ml-3 shrink-0">
                  <span className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{r.totalScore}</span>
                  {r.hasAIResponse && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFeedbackRoundId(r.id); }}
                      className="text-[10px] rounded-md px-2 py-0.5 font-medium !min-h-0"
                      style={{ background: 'rgba(100,150,255,0.15)', color: 'rgba(150,180,255,0.90)', border: '1px solid rgba(100,150,255,0.20)' }}
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
