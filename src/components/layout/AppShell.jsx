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
          <div className="absolute inset-0" style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0" style={{ background: 'rgba(4,10,4,0.42)' }} />
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
