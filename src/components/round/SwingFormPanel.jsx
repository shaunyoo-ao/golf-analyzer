import { useState } from 'react';
import { SWING_STAGES, SWING_STAGE_LABELS } from '../../utils/constants';

export function emptySwingForm() {
  return Object.fromEntries(SWING_STAGES.map((s) => [s, '']));
}

export default function SwingFormPanel({ swingForm = {}, onChange }) {
  const [activeStage, setActiveStage] = useState('address');

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs" style={{ color: 'var(--accent-green)' }}>Add optional text feedback for each swing stage.</p>

      {/* Stage tabs */}
      <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}>
        {SWING_STAGES.map((stage) => {
          const hasNote = typeof swingForm[stage] === 'string' && swingForm[stage].trim();
          return (
            <button
              key={stage}
              type="button"
              onClick={() => setActiveStage(stage)}
              className="flex-1 py-2.5 text-xs font-semibold transition-colors relative min-h-[44px]"
              style={activeStage === stage
                ? { background: 'rgba(100,200,100,0.25)', color: 'var(--text-primary)' }
                : { color: 'var(--text-secondary)' }}
            >
              {SWING_STAGE_LABELS[stage]}
              {hasNote && (
                <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-amber-400 align-middle" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback textarea */}
      <textarea
        rows={4}
        value={typeof swingForm[activeStage] === 'string' ? swingForm[activeStage] : ''}
        onChange={(e) => onChange({ ...swingForm, [activeStage]: e.target.value })}
        placeholder={`${SWING_STAGE_LABELS[activeStage]} feedback...`}
        className="glass-input resize-none"
      />
    </div>
  );
}
