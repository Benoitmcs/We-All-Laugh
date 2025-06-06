import express from 'express';
import checkoutRouter from './routes/checkout.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use('/api/checkout', checkoutRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
