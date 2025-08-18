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
  const { cartItems } = req.body;

  // Input validation
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart items are required' });
  }

  if (cartItems.length > 10) {
    return res.status(400).json({ error: 'Too many items in cart (max 10)' });
  }

  // Validate each cart item
  for (const item of cartItems) {
    if (!item.size || typeof item.size !== 'string' || item.size.trim().length === 0) {
      return res.status(400).json({ error: 'Size is required for all items' });
    }
    if (!item.color || typeof item.color !== 'string' || item.color.trim().length === 0) {
      return res.status(400).json({ error: 'Color is required for all items' });
    }
    if (!item.design || typeof item.design !== 'string' || item.design.trim().length === 0) {
      return res.status(400).json({ error: 'Design is required for all items' });
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10) {
      return res.status(400).json({ error: 'Invalid quantity for item (must be 1-10)' });
    }
  }

  try {
    // Group items by unique variant and sum quantities
    const variantMap = new Map();
    
    cartItems.forEach(item => {
      const variantKey = `${item.design.trim()}-${item.size.trim()}-${item.color.trim()}`;
      
      if (variantMap.has(variantKey)) {
        const existingItem = variantMap.get(variantKey);
        existingItem.quantity += item.quantity;
      } else {
        variantMap.set(variantKey, {
          design: item.design.trim(),
          size: item.size.trim(),
          color: item.color.trim(),
          quantity: item.quantity,
          variant: variantKey
        });
      }
    });

    // Create line items for each unique variant
    const lineItems = Array.from(variantMap.values()).map(item => ({
      price: 'price_1RtYO7HJ6pOTfIDVJhgL3e9Q',
      quantity: Math.floor(item.quantity),
    }));

    // Create summary for session metadata
    const cartSummary = Array.from(variantMap.values())
      .map(item => `${item.variant}(x${item.quantity})`)
      .join(', ');

    const totalItems = Array.from(variantMap.values()).reduce((sum, item) => sum + item.quantity, 0);

    // Create Checkout Session with multiple line items
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      metadata: {
        totalItems: totalItems.toString(),
        uniqueVariants: variantMap.size.toString(),
        cartSummary: cartSummary,
        orderType: variantMap.size === 1 ? 'single_variant' : 'mixed_cart'
      },
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
      itemCount: cartItems?.length || 0
    });
    res.status(400).json({ error: 'Checkout session creation failed' });
  }
});

export default router;
