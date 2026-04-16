import DirectionSlider from './DirectionSlider';
import { DIRECTION_CLUBS } from '../../utils/constants';

export default function ClubDirectionPanel({ directions = {}, onChange }) {
  const handleChange = (club, val) => {
    onChange({ ...directions, [club]: val });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-golf-500">
        Swipe each slider to indicate your typical shot tendency per club. Center = Straight.
      </p>
      {DIRECTION_CLUBS.map((club) => (
        <div key={club} className="bg-golf-50 rounded-xl px-3 py-2 border border-golf-100">
          <DirectionSlider
            clubName={club}
            value={directions[club] ?? 0}
            onChange={(val) => handleChange(club, val)}
          />
        </div>
      ))}
    </div>
  );
}
