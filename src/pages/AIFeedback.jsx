import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRound } from '../hooks/useRounds';
import { useProfile } from '../hooks/useProfile';
import { useAIResponse } from '../hooks/useAIResponses';
import { useRounds } from '../hooks/useRounds';
import AIPromptBox from '../components/ai/AIPromptBox';
import AIResponseBox from '../components/ai/AIResponseBox';
import FeedbackSections from '../components/ai/FeedbackSections';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import { formatDate } from '../utils/dateHelpers';

export default function AIFeedback() {
  const { id } = useParams();
  const { round, loading: roundLoading } = useRound(id);
  const { profile } = useProfile();
  const { rounds } = useRounds();
  const { aiResponse, loading: aiLoading, fetchResponse, saveResponse } = useAIResponse(id);

  useEffect(() => {
    fetchResponse();
  }, [fetchResponse]);

  if (roundLoading || aiLoading) return <LoadingSpinner />;
  if (!round) return (
    <Card className="text-center py-8">
      <p className="text-golf-700">Round not found.</p>
    </Card>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Round summary */}
      <Card className="flex items-center justify-between">
        <div>
          <p className="font-bold text-golf-900">{round.courseName}</p>
          <p className="text-xs text-golf-500">{round.country} · {formatDate(round.date)}</p>
        </div>
        <span className="text-2xl font-black text-golf-700">{round.totalScore}</span>
      </Card>

      {/* Previously saved response */}
      {aiResponse?.parsed && (
        <div>
          <p className="text-xs font-bold text-golf-600 uppercase tracking-wide mb-2">
            Saved Feedback
          </p>
          <FeedbackSections parsed={aiResponse.parsed} />
        </div>
      )}

      {/* Generate new prompt */}
      <div>
        <p className="text-xs font-bold text-golf-600 uppercase tracking-wide mb-2">
          Generate Prompt
        </p>
        <AIPromptBox profile={profile} round={round} allRounds={rounds} />
      </div>

      {/* Paste new response */}
      <div>
        <p className="text-xs font-bold text-golf-600 uppercase tracking-wide mb-2">
          Paste AI Response
        </p>
        <AIResponseBox roundId={id} onSave={saveResponse} />
      </div>
    </div>
  );
}
