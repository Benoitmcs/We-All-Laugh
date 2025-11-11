// server/config/products.js
// Canonical source of truth for product pricing and available options

export const PRODUCTS = {
  // Size-based pricing (in dollars, will be converted to cents for Stripe)
  sizes: {
    'S': 30,
    'M': 30,
    'L': 30,
    'XL': 32,
    '2XL': 32
  },

  // Available designs
  designs: [
    'Cats and Dogs',
    'Drinks',
    'Elephant Donkey',
    'Gender',
    'Religion'
  ],

  // Available colors
  colors: [
    'Black',
    'Gray',
    'Purple'
  ],

  // Shipping cost (in dollars)
  shipping: 5,

  // Validation limits
  limits: {
    minQuantity: 1,
    maxQuantity: 10,
    maxCartItems: 10
  }
};

// Helper function to validate a cart item and return the correct price
export function validateCartItem(item) {
  const errors = [];

  // Validate size and get price
  const validPrice = PRODUCTS.sizes[item.size];
  if (!validPrice) {
    errors.push(`Invalid size: ${item.size}. Valid sizes: ${Object.keys(PRODUCTS.sizes).join(', ')}`);
  }

  // Validate design
  if (!PRODUCTS.designs.includes(item.design)) {
    errors.push(`Invalid design: ${item.design}. Valid designs: ${PRODUCTS.designs.join(', ')}`);
  }

  // Validate color
  if (!PRODUCTS.colors.includes(item.color)) {
    errors.push(`Invalid color: ${item.color}. Valid colors: ${PRODUCTS.colors.join(', ')}`);
  }

  // Validate quantity
  if (!Number.isInteger(item.quantity) ||
      item.quantity < PRODUCTS.limits.minQuantity ||
      item.quantity > PRODUCTS.limits.maxQuantity) {
    errors.push(`Invalid quantity: ${item.quantity}. Must be between ${PRODUCTS.limits.minQuantity} and ${PRODUCTS.limits.maxQuantity}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    price: validPrice // Return the server-side canonical price
  };
}

// Calculate total with server-side prices (ignoring client-provided prices)
export function calculateTotal(cartItems) {
  let subtotal = 0;
  const validatedItems = [];

  for (const item of cartItems) {
    const validation = validateCartItem(item);

    if (!validation.valid) {
      return {
        valid: false,
        errors: validation.errors
      };
    }

    // Use server-side price, NOT client-provided price
    const itemTotal = validation.price * item.quantity;
    subtotal += itemTotal;

    validatedItems.push({
      ...item,
      serverPrice: validation.price,
      itemTotal
    });
  }

  const shipping = PRODUCTS.shipping;
  const total = subtotal + shipping;

  return {
    valid: true,
    subtotal,
    shipping,
    total,
    validatedItems
  };
}
