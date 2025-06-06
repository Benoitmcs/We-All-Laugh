// server/routes/checkout.js
import Stripe from 'stripe';
import express from 'express';
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-04-30.preview',   // keep in sync with pinned version
});

router.post('/', async (req, res) => {
  const { skuId, quantity = 1 } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price: skuId,       // pre-created in Stripe Dashboard
        quantity,
      }],
      automatic_tax: { enabled: true },
      success_url: `${process.env.FRONTEND_URL}/success?sid={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
    });
    res.json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Stripe session failed' });
  }
});

export default router;
