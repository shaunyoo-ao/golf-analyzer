import { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../context/AuthContext';
import { signOutUser } from '../firebase/auth';
import PersonalInfoForm from '../components/profile/PersonalInfoForm';
import ClubDistanceForm from '../components/profile/ClubDistanceForm';
import FavoriteCourseForm from '../components/profile/FavoriteCourseForm';
import CollapsibleSection from '../components/ui/CollapsibleSection';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';

export default function Profile() {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  if (loading || !form) return <LoadingSpinner />;

  const handleSave = async () => {
    setSaving(true);
    await updateProfile(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = async () => {
    await signOutUser();
  };

  return (
    <div className="flex flex-col gap-3">
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
      <CollapsibleSection title="Personal Info" subtitle="Age, height, weight, language" defaultOpen>
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
        />
      </CollapsibleSection>

      {/* Favorite Courses */}
      <CollapsibleSection title="Favorite Courses" subtitle="Preload into round entry">
        <FavoriteCourseForm
          favorites={form.favoriteCourses || []}
          onChange={(courses) => setForm((f) => ({ ...f, favoriteCourses: courses }))}
        />
      </CollapsibleSection>

      {/* Save */}
      <Button fullWidth size="lg" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Profile'}
      </Button>

      {/* Sign out */}
      <Button fullWidth variant="ghost" onClick={handleSignOut}>
        Log Out
      </Button>

      {/* Copyright */}
      <p className="text-center text-[11px] text-golf-400 leading-relaxed pt-1 pb-4">
        Copyright ⓒ 2026, shaun.yoo.ao All rights reserved.{'\n'}
        <br />Version 1.0.1
      </p>
    </div>
  );
}
