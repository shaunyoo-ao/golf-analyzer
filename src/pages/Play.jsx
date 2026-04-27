import { useNavigate } from 'react-router-dom';

export default function Play() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
        Play / Log
      </p>
      <button
        type="button"
        onClick={() => navigate('/round/new')}
        className="glass-card !px-5 !py-5 flex items-center gap-4 text-left cursor-pointer"
      >
        <span className="text-3xl">📋</span>
        <div>
          <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Log Round</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>라운드 기록 및 핸디캡 계산</p>
        </div>
        <svg className="w-4 h-4 shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--text-secondary)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => navigate('/golf-game')}
        className="glass-card !px-5 !py-5 flex items-center gap-4 text-left cursor-pointer"
      >
        <span className="text-3xl">⛳</span>
        <div>
          <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Game Start</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>재미로하는 홀판 라운딩 게임</p>
        </div>
        <svg className="w-4 h-4 shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--text-secondary)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
