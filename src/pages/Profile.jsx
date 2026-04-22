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
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import SaveProgressBar from '../components/ui/SaveProgressBar';

export default function Profile() {
  const { user } = useAuth();
  const { profile, profileLoading, hasLoaded, updateProfile } = useData();
  const { canInstall, installApp } = useInstallPrompt();
  const [form, setForm] = useState(null);
  const [saveStep, setSaveStep] = useState(0);
  const [saveError, setSaveError] = useState(null);
  const [confirmLogout, setConfirmLogout] = useState(false);

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

  return (
    <div className="flex flex-col gap-3">
      {/* Install app banner */}
      {canInstall && (
        <Button fullWidth variant="secondary" onClick={installApp}>
          📲 Install to App Launcher
        </Button>
      )}

      {/* User identity card */}
      <Card className="flex items-center gap-4">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-14 h-14 rounded-full border-2 border-golf-200"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-golf-200 flex items-center justify-center">
            <span className="text-2xl text-golf-600">👤</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-golf-900 truncate">{user?.displayName || form.name || 'Golfer'}</p>
          <p className="text-xs text-golf-500 truncate">{user?.email}</p>
        </div>
      </Card>

      {/* Personal Info */}
      <CollapsibleSection title="Personal Info" subtitle="Age, height, weight, language">
        <PersonalInfoForm
          profile={form}
          onChange={setForm}
        />
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

      {/* Save (Personal Info + Club Distances only) */}
      {saveError && <p className="text-sm text-red-500 text-center">{saveError}</p>}
      {saveStep > 0
        ? <SaveProgressBar steps={SAVE_STEPS} step={saveStep} />
        : <Button fullWidth size="lg" onClick={handleSave}>Save Profile</Button>
      }

      {/* Favorite Courses — immediate save on Add/Remove */}
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

      {/* Trophies — immediate save on Add/Edit/Delete */}
      <CollapsibleSection
        title="🏆 Trophies"
        subtitle="Course records · Best scores"
        badge={
          (form.courseTrophies?.length ?? 0) > 0 && (
            <span className="text-xs bg-golf-100 text-golf-700 rounded-full px-2 py-0.5 font-semibold">
              {form.courseTrophies.length}
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
          <Button fullWidth variant="ghost" onClick={() => setConfirmLogout(false)}>
            Cancel
          </Button>
          <Button fullWidth onClick={handleSignOut} className="bg-red-500 hover:bg-red-600 text-white">
            Yes, Log Out
          </Button>
        </div>
      ) : (
        <Button fullWidth variant="ghost" onClick={() => setConfirmLogout(true)}>
          Log Out
        </Button>
      )}

      {/* Copyright */}
      <p className="text-center text-[11px] text-golf-400 leading-relaxed pt-1 pb-4">
        Copyright ⓒ 2026, shaun.yoo.ao All rights reserved.{'\n'}
        <br />Version 1.0.5
      </p>
    </div>
  );
}
