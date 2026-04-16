import Input from '../ui/Input';
import Select from '../ui/Select';
import { golfExperienceMonths } from '../../utils/dateHelpers';

const GENDER_OPTIONS = [
  { value: '', label: 'Select gender' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other / Prefer not to say' },
];

const HANDEDNESS_OPTIONS = [
  { value: '', label: 'Select handedness' },
  { value: 'right', label: 'Right-handed' },
  { value: 'left', label: 'Left-handed' },
];

const LANGUAGE_OPTIONS = [
  { value: 'ko', label: '한국어 (Korean)' },
  { value: 'en', label: 'English' },
];

export default function PersonalInfoForm({ profile, onChange }) {
  const set = (key, val) => onChange({ ...profile, [key]: val });

  const expMonths = profile.golfStartDate
    ? golfExperienceMonths(profile.golfStartDate)
    : 0;

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Name"
        id="name"
        value={profile.name || ''}
        onChange={(e) => set('name', e.target.value)}
        placeholder="Your name"
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Age"
          id="age"
          type="number"
          inputMode="numeric"
          min="10"
          max="100"
          value={profile.age || ''}
          onChange={(e) => set('age', Number(e.target.value))}
          placeholder="—"
        />
        <Select
          label="Gender"
          id="gender"
          options={GENDER_OPTIONS}
          value={profile.gender || ''}
          onChange={(e) => set('gender', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Height (cm)"
          id="heightCm"
          type="number"
          inputMode="numeric"
          min="100"
          max="250"
          value={profile.heightCm || ''}
          onChange={(e) => set('heightCm', Number(e.target.value))}
          placeholder="cm"
        />
        <Input
          label="Weight (kg)"
          id="weightKg"
          type="number"
          inputMode="numeric"
          min="30"
          max="300"
          value={profile.weightKg || ''}
          onChange={(e) => set('weightKg', Number(e.target.value))}
          placeholder="kg"
        />
      </div>

      <Select
        label="Handedness"
        id="handedness"
        options={HANDEDNESS_OPTIONS}
        value={profile.handedness || ''}
        onChange={(e) => set('handedness', e.target.value)}
      />

      {/* Golf Experience — manual start date */}
      <div className="flex flex-col gap-1">
        <Input
          label="Golf Start Date"
          id="golfStartDate"
          type="date"
          value={profile.golfStartDate || ''}
          onChange={(e) => set('golfStartDate', e.target.value)}
          hint={`Golf Experience: ${expMonths} month${expMonths !== 1 ? 's' : ''}`}
        />
      </div>

      {/* AI Feedback Language */}
      <div className="bg-golf-50 rounded-xl p-3 border border-golf-100">
        <Select
          label="AI Feedback Language"
          id="aiFeedbackLanguage"
          options={LANGUAGE_OPTIONS}
          value={profile.aiFeedbackLanguage || 'ko'}
          onChange={(e) => set('aiFeedbackLanguage', e.target.value)}
        />
        <p className="text-xs text-golf-400 mt-1.5">
          Controls the language used in AI-generated feedback responses.
        </p>
      </div>
    </div>
  );
}
