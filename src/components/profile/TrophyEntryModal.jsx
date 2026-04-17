import { useState, useRef } from 'react';
import { COUNTRIES } from '../../utils/constants';
import { uploadTrophyImage, deleteTrophyImage } from '../../firebase/storage';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import SaveProgressBar from '../ui/SaveProgressBar';
import Input from '../ui/Input';
import Select from '../ui/Select';

const COUNTRY_OPTIONS = [{ value: '', label: 'Select country' }, ...COUNTRIES.map((c) => ({ value: c, label: c }))];

function cropToSquareBlob(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const size = Math.min(img.width, img.height);
      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, sx, sy, size, size, 0, 0, 400, 400);
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8);
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function TrophyEntryModal({ trophy, uid, onSave, onDelete, onClose }) {
  const isEdit = !!trophy;
  const [form, setForm] = useState({
    courseName: trophy?.courseName || '',
    country: trophy?.country || '',
    date: trophy?.date || '',
    bestScore: trophy?.bestScore ?? '',
    imageUrl: trophy?.imageUrl || null,
  });
  const [previewUrl, setPreviewUrl] = useState(trophy?.imageUrl || null);
  const [imageBlob, setImageBlob] = useState(null);
  const [saveStep, setSaveStep] = useState(0);
  const [saveError, setSaveError] = useState(null);
  const [errors, setErrors] = useState({});

  const SAVE_STEPS = [
    { label: 'Saving trophy...', pct: 50 },
    { label: 'Saved!', pct: 100 },
  ];
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileRef = useRef();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blob = await cropToSquareBlob(file);
    setImageBlob(blob);
    setPreviewUrl(URL.createObjectURL(blob));
  };

  const validate = () => {
    const e = {};
    if (!form.courseName.trim()) e.courseName = 'Required';
    if (!form.country) e.country = 'Required';
    if (!form.date) e.date = 'Required';
    if (!form.bestScore) e.bestScore = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaveError(null);
    setSaveStep(1);
    try {
      let imageUrl = form.imageUrl;
      const id = trophy?.id || crypto.randomUUID();
      if (imageBlob) {
        imageUrl = await uploadTrophyImage(uid, id, imageBlob);
      }
      await onSave({ ...form, id, bestScore: Number(form.bestScore), imageUrl });
      setSaveStep(2);
    } catch (err) {
      setSaveError(err?.message || 'Save failed. Please try again.');
      setSaveStep(0);
    }
  };

  const handleDelete = async () => {
    setSaveStep(1);
    if (trophy?.imageUrl) await deleteTrophyImage(uid, trophy.id);
    onDelete(trophy.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative mt-auto w-full max-h-[90vh] bg-white rounded-t-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="text-base font-bold text-golf-900">
            {isEdit ? 'Edit Trophy' : 'Add Trophy'}
          </h2>
          <button type="button" onClick={onClose} className="text-golf-400 text-xl !min-h-0 p-1">✕</button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto px-4 pb-24 flex flex-col gap-3">
          {/* Image */}
          <div className="flex items-center gap-3">
            <div
              className="w-20 h-20 rounded-xl overflow-hidden bg-golf-100 border border-golf-200 shrink-0 cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-golf-400 text-2xl">📷</div>
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-xs text-golf-600 font-medium underline !min-h-0"
              >
                {previewUrl ? 'Change photo' : 'Add photo'}
              </button>
              <p className="text-[10px] text-golf-400 mt-0.5">Auto-cropped to 1:1</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>

          <Input
            label="Course Name"
            id="trophyCourseName"
            value={form.courseName}
            onChange={(e) => set('courseName', e.target.value)}
            placeholder="e.g. Pebble Beach"
            error={errors.courseName}
          />
          <Select
            label="Country"
            id="trophyCountry"
            options={COUNTRY_OPTIONS}
            value={form.country}
            onChange={(e) => set('country', e.target.value)}
            error={errors.country}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              id="trophyDate"
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              error={errors.date}
            />
            <Input
              label="Best Score"
              id="trophyScore"
              type="number"
              inputMode="numeric"
              value={form.bestScore}
              onChange={(e) => set('bestScore', e.target.value)}
              placeholder="—"
              error={errors.bestScore}
            />
          </div>

          {saveError && <p className="text-sm text-red-500 text-center">{saveError}</p>}
          {saveStep > 0
            ? <SaveProgressBar steps={SAVE_STEPS} step={saveStep} />
            : <Button fullWidth size="lg" onClick={handleSave}>Save</Button>
          }

          {isEdit && (
            confirmDelete ? (
              <div className="flex gap-2">
                <Button fullWidth variant="ghost" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </Button>
                <Button fullWidth onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white" disabled={saveStep > 0}>
                  Yes, Delete
                </Button>
              </div>
            ) : (
              <Button fullWidth variant="ghost" onClick={() => setConfirmDelete(true)}>
                Delete Trophy
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
