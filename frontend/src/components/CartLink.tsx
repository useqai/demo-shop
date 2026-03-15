import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function CartLink() {
  const [count, setCount] = useState(0);
  const { pathname } = useLocation();

  function refreshCount() {
    fetch('/api/cart')
      .then(r => r.json())
      .then(data => {
        const items: { quantity: number }[] = data?.items ?? [];
        const total = items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
        setCount(total);
      })
      .catch(() => {});
  }

  useEffect(() => { refreshCount(); }, [pathname]);

  useEffect(() => {
    window.addEventListener('cart-updated', refreshCount);
    return () => window.removeEventListener('cart-updated', refreshCount);
  }, []);

  return (
    <Link
      to="/cart"
      className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
    >
      Cart
      {count > 0 && (
        <span className="bg-gray-900 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center leading-none">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  );
}
