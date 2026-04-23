import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import { DataProvider } from '../../context/DataContext';

export default function AppShell() {
  return (
    <DataProvider>
      <div className="min-h-screen max-w-[412px] mx-auto relative" style={{ background: 'transparent' }}>
        {/* Aurora background */}
        <div className="fixed inset-0 max-w-[412px] mx-auto pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 20%, #1a3a1a 0%, #0d1f0d 40%, #050e05 100%)' }} />
          <div className="absolute" style={{ width: 300, height: 300, left: -70, top: '8%', background: 'rgba(34, 85, 34, 0.45)', borderRadius: '50%', filter: 'blur(80px)' }} />
          <div className="absolute" style={{ width: 260, height: 260, right: -50, top: '42%', background: 'rgba(20, 60, 50, 0.35)', borderRadius: '50%', filter: 'blur(80px)' }} />
          <div className="absolute" style={{ width: 220, height: 220, left: '15%', bottom: '10%', background: 'rgba(34, 85, 34, 0.25)', borderRadius: '50%', filter: 'blur(60px)' }} />
        </div>

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
