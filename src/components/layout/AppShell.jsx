import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import { DataProvider } from '../../context/DataContext';

const OVERLAY = 'rgba(4,10,4,0.30)';

// Update the background image shown by AppShell's fixed bg-div.
// Uses a CSS custom property on <html> so Profile.jsx can call this too.
export function setBgUrl(rawUrl) {
  const safe = rawUrl || '/bg.jpg';
  const cssVal = safe.startsWith('data:') ? `url("${safe}")` : `url(${safe})`;
  document.documentElement.style.setProperty('--app-bg-image', cssVal);
}

export default function AppShell() {
  useEffect(() => {
    setBgUrl(localStorage.getItem('handi0_bg') || '/bg.jpg');
    return () => document.documentElement.style.removeProperty('--app-bg-image');
  }, []);

  return (
    <>
      {/* Fixed background layer — position:fixed (not background-attachment:fixed)
          so Chrome's backdrop-filter compositor can correctly sample it. */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          background: `linear-gradient(${OVERLAY}, ${OVERLAY}), var(--app-bg-image, url(/bg.jpg)) center/cover no-repeat`,
          pointerEvents: 'none',
        }}
      />
      <DataProvider>
        <div className="min-h-screen max-w-[412px] mx-auto">
          <TopBar />
          <main className="relative pt-14 pb-20 min-h-screen">
            <div className="px-4 py-4">
              <Outlet />
            </div>
          </main>
          <BottomNav />
        </div>
      </DataProvider>
    </>
  );
}
