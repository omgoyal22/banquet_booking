import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { LocationDetail } from './pages/LocationDetail';
import { Admin } from './pages/Admin';

type Page = 'home' | 'location' | 'admin';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    if (page === 'home') {
      setSelectedLocation('');
    }
  };

  const handleSelectLocation = (location: string) => {
    setSelectedLocation(location);
    setCurrentPage('location');
  };

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

  if (currentPage === 'admin' && !user) {
    setCurrentPage('home');
    return null;
  }

  return (
    <>
      <Header onNavigate={handleNavigate} currentPage={currentPage} />
      {currentPage === 'home' && <Home onSelectLocation={handleSelectLocation} />}
      {currentPage === 'location' && (
        <LocationDetail
          location={selectedLocation}
          onBack={() => handleNavigate('home')}
        />
      )}
      {currentPage === 'admin' && <Admin />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
