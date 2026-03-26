import { Building2, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

interface HeaderProps {
  onNavigate: (page: 'home' | 'admin') => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand" onClick={() => onNavigate('home')}>
          <Building2 size={28} />
          <h1>Banquet Bookings</h1>
        </div>

        <nav className="header-nav">
          <button
            className={currentPage === 'home' ? 'nav-link active' : 'nav-link'}
            onClick={() => onNavigate('home')}
          >
            Home
          </button>

          {user ? (
            <>
              <button
                className={currentPage === 'admin' ? 'nav-link active' : 'nav-link'}
                onClick={() => onNavigate('admin')}
              >
                <User size={18} />
                Admin
              </button>
              <button className="nav-link logout" onClick={handleSignOut}>
                <LogOut size={18} />
                Sign Out
              </button>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
