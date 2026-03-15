import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import paymentsRouter from './routes/payments.js';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.use('/payments', paymentsRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`payment-svc running on http://localhost:${PORT}`);
});
