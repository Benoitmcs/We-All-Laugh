// server/routes/checkout.js
import Stripe from 'stripe';
import express from 'express';
const router = express.Router();

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY environment variable is required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-04-30.preview',
});

router.post('/', async (req, res) => {
  const { skuId, quantity = 1 } = req.body;

  // Input validation
  if (!skuId || typeof skuId !== 'string' || skuId.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid SKU ID' });
  }

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    return res.status(400).json({ error: 'Invalid quantity (must be 1-10)' });
  }

  try {
    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price: skuId.trim(),       // pre-created in Stripe Dashboard
        quantity: Math.floor(quantity),
      }],
      automatic_tax: { enabled: true },
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    // Sanitized error logging - don't expose sensitive details
    console.error(`Checkout session creation failed [${req.correlationId || 'no-id'}]:`, {
      error: err.message,
      type: err.type,
      code: err.code,
      timestamp: new Date().toISOString(),
      skuId: skuId?.substring(0, 20) + '...' // Log partial SKU for debugging
    });
    res.status(400).json({ error: 'Checkout session creation failed' });
  }
});

export default router;
