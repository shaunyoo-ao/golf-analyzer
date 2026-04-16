import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

export default function AppShell() {
  return (
    <div className="min-h-screen bg-golf-50 max-w-[412px] mx-auto relative">
      {/* Layered paper-cut background */}
      <div className="fixed inset-0 max-w-[412px] mx-auto pointer-events-none z-0">
        <div className="absolute inset-0 bg-golf-900" />
        <div
          className="absolute inset-0 bg-golf-800"
          style={{ clipPath: 'polygon(0 15%, 100% 0, 100% 85%, 0 100%)' }}
        />
        <div
          className="absolute inset-0 bg-golf-700 opacity-40"
          style={{ clipPath: 'polygon(0 30%, 100% 10%, 100% 70%, 0 90%)' }}
        />
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
  );
}
