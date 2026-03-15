import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function UserMenu() {
  const [username, setUsername] = useState<string | null>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  function refreshUser() {
    const cookie = document.cookie.split('; ').find(r => r.startsWith('auth_user='));
    setUsername(cookie ? decodeURIComponent(cookie.split('=')[1]) : null);
  }

  useEffect(() => { refreshUser(); }, [pathname]);

  useEffect(() => {
    window.addEventListener('auth-changed', refreshUser);
    return () => window.removeEventListener('auth-changed', refreshUser);
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUsername(null);
    window.dispatchEvent(new Event('auth-changed'));
    navigate('/');
  }

  if (!username) {
    return (
      <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
        Sign In
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-gray-500">Hi, <span className="font-medium text-gray-900">{username}</span></span>
      <Link to="/orders" className="text-gray-600 hover:text-gray-900 transition-colors">My Orders</Link>
      <button onClick={handleLogout} className="text-gray-400 hover:text-gray-900 transition-colors">
        Sign Out
      </button>
    </div>
  );
}
