import { useState } from 'react';
import SwingStageImage from './SwingStageImage';
import { SWING_STAGES, SWING_STAGE_LABELS, SWING_MARKERS } from '../../utils/constants';

const EMPTY_STAGE = () =>
  Object.fromEntries(SWING_MARKERS.map((m) => [m.key, '']));

export function emptySwingForm() {
  return Object.fromEntries(SWING_STAGES.map((s) => [s, EMPTY_STAGE()]));
}

export default function SwingFormPanel({ swingForm = {}, onChange }) {
  const [activeStage, setActiveStage] = useState('address');

  const handleStageChange = (stage, notes) => {
    onChange({ ...swingForm, [stage]: notes });
  };

  const totalNotes = SWING_STAGES.reduce((sum, stage) => {
    const stageData = swingForm[stage] || {};
    return sum + SWING_MARKERS.filter((m) => stageData[m.key]?.trim()).length;
  }, 0);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-golf-500">
        Tap the colored dots on the swing image to add body-part feedback.
        Dots turn amber when a note is added.
      </p>

      {/* Stage tab switcher */}
      <div className="flex rounded-xl overflow-hidden border border-golf-200 bg-golf-50">
        {SWING_STAGES.map((stage) => {
          const stageNotes = swingForm[stage] || {};
          const count = SWING_MARKERS.filter((m) => stageNotes[m.key]?.trim()).length;
          return (
            <button
              key={stage}
              type="button"
              onClick={() => setActiveStage(stage)}
              className={[
                'flex-1 py-2.5 text-xs font-semibold transition-colors relative min-h-[44px]',
                activeStage === stage
                  ? 'bg-golf-700 text-white'
                  : 'text-golf-600 hover:bg-golf-100',
              ].join(' ')}
            >
              {SWING_STAGE_LABELS[stage]}
              {count > 0 && (
                <span className="ml-1 bg-amber-400 text-white text-[9px] rounded-full px-1 py-0.5">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active stage image */}
      <SwingStageImage
        stage={activeStage}
        notes={swingForm[activeStage] || EMPTY_STAGE()}
        onChange={(notes) => handleStageChange(activeStage, notes)}
      />

      {totalNotes > 0 && (
        <p className="text-xs text-golf-500 text-center">
          {totalNotes} marker note{totalNotes > 1 ? 's' : ''} recorded across all stages
        </p>
      )}
    </div>
  );
}
