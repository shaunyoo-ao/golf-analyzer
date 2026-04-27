import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './index.css';
import './styles/theme.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppShell from './components/layout/AppShell';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RoundInput from './pages/RoundInput';
import Profile from './pages/Profile';
import History from './pages/History';
import AIFeedback from './pages/AIFeedback';
import Play from './pages/Play';
import GolfGame from './pages/GolfGame';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'round/new', element: <RoundInput /> },
          { path: 'round/:id', element: <RoundInput /> },
          { path: 'round/:id/ai', element: <AIFeedback /> },
          { path: 'profile', element: <Profile /> },
          { path: 'history', element: <History /> },
          { path: 'play', element: <Play /> },
        ],
      },
      { path: 'golf-game', element: <GolfGame /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
