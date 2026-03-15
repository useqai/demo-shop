import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPriceUsd: number;
}

interface Order {
  id: string;
  email: string;
  shippingAddress: string;
  totalUsd: number;
  createdAt: string;
  items: OrderItem[];
}

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/orders')
      .then(r => {
        if (r.status === 401) { navigate('/login'); return null; }
        return r.json();
      })
      .then(data => {
        if (data) setOrders(data);
        setLoading(false);
      })
      .catch(() => { setError('Could not load orders.'); setLoading(false); });
  }, [navigate]);

  if (loading) return <div className="text-gray-500 text-sm">Loading orders...</div>;
  if (error) return <div className="text-red-500 text-sm">{error}</div>;

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">No orders yet.</p>
        <Link to="/" className="text-sm font-medium underline">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs text-gray-400 font-mono">{order.id}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
                <p className="text-xs text-gray-500 mt-1">{order.shippingAddress}</p>
              </div>
              <p className="text-sm font-semibold">${Number(order.totalUsd).toFixed(2)}</p>
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-1">
              {order.items.map(item => (
                <div key={item.productId} className="flex justify-between text-sm text-gray-600">
                  <span>{item.productName} × {item.quantity}</span>
                  <span>${(Number(item.unitPriceUsd) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
