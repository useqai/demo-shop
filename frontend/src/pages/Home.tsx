import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ensureSession } from '@/lib/client-session';

interface Product {
  id: string;
  name: string;
  description: string;
  picture: string;
  price_usd: number;
  categories: string[];
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => { ensureSession(); }, []);

  useEffect(() => {
    setLoading(true);
    const url = query ? `/api/products?q=${encodeURIComponent(query)}` : '/api/products';
    fetch(url)
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); });
  }, [query]);

  return (
    <div>
      <div className="mb-6">
        <input
          type="search"
          placeholder="Search products..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-gray-500 text-sm">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <Link key={product.id} to={`/products/${product.id}`} className="group">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  {failedImages.has(product.id) ? (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">No image</div>
                  ) : (
                    <img
                      src={product.picture}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={() => setFailedImages(prev => new Set(prev).add(product.id))}
                    />
                  )}
                </div>
                <div className="p-3">
                  <h2 className="text-sm font-medium leading-tight line-clamp-2">{product.name}</h2>
                  <p className="mt-1 text-sm font-semibold">${Number(product.price_usd).toFixed(2)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
