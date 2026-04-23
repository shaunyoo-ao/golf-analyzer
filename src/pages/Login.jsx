import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle } from '../firebase/auth';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Sign-in error:', err);
    }
  };

  if (loading) return <LoadingSpinner fullscreen />;

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 30% 15%, #1c3d1c 0%, #0d200d 45%, #060e06 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', position: 'relative', overflow: 'hidden' }}>
      {/* Aurora blobs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '55%', height: '55%', background: 'radial-gradient(circle, rgba(40,100,40,0.55) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '20%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(20,70,55,0.40) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

      {/* Logo / brand */}
      <div style={{ textAlign: 'center', marginBottom: 36, position: 'relative', zIndex: 1 }}>
        <img
          src="/icons/icon-180.png"
          alt="Handi 0"
          style={{ width: 88, height: 88, borderRadius: 22, boxShadow: '0 0 0 1px rgba(255,255,255,0.12), 0 20px 60px rgba(0,0,0,0.5)', marginBottom: 20 }}
        />
        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'rgba(255,255,255,0.92)', margin: 0, letterSpacing: '-0.02em' }}>Handi 0</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.40)', marginTop: 6 }}>AI-powered round tracking</p>
      </div>

      {/* Sign-in card */}
      <div style={{ width: '100%', maxWidth: 380, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.11)', borderRadius: 24, padding: '28px 24px', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', position: 'relative', zIndex: 1 }}>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.50)', fontSize: 14, marginBottom: 20 }}>
          Sign in to track your rounds and get AI feedback
        </p>

        <button
          onClick={handleSignIn}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '14px 20px', minHeight: 52, cursor: 'pointer' }}
        >
          {/* Google logo SVG */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span style={{ color: 'rgba(255,255,255,0.88)', fontWeight: 600, fontSize: 16 }}>Sign in with Google</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 pb-8 px-4 text-center max-w-[412px] mx-auto">
        <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Copyright ⓒ 2026, shaun.yoo.ao All rights reserved.
          <br />
          Version 1.0.5
        </p>
      </footer>
    </div>
  );
}
