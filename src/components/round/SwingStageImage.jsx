import { useState } from 'react';
import MarkerDot from './MarkerDot';
import MarkerFeedbackModal from './MarkerFeedbackModal';
import { SWING_MARKERS, MARKER_POSITIONS, SWING_STAGE_LABELS } from '../../utils/constants';

// Import SVG assets
import addressSvg from '../../assets/swing/address.svg';
import backswingSvg from '../../assets/swing/backswing.svg';
import impactSvg from '../../assets/swing/impact.svg';
import finishSvg from '../../assets/swing/finish.svg';

const STAGE_IMAGES = {
  address: addressSvg,
  backswing: backswingSvg,
  impact: impactSvg,
  finish: finishSvg,
};

export default function SwingStageImage({ stage, notes = {}, onChange }) {
  const [activeMarker, setActiveMarker] = useState(null);
  const positions = MARKER_POSITIONS[stage] || {};
  const stageLabel = SWING_STAGE_LABELS[stage] || stage;

  const handleMarkerClick = (markerKey) => {
    setActiveMarker(markerKey);
  };

  const handleSave = (note) => {
    onChange({ ...notes, [activeMarker]: note });
    setActiveMarker(null);
  };

  const activeMarkerMeta = SWING_MARKERS.find((m) => m.key === activeMarker);
  const filledCount = SWING_MARKERS.filter((m) => notes[m.key]?.trim()).length;

  return (
    <div>
      {/* Stage title + filled count */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-golf-900 text-base">{stageLabel}</h3>
        {filledCount > 0 && (
          <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full">
            {filledCount} note{filledCount > 1 ? 's' : ''} added
          </span>
        )}
      </div>

      {/* Image + markers container */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-golf-900 border border-golf-700">
        <img
          src={STAGE_IMAGES[stage]}
          alt={`${stageLabel} swing position`}
          className="w-full h-auto block select-none"
          draggable={false}
        />

        {/* Overlay markers */}
        {SWING_MARKERS.map((marker) => {
          const pos = positions[marker.key];
          if (!pos) return null;
          return (
            <MarkerDot
              key={marker.key}
              label={marker.label}
              x={pos.x}
              y={pos.y}
              note={notes[marker.key]}
              onClick={() => handleMarkerClick(marker.key)}
            />
          );
        })}
      </div>

      {/* Notes summary */}
      {SWING_MARKERS.some((m) => notes[m.key]?.trim()) && (
        <div className="mt-3 flex flex-col gap-1.5">
          {SWING_MARKERS.filter((m) => notes[m.key]?.trim()).map((m) => (
            <button
              type="button"
              key={m.key}
              onClick={() => setActiveMarker(m.key)}
              className="flex items-start gap-2 text-left p-2 rounded-lg bg-amber-50 border border-amber-100"
            >
              <span className="text-amber-500 mt-0.5">●</span>
              <div>
                <span className="text-xs font-semibold text-amber-700">{m.label}: </span>
                <span className="text-xs text-gray-600">{notes[m.key]}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Feedback modal */}
      {activeMarker && (
        <MarkerFeedbackModal
          stage={stageLabel}
          marker={activeMarkerMeta?.label || activeMarker}
          initialNote={notes[activeMarker] || ''}
          onSave={handleSave}
          onClose={() => setActiveMarker(null)}
        />
      )}
    </div>
  );
}
