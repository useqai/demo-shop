import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cartRouter from './routes/cart.js';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use('/cart', cartRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`cart-svc running on http://localhost:${PORT}`);
});
