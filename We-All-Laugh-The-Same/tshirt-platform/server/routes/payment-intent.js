// server/routes/payment-intent.js
import Stripe from 'stripe';
import express from 'express';
const router = express.Router();

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY environment variable is required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-04-30.preview',
});

// Create Payment Intent for on-page checkout
router.post('/create', async (req, res) => {
  const { cartItems, shippingAddress } = req.body;

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
    if (!Number.isInteger(item.price) || item.price < 1) {
      return res.status(400).json({ error: 'Invalid price for item' });
    }
  }

  // Validate shipping address if provided
  if (shippingAddress) {
    const requiredFields = ['name', 'email', 'line1', 'city', 'state', 'postal_code', 'country'];
    for (const field of requiredFields) {
      if (!shippingAddress[field] || typeof shippingAddress[field] !== 'string' || shippingAddress[field].trim().length === 0) {
        return res.status(400).json({ error: `Shipping ${field.replace('_', ' ')} is required` });
      }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingAddress.email.trim())) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }
  }

  try {
    // Calculate total amount
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 5; // Fixed shipping cost
    const totalAmount = (subtotal + shipping) * 100; // Convert to cents

    // Group items by unique variant for metadata
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

    // Create summary for metadata
    const cartSummary = Array.from(variantMap.values())
      .map(item => `${item.variant}(x${item.quantity})`)
      .join(', ');

    const totalItems = Array.from(variantMap.values()).reduce((sum, item) => sum + item.quantity, 0);

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      metadata: {
        totalItems: totalItems.toString(),
        uniqueVariants: variantMap.size.toString(),
        cartSummary: cartSummary,
        orderType: variantMap.size === 1 ? 'single_variant' : 'mixed_cart',
        subtotal: subtotal.toString(),
        shipping: shipping.toString(),
        ...(shippingAddress && {
          shipping_name: shippingAddress.name,
          shipping_email: shippingAddress.email,
          shipping_line1: shippingAddress.line1,
          shipping_line2: shippingAddress.line2 || '',
          shipping_city: shippingAddress.city,
          shipping_state: shippingAddress.state,
          shipping_postal_code: shippingAddress.postal_code,
          shipping_country: shippingAddress.country,
        })
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      amount: totalAmount 
    });
  } catch (err) {
    // Sanitized error logging - don't expose sensitive details
    console.error(`Payment Intent creation failed [${req.correlationId || 'no-id'}]:`, {
      error: err.message,
      type: err.type,
      code: err.code,
      timestamp: new Date().toISOString(),
      itemCount: cartItems?.length || 0
    });
    res.status(400).json({ error: 'Payment Intent creation failed' });
  }
});

// Confirm payment success and get details
router.get('/confirm/:paymentIntentId', async (req, res) => {
  const { paymentIntentId } = req.params;

  if (!paymentIntentId || typeof paymentIntentId !== 'string') {
    return res.status(400).json({ error: 'Payment Intent ID is required' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      res.json({
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          status: paymentIntent.status,
          metadata: paymentIntent.metadata
        }
      });
    } else {
      res.json({
        success: false,
        status: paymentIntent.status
      });
    }
  } catch (err) {
    console.error(`Payment Intent retrieval failed [${req.correlationId || 'no-id'}]:`, {
      error: err.message,
      type: err.type,
      code: err.code,
      timestamp: new Date().toISOString(),
      paymentIntentId: paymentIntentId.substring(0, 20) + '...'
    });
    res.status(400).json({ error: 'Failed to retrieve payment details' });
  }
});

export default router;