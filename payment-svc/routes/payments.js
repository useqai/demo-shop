import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// POST /payments — { orderId, amount }
router.post('/', async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    if (!orderId || amount == null) {
      return res.status(400).json({ error: 'orderId and amount are required' });
    }

    const transactionId = `txn_${uuidv4().replace(/-/g, '').slice(0, 16)}`;

    const { error } = await supabase.from('payments').insert({
      order_id: orderId,
      transaction_id: transactionId,
      amount_usd: amount,
      status: 'success',
    });

    if (error) return res.status(500).json({ error: error.message });

    res.json({ transactionId, status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
