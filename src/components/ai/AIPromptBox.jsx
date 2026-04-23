import { useState } from 'react';
import { buildPrompt } from '../../utils/promptBuilder';
import Toggle from '../ui/Toggle';
import Button from '../ui/Button';

export default function AIPromptBox({ profile, round, allRounds = [] }) {
  const [includePast, setIncludePast] = useState(false);
  const [copied, setCopied] = useState(false);

  const language = profile?.aiFeedbackLanguage || 'ko';
  const prompt = buildPrompt(profile, round, {
    includePastRecords: includePast,
    language,
    allRounds,
  });
  const promptStr = JSON.stringify(prompt, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptStr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = promptStr;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Include past records toggle */}
      <div className="rounded-xl px-3 py-3" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
        <Toggle
          id="includePast"
          label="Include Past Records in AI Prompt"
          checked={includePast}
          onChange={setIncludePast}
        />
        <p className="text-xs mt-1.5" style={{ color: 'var(--text-secondary)' }}>
          When enabled, all your saved rounds are appended to the prompt under{' '}
          <code style={{ color: 'var(--accent-green)' }}>user_data.past_records</code>.
        </p>
      </div>

      {/* Language indicator */}
      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
        <span>Feedback language:</span>
        <span className="font-semibold" style={{ color: 'var(--accent-green)' }}>
          {language === 'ko' ? '한국어 (Korean)' : 'English'}
        </span>
        <span style={{ color: 'var(--text-secondary)' }}>· Change in Profile</span>
      </div>

      {/* Prompt textarea */}
      <div className="relative">
        <textarea
          readOnly
          value={promptStr}
          rows={10}
          className="glass-input font-mono text-xs resize-none"
        />
      </div>

      {/* Copy button */}
      <Button fullWidth onClick={handleCopy} variant={copied ? 'secondary' : 'primary'}>
        {copied ? '✓ Copied!' : 'Copy Prompt to Clipboard'}
      </Button>

      <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
        Paste this into any AI chat (ChatGPT, Claude, Gemini, etc.)
      </p>
    </div>
  );
}
