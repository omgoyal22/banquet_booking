import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

type AuthPage = 'login' | 'signup';

function getMainAppUrl(): string {
  const { protocol, hostname, port } = window.location;
  if (hostname === 'localhost' && port === '5174') {
    return 'http://localhost:5173/';
  }

  return `${protocol}//${window.location.host}/`;
}

function AuthAppContent() {
  const { user, session, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<AuthPage>('login');

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (user && session) {
    const redirectUrl = new URL(getMainAppUrl());
    redirectUrl.searchParams.set('access_token', session.access_token);
    redirectUrl.searchParams.set('refresh_token', session.refresh_token);
    window.location.replace(redirectUrl.toString());
    return null;
  }

  if (currentPage === 'signup') {
    return <Signup onNavigate={() => setCurrentPage('login')} />;
  }

  return <Login onNavigate={(page) => setCurrentPage(page === 'signup' ? 'signup' : 'login')} />;
}

export default function AuthApp() {
  return (
    <AuthProvider>
      <AuthAppContent />
    </AuthProvider>
  );
}
