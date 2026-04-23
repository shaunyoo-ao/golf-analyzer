import { useState } from 'react';
import TrophyCard from './TrophyCard';
import TrophyEntryModal from './TrophyEntryModal';

export default function CourseTrophySection({ trophies = [], uid, onChange }) {
  const [modal, setModal] = useState(null);

  const sorted = [...trophies].sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date);
    return a.courseName.localeCompare(b.courseName);
  });

  const handleSave = async (updated) => {
    const exists = trophies.find((t) => t.id === updated.id);
    const next = exists
      ? trophies.map((t) => (t.id === updated.id ? updated : t))
      : [...trophies, updated];
    await onChange(next);
    setModal(null);
  };

  const handleDelete = (id) => {
    onChange(trophies.filter((t) => t.id !== id));
    setModal(null);
  };

  return (
    <div className="flex flex-col gap-3">
      {trophies.length === 0 && (
        <p className="text-sm text-center py-3" style={{ color: 'var(--text-secondary)' }}>
          No trophies yet. Add your first course record!
        </p>
      )}

      {/* 4-column circular grid */}
      <div className="grid grid-cols-4 gap-2">
        {sorted.map((t) => (
          <TrophyCard key={t.id} trophy={t} onClick={() => setModal(t)} />
        ))}
        {/* Add button */}
        <button
          type="button"
          onClick={() => setModal('add')}
          className="flex flex-col items-center gap-1 w-full !min-h-0"
        >
          <div
            className="w-full aspect-square rounded-full flex items-center justify-center"
            style={{ border: '2px dashed rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.35)' }}
          >
            <span className="text-xl leading-none">+</span>
          </div>
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Add</span>
        </button>
      </div>

      {modal !== null && (
        <TrophyEntryModal
          trophy={modal === 'add' ? null : modal}
          uid={uid}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
