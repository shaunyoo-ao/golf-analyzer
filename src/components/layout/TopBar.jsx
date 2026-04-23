import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../../context/DataContext';

const TITLES = {
  '/': 'Dashboard',
  '/round/new': 'Log Round',
  '/profile': 'Profile',
  '/history': 'History',
};

const REFRESH_PATHS = new Set(['/', '/history', '/profile']);

function getTitle(pathname) {
  if (pathname.startsWith('/round/') && pathname.endsWith('/ai')) return 'AI Feedback';
  if (pathname.startsWith('/round/') && pathname !== '/round/new') return 'Edit Round';
  return TITLES[pathname] || 'Handi 0';
}

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { refresh, refreshing } = useData();
  const title = getTitle(location.pathname);
  const canGoBack =
    location.pathname !== '/' &&
    !Object.keys(TITLES).slice(1).includes(location.pathname);
  const showRefresh = REFRESH_PATHS.has(location.pathname);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 safe-top"
      style={{
        background: 'rgba(8, 18, 8, 0.82)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-center h-14 px-4 max-w-[412px] mx-auto">
        {canGoBack ? (
          <button
            onClick={() => navigate(-1)}
            className="mr-3 p-1 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Go back"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <img src="/icons/icon-180.png" alt="" className="w-7 h-7 rounded-md mr-2" />
        )}
        <h1 className="font-bold text-lg flex-1" style={{ color: 'var(--text-primary)' }}>{title}</h1>
        {showRefresh && (
          <button
            onClick={refresh}
            disabled={refreshing}
            className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center disabled:opacity-50"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Refresh"
          >
            <svg
              className={`w-5 h-5 transition-transform ${refreshing ? 'animate-spin' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 4v6h-6" />
              <path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}
