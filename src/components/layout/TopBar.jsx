import { useNavigate, useLocation } from 'react-router-dom';

const TITLES = {
  '/': 'Dashboard',
  '/round/new': 'Log Round',
  '/profile': 'Profile',
  '/history': 'History',
};

function getTitle(pathname) {
  if (pathname.startsWith('/round/') && pathname.endsWith('/ai')) return 'AI Feedback';
  if (pathname.startsWith('/round/') && pathname !== '/round/new') return 'Edit Round';
  return TITLES[pathname] || 'Handi 0';
}

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = getTitle(location.pathname);
  const canGoBack =
    location.pathname !== '/' &&
    !Object.keys(TITLES).slice(1).includes(location.pathname);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-golf-800 safe-top">
      <div className="flex items-center h-14 px-4 max-w-[412px] mx-auto">
        {canGoBack ? (
          <button
            onClick={() => navigate(-1)}
            className="mr-3 p-1 rounded-lg text-golf-300 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Go back"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <span className="text-golf-400 text-xl mr-2">⛳</span>
        )}
        <h1 className="text-white font-bold text-lg flex-1">{title}</h1>
      </div>
    </header>
  );
}
