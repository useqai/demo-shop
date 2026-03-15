import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// GET /products
router.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /products/search?q=
router.get('/search', async (req, res) => {
  const q = req.query.q || '';
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
    .order('name');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /products/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Product not found' });
  res.json(data);
});

export default router;
