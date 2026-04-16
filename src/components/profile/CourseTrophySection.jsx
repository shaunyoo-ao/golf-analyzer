import { useState } from 'react';
import TrophyCard from './TrophyCard';
import TrophyEntryModal from './TrophyEntryModal';

export default function CourseTrophySection({ trophies = [], uid, onChange }) {
  const [modal, setModal] = useState(null); // null | 'add' | trophy object

  const sorted = [...trophies].sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date);
    return a.courseName.localeCompare(b.courseName);
  });

  const handleSave = (updated) => {
    const exists = trophies.find((t) => t.id === updated.id);
    const next = exists
      ? trophies.map((t) => (t.id === updated.id ? updated : t))
      : [...trophies, updated];
    onChange(next);
    setModal(null);
  };

  const handleDelete = (id) => {
    onChange(trophies.filter((t) => t.id !== id));
    setModal(null);
  };

  return (
    <div className="flex flex-col gap-3">
      {trophies.length === 0 && (
        <p className="text-sm text-golf-400 text-center py-4">
          No trophies yet. Add your first course record!
        </p>
      )}

      {/* 3-column grid */}
      <div className="grid grid-cols-3 gap-2">
        {sorted.map((t) => (
          <TrophyCard key={t.id} trophy={t} onClick={() => setModal(t)} />
        ))}
        {/* Add button cell */}
        <button
          type="button"
          onClick={() => setModal('add')}
          className="aspect-square rounded-xl border-2 border-dashed border-golf-200 flex flex-col items-center justify-center gap-1 text-golf-400 active:bg-golf-50 !min-h-0"
        >
          <span className="text-2xl leading-none">+</span>
          <span className="text-[10px]">Add</span>
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
