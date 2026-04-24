import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import { DataProvider } from '../../context/DataContext';

export default function AppShell() {
  useEffect(() => {
    const bg = localStorage.getItem('handi0_bg') || '/bg.jpg';
    document.body.style.backgroundImage = `url(${bg})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundAttachment = '';
    };
  }, []);

  return (
    <DataProvider>
      <div className="min-h-screen max-w-[412px] mx-auto relative">
        {/* Dark overlay — no overflow:hidden, no separate compositing layer */}
        <div className="fixed inset-0 pointer-events-none" style={{ background: 'rgba(4,10,4,0.28)', zIndex: 0 }} />

        <TopBar />

        {/* Scrollable content area */}
        <main className="relative z-10 pt-14 pb-20 min-h-screen">
          <div className="px-4 py-4">
            <Outlet />
          </div>
        </main>

        <BottomNav />
      </div>
    </DataProvider>
  );
}
