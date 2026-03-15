import { Link } from 'react-router-dom';
import CartLink from './CartLink';
import UserMenu from './UserMenu';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-semibold text-lg tracking-tight">DemoShop</Link>
          <div className="flex items-center gap-6">
            <UserMenu />
            <CartLink />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
