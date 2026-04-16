import DirectionSlider from './DirectionSlider';
import { DIRECTION_CLUB_GROUPS } from '../../utils/constants';

export default function ClubDirectionPanel({ directions = {}, onChange }) {
  const handleChange = (key, val) => {
    onChange({ ...directions, [key]: val });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-golf-500">
        Swipe each slider to indicate your typical shot tendency. Center = Straight.
      </p>
      {DIRECTION_CLUB_GROUPS.map(({ key, label }) => (
        <div key={key} className="bg-golf-50 rounded-xl px-3 py-2 border border-golf-100">
          <DirectionSlider
            clubName={label}
            value={directions[key] ?? 0}
            onChange={(val) => handleChange(key, val)}
          />
        </div>
      ))}
    </div>
  );
}
