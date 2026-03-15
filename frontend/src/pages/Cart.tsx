import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ensureSession } from '@/lib/client-session';

interface CartItem {
  id: string;
  quantity: number;
  product_id: string;
  products: {
    id: string;
    name: string;
    price_usd: number;
    picture: string;
  };
}

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { ensureSession(); }, []);

  function fetchCart() {
    fetch('/api/cart')
      .then(r => r.json())
      .then(data => { setItems(data.items || []); setLoading(false); });
  }

  useEffect(() => { fetchCart(); }, []);

  async function updateQuantity(productId: string, quantity: number) {
    await fetch(`/api/cart/items/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    fetchCart();
    window.dispatchEvent(new Event('cart-updated'));
  }

  async function removeItem(productId: string) {
    await fetch(`/api/cart/items/${productId}`, { method: 'DELETE' });
    fetchCart();
    window.dispatchEvent(new Event('cart-updated'));
  }

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.products.price_usd) * item.quantity,
    0
  );

  if (loading) return <div className="text-gray-500 text-sm">Loading cart...</div>;

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link to="/" className="text-sm font-medium underline">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 items-center">
            <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={item.products.picture}
                alt={item.products.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.products.name}</p>
              <p className="text-sm text-gray-500">${Number(item.products.price_usd).toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => item.quantity > 1 ? updateQuantity(item.product_id, item.quantity - 1) : removeItem(item.product_id)}
                className="w-7 h-7 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm flex items-center justify-center"
              >
                &minus;
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                className="w-7 h-7 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm flex items-center justify-center"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(item.product_id)}
              className="text-gray-400 hover:text-red-500 text-sm ml-2"
              title="Remove"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex justify-between text-sm mb-4">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
