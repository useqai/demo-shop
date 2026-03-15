import { Link, useParams, useSearchParams } from 'react-router-dom';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [s] = useSearchParams();

  const txn      = s.get('txn');
  const subtotal = Number(s.get('subtotal') ?? 0);
  const discount = Number(s.get('discount') ?? 0);
  const coupon   = s.get('coupon') ?? '';
  const taxState = s.get('taxState') ?? '';
  const taxRate  = Number(s.get('taxRate') ?? 0);
  const taxAmt   = Number(s.get('taxAmt') ?? 0);
  const total    = Number(s.get('total') ?? 0);

  return (
    <div className="max-w-lg mx-auto text-center py-16">
      <div className="text-4xl mb-4">✓</div>
      <h1 className="text-2xl font-semibold mb-2">Order Confirmed</h1>
      <p className="text-gray-500 text-sm mb-8">Thank you! Your order has been placed successfully.</p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 text-left space-y-3 mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Order ID</span>
          <span className="font-mono text-xs break-all">{id}</span>
        </div>
        {txn && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Transaction ID</span>
            <span className="font-mono text-xs break-all">{txn}</span>
          </div>
        )}

        <div className="border-t border-gray-100 pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount {coupon ? `(${coupon})` : ''}</span>
              <span>−${discount.toFixed(2)}</span>
            </div>
          )}
          {taxState && taxState !== 'UNKNOWN' && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax ({taxState} {taxRate}%)</span>
              <span>${taxAmt.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-semibold border-t border-gray-100 pt-2">
            <span>Total Charged</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Link
        to="/"
        className="inline-block bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
