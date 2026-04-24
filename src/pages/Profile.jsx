import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { signOutUser } from '../firebase/auth';
import PersonalInfoForm from '../components/profile/PersonalInfoForm';
import ClubDistanceForm from '../components/profile/ClubDistanceForm';
import FavoriteCourseForm from '../components/profile/FavoriteCourseForm';
import CourseTrophySection from '../components/profile/CourseTrophySection';
import CollapsibleSection from '../components/ui/CollapsibleSection';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SaveProgressBar from '../components/ui/SaveProgressBar';

export default function Profile() {
  const { user } = useAuth();
  const { profile, profileLoading, hasLoaded, updateProfile } = useData();
  const { canInstall, installApp } = useInstallPrompt();
  const [form, setForm] = useState(null);
  const [saveStep, setSaveStep] = useState(0);
  const [saveError, setSaveError] = useState(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [bgPreview, setBgPreview] = useState(() => localStorage.getItem('handi0_bg'));

  const handleBgUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Image too large (max 2MB). Recommend under 500KB for best performance.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      localStorage.setItem('handi0_bg', ev.target.result);
      setBgPreview(ev.target.result);
      window.location.reload();
    };
    reader.readAsDataURL(file);
  };

  const resetBg = () => {
    localStorage.removeItem('handi0_bg');
    setBgPreview(null);
    window.location.reload();
  };

  const SAVE_STEPS = [
    { label: 'Saving profile...', pct: 50 },
    { label: 'Saved!', pct: 100 },
  ];

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  if (!form) return <LoadingSpinner />;

  const handleSave = async () => {
    setSaveError(null);
    setSaveStep(1);
    try {
      await updateProfile(form);
      setSaveStep(2);
      setTimeout(() => setSaveStep(0), 2000);
    } catch (err) {
      setSaveError(err?.message || 'Save failed. Please try again.');
      setSaveStep(0);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
  };

  const trophyCount = form.courseTrophies?.length ?? 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Install app banner */}
      {canInstall && (
        <button
          type="button"
          onClick={installApp}
          className="w-full btn-glass rounded-xl py-3 text-sm font-semibold min-h-[44px]"
        >
          📲 Install to App Launcher
        </button>
      )}

      {/* User identity card — floating avatar */}
      <div className="relative mt-12 mb-1">
        <div className="absolute left-1/2 -translate-x-1/2 -top-12 z-10">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-[88px] h-[88px] rounded-full"
              style={{
                border: '3px solid rgba(255,255,255,0.85)',
                boxShadow: '0 0 24px rgba(255,255,255,0.22), 0 4px 20px rgba(0,0,0,0.50)',
              }}
            />
          ) : (
            <div
              className="w-[88px] h-[88px] rounded-full flex items-center justify-center"
              style={{
                border: '3px solid rgba(255,255,255,0.85)',
                background: 'rgba(62,118,69,0.60)',
                boxShadow: '0 0 24px rgba(255,255,255,0.22), 0 4px 20px rgba(0,0,0,0.50)',
              }}
            >
              <span className="text-3xl">👤</span>
            </div>
          )}
        </div>
        <div
          className="rounded-2xl text-center pt-12 pb-5 px-4"
          style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        >
          <p className="font-bold text-lg leading-tight" style={{ color: 'var(--text-primary)' }}>
            {user?.displayName || form.name || 'Golfer'}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
        </div>
      </div>

      {/* Personal Info */}
      <CollapsibleSection title="Personal Info" subtitle="Age, height, weight, language">
        <PersonalInfoForm profile={form} onChange={setForm} />
      </CollapsibleSection>

      {/* Club Distances */}
      <CollapsibleSection title="Club Distances" subtitle="Carry distances in meters">
        <ClubDistanceForm
          distances={form.clubDistances || {}}
          onChange={(d) => setForm((f) => ({ ...f, clubDistances: d }))}
          brands={form.clubBrands || {}}
          onBrandsChange={(b) => setForm((f) => ({ ...f, clubBrands: b }))}
        />
      </CollapsibleSection>

      {/* Save */}
      {saveError && <p className="text-sm text-red-400 text-center">{saveError}</p>}
      {saveStep > 0
        ? <SaveProgressBar steps={SAVE_STEPS} step={saveStep} />
        : (
          <button
            type="button"
            onClick={handleSave}
            className="w-full btn-glass rounded-2xl py-4 text-lg font-semibold min-h-[56px]"
          >
            Save Profile
          </button>
        )
      }

      {/* Background Image */}
      <CollapsibleSection title="Background Image" subtitle="Customize app wallpaper">
        <div className="flex flex-col gap-3">
          {bgPreview && (
            <div className="relative w-full h-24 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
              <img src={bgPreview} className="w-full h-full object-cover" alt="Current background" />
              <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.30)' }} />
              <span className="absolute bottom-2 left-2 text-xs" style={{ color: 'rgba(255,255,255,0.70)' }}>Current</span>
            </div>
          )}
          <label className="w-full btn-glass rounded-xl py-3 text-sm font-semibold min-h-[44px] flex items-center justify-center cursor-pointer">
            📷 Choose Image
            <input type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
          </label>
          {bgPreview && (
            <button type="button" onClick={resetBg} className="w-full rounded-xl py-2.5 text-sm min-h-[44px]" style={{ color: 'var(--text-secondary)' }}>
              Reset to Default
            </button>
          )}
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Recommended: JPEG under <strong style={{ color: 'var(--text-primary)' }}>500KB</strong> (e.g. 1280×720px).
            {' '}Image is saved on this device only and will not sync to other devices.
          </p>
        </div>
      </CollapsibleSection>

      {/* Favorite Courses */}
      <CollapsibleSection title="Favorite Courses" subtitle="Preload into round entry">
        <FavoriteCourseForm
          favorites={form.favoriteCourses || []}
          onChange={async (courses) => {
            const updated = { ...form, favoriteCourses: courses };
            setForm(updated);
            await updateProfile(updated);
          }}
        />
      </CollapsibleSection>

      {/* Trophies */}
      <CollapsibleSection
        title="🏆 Trophies"
        subtitle="Course records · Best scores"
        badge={
          trophyCount > 0 && (
            <span
              className="text-xs rounded-full px-2 py-0.5 font-semibold"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--text-primary)' }}
            >
              {trophyCount}
            </span>
          )
        }
      >
        <CourseTrophySection
          trophies={form.courseTrophies || []}
          uid={user?.uid}
          onChange={async (trophies) => {
            const updated = { ...form, courseTrophies: trophies };
            setForm(updated);
            await updateProfile(updated);
          }}
        />
      </CollapsibleSection>

      {/* Sign out */}
      {confirmLogout ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setConfirmLogout(false)}
            className="flex-1 rounded-xl py-3 min-h-[44px] font-medium text-sm"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--text-secondary)' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex-1 rounded-xl py-3 min-h-[44px] font-medium text-sm text-white"
            style={{ background: 'rgba(239,68,68,0.65)', border: '1px solid rgba(239,68,68,0.40)' }}
          >
            Yes, Log Out
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirmLogout(true)}
          className="w-full rounded-xl py-3 min-h-[44px] text-sm font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          Log Out
        </button>
      )}

      {/* Copyright */}
      <p className="text-center text-[11px] leading-relaxed pt-1 pb-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
        Copyright ⓒ 2026, shaun.yoo.ao All rights reserved.
        <br />Version 1.0.7
      </p>
    </div>
  );
}
