import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Ensure a cart row exists for the session, return cart id
async function getOrCreateCart(sessionId) {
  let { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('session_id', sessionId)
    .single();

  if (!cart) {
    const { data: newCart, error } = await supabase
      .from('carts')
      .insert({ session_id: sessionId })
      .select('id')
      .single();
    if (error) throw error;
    cart = newCart;
  }
  return cart.id;
}

// GET /cart/:sessionId
router.get('/:sessionId', async (req, res) => {
  try {
    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('session_id', req.params.sessionId)
      .single();

    if (!cart) return res.json({ items: [] });

    const { data: items, error } = await supabase
      .from('cart_items')
      .select('id, quantity, product_id, products(id, name, price_usd, picture)')
      .eq('cart_id', cart.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ items: items || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /cart/:sessionId/items — { productId, quantity }
router.post('/:sessionId/items', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId is required' });

    const cartId = await getOrCreateCart(req.params.sessionId);

    // Check if item already exists
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cartId)
      .eq('product_id', productId)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.json(data);
    }

    const { data, error } = await supabase
      .from('cart_items')
      .insert({ cart_id: cartId, product_id: productId, quantity })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /cart/:sessionId/items/:productId — { quantity }
router.patch('/:sessionId/items/:productId', async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) return res.status(400).json({ error: 'quantity must be >= 1' });

    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('session_id', req.params.sessionId)
      .single();
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('cart_id', cart.id)
      .eq('product_id', req.params.productId)
      .select()
      .single();
    if (error) return res.status(404).json({ error: 'Item not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /cart/:sessionId/items/:productId
router.delete('/:sessionId/items/:productId', async (req, res) => {
  try {
    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('session_id', req.params.sessionId)
      .single();
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id)
      .eq('product_id', req.params.productId);
    if (error) return res.status(500).json({ error: error.message });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /cart/:sessionId — clear entire cart
router.delete('/:sessionId', async (req, res) => {
  try {
    const { error } = await supabase
      .from('carts')
      .delete()
      .eq('session_id', req.params.sessionId);
    if (error) return res.status(500).json({ error: error.message });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
