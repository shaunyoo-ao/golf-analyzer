import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useRounds } from '../hooks/useRounds';
import { buildPrompt } from '../utils/promptBuilder';
import { golfExperienceMonths, formatDate } from '../utils/dateHelpers';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import CollapsibleSection from '../components/ui/CollapsibleSection';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import FeedbackModal from '../components/ai/FeedbackModal';

function StatCard({ label, value, sub }) {
  return (
    <div className="flex flex-col items-center bg-white rounded-2xl p-3 border border-golf-100 flex-1">
      <span className="text-xl font-black text-golf-800">{value}</span>
      <span className="text-[11px] text-golf-500 text-center mt-0.5 leading-tight">{label}</span>
      {sub && <span className="text-[10px] text-golf-400 mt-0.5">{sub}</span>}
    </div>
  );
}

export default function Dashboard() {
  const { profile, loading: profileLoading } = useProfile();
  const { rounds, loading: roundsLoading } = useRounds();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [feedbackRoundId, setFeedbackRoundId] = useState(null);

  if (profileLoading || roundsLoading) return <LoadingSpinner />;

  const handicapIndex = profile?.handicapIndex;
  const expMonths = golfExperienceMonths(profile?.golfStartDate);

  const scores = rounds.map((r) => Number(r.totalScore)).filter(Boolean);
  const avgScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;
  const bestScore = scores.length ? Math.min(...scores) : null;
  const recentRounds = rounds.slice(0, 3);

  const latestRound = rounds[0];
  const language = profile?.aiFeedbackLanguage || 'ko';
  const promptStr = latestRound
    ? JSON.stringify(buildPrompt(profile, latestRound, { language }), null, 2)
    : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptStr);
    } catch {
      const el = document.createElement('textarea');
      el.value = promptStr;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Handicap card */}
      <Card className="bg-golf-700 border-golf-600 text-center py-6">
        <p className="text-golf-300 text-sm font-medium uppercase tracking-wide">
          Handicap Index
        </p>
        <p className="text-6xl font-black text-white mt-2">
          {handicapIndex != null ? handicapIndex : '—'}
        </p>
        {handicapIndex == null && (
          <p className="text-golf-400 text-xs mt-2">Log 8+ rounds with course data to unlock</p>
        )}
      </Card>

      {/* Stats row */}
      <div className="flex gap-2">
        <StatCard label="Rounds" value={rounds.length} />
        <StatCard label="Avg Score" value={avgScore ?? '—'} />
        <StatCard label="Best Score" value={bestScore ?? '—'} />
        <StatCard label="Experience" value={expMonths} sub="months" />
      </div>

      {/* Log new round button */}
      <Button fullWidth size="lg" onClick={() => navigate('/round/new')}>
        + Log New Round
      </Button>

      {/* Recent rounds */}
      {recentRounds.length > 0 && (
        <div>
          <p className="text-xs font-bold text-golf-600 uppercase tracking-wide mb-2">
            Recent Rounds
          </p>
          <div className="flex flex-col gap-2">
            {recentRounds.map((r) => (
              <Card
                key={r.id}
                onClick={() => navigate(`/round/${r.id}`)}
                className="flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-golf-900 truncate">{r.courseName}</p>
                  <p className="text-xs text-golf-500">
                    {r.country} · {formatDate(r.date)}
                    {r.isManualEntry && (
                      <span className="ml-1 text-golf-400">(manual)</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {r.hasAIResponse && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFeedbackRoundId(r.id); }}
                      className="text-xs bg-blue-100 text-blue-700 rounded-lg px-2 py-1 font-medium !min-h-0"
                    >
                      💬 AI
                    </button>
                  )}
                  <span className="text-xl font-black text-golf-700">{r.totalScore}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {rounds.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-4xl mb-2">🏌️</p>
          <p className="text-golf-700 font-medium">No rounds yet</p>
          <p className="text-golf-400 text-sm mt-1">Log your first round to get started</p>
        </Card>
      )}

      {/* AI Prompt — latest round */}
      {latestRound && (
        <CollapsibleSection
          title="AI Prompt"
          subtitle="Latest round · Copy to clipboard"
          className="border-blue-200 bg-blue-50"
        >
          <div className="flex flex-col gap-3">
            <textarea
              readOnly
              value={promptStr}
              rows={8}
              className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs text-gray-700 font-mono resize-none focus:outline-none"
            />
            <Button fullWidth onClick={handleCopy} variant={copied ? 'secondary' : 'primary'}>
              {copied ? '✓ Copied!' : 'Copy Prompt to Clipboard'}
            </Button>
            <p className="text-xs text-blue-400 text-center">
              Paste into any AI chat (ChatGPT, Claude, Gemini…)
            </p>
          </div>
        </CollapsibleSection>
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
