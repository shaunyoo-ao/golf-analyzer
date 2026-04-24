import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import { DataProvider } from '../../context/DataContext';

const OVERLAY = 'rgba(4,10,4,0.30)';

function buildBg(url) {
  return `linear-gradient(${OVERLAY}, ${OVERLAY}), url(${url}) center/cover fixed`;
}

export default function AppShell() {
  useEffect(() => {
    const bg = localStorage.getItem('handi0_bg') || '/bg.jpg';
    document.body.style.background = buildBg(bg);
    return () => { document.body.style.background = ''; };
  }, []);

  return (
    <DataProvider>
      {/* No overlay div — body carries image+overlay as one layer.
          backdrop-filter on cards now directly blurs the body background. */}
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
  );
}

export { buildBg };
