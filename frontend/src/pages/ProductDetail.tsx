import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ensureSession } from '@/lib/client-session';

interface Product {
  id: string;
  name: string;
  description: string;
  picture: string;
  price_usd: number;
  categories: string[];
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    ensureSession();
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(setProduct);
  }, [id]);

  async function addToCart() {
    setAdding(true);
    await fetch('/api/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id, quantity: 1 }),
    });
    setAdding(false);
    setAdded(true);
    window.dispatchEvent(new Event('cart-updated'));
    setTimeout(() => setAdded(false), 2000);
  }

  if (!product) {
    return <div className="text-gray-500 text-sm">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-1"
      >
        &larr; Back
      </button>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden md:flex">
        <div className="md:w-96 aspect-square bg-gray-100 flex-shrink-0 overflow-hidden">
          <img
            src={product.picture}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap gap-1 mb-3">
              {product.categories?.map(c => (
                <span key={c} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {c}
                </span>
              ))}
            </div>
            <h1 className="text-xl font-semibold mb-2">{product.name}</h1>
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
          </div>
          <div className="mt-6">
            <p className="text-2xl font-bold mb-4">${Number(product.price_usd).toFixed(2)}</p>
            <button
              onClick={addToCart}
              disabled={adding}
              className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {added ? 'Added!' : adding ? 'Adding...' : 'Add to Cart'}
            </button>
            <a
              href="/cart"
              className="block text-center mt-3 text-sm text-gray-500 hover:text-gray-900"
            >
              View Cart
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
