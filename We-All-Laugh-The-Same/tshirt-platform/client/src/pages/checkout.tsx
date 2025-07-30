import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { NextSeo } from 'next-seo';
import { loadStripe } from '@stripe/stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShoppingCart, Palette, Shirt, Plus, Minus, Trash2 } from 'lucide-react';

const TShirtViewer = dynamic(() => import('../components/TShirtViewer'), {
  loading: () => (
    <div className="flex justify-center items-center h-full">
      <div className="spinner"></div>
    </div>
  ),
  ssr: false,
});

const sizes = [
  { name: 'S', price: 30 },
  { name: 'M', price: 30 },
  { name: 'L', price: 30 },
  { name: 'XL', price: 32 },
  { name: '2XL', price: 32 },
];

const designs = [
  { name: 'Cats and Dogs', texture: '/images/WALTS cats and dogs WHITE.png' },
  { name: 'Drinks', texture: '/images/WALTS drinks WHITE.png' },
  { name: 'Elephant Donkey', texture: '/images/WALTS elephant donkey WHITE.png' },
  { name: 'Gender', texture: '/images/WALTS gender WHITE.png' },
  { name: 'Religion', texture: '/images/WALTS religion WHITE.png' },
];

const tShirtModel = '/models/Male_Tshirt.obj';

const availableColors = [
  { name: 'Black', hex: '#2C2C2C' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Purple', hex: '#6F5BA7' },
  { name: 'Green', hex: '#5E7F61' },
  { name: 'Blue', hex: '#4A6A8A' },
  { name: 'Yellow', hex: '#D4B948' },
  { name: 'Red', hex: '#A34545' },
];

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

interface CartItem {
  id: string;
  name: string;
  design: string;
  size: string;
  color: { name: string; hex: string };
  price: number;
  quantity: number;
}

const CheckoutButton = ({ onCheckout, isLoading = false }) => {
  return (
    <motion.button
      onClick={onCheckout}
      disabled={isLoading}
      className="w-full bg-dandelion text-brand-black font-bold py-4 px-6 rounded-xl mt-6 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 shadow-lg"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <span className="flex items-center justify-center">
        {isLoading ? (
          <motion.div 
            className="spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <>
            <ShoppingCart className="w-5 h-5 mr-2" />
            Proceed to Checkout
          </>
        )}
      </span>
    </motion.button>
  );
};

function CheckoutPage() {
  // Current customization state
  const [color, setColor] = useState(availableColors[0]);
  const [design, setDesign] = useState(designs[0]);
  const [size, setSize] = useState(sizes[0].name);
  const [price, setPrice] = useState(sizes[0].price);
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = cart.length > 0 ? 5 : 0;
  const total = subtotal + shipping;

  // Handle checkout with Stripe Checkout Sessions
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsCheckoutLoading(true);
    
    try {
      // For now, we'll use a simple checkout approach
      // In production, you'd create proper SKUs in Stripe Dashboard
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          skuId: 'price_example', // Replace with real Stripe price ID
          quantity: cart.reduce((sum, item) => sum + item.quantity, 0)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe error:', error);
        alert('Checkout failed. Please try again.');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handleSizeChange = (selectedSize) => {
    setSize(selectedSize.name);
    setPrice(selectedSize.price);
  };

  const addToCart = () => {
    const newItem: CartItem = {
      id: `${design.name}-${size}-${color.name}-${Date.now()}`,
      name: `${design.name} T-Shirt (${size}, ${color.name})`,
      design: design.name,
      size,
      color,
      price,
      quantity: 1,
    };

    // Check if item with same configuration already exists
    const existingItemIndex = cart.findIndex(
      item => item.design === design.name && item.size === size && item.color.name === color.name
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([...cart, newItem]);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(cart.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  return (
    <>
      <NextSeo
        title={`Customize Your "${design.name}" T-Shirt - We All Laugh The Same`}
        description={`Personalize your own "${design.name}" t-shirt. Choose your color, and get ready to express yourself.`}
        openGraph={{
          title: `Customize Your "${design.name}" T-Shirt - We All Laugh The Same`,
          description: `Personalize your own "${design.name}" t-shirt. Choose your color, and get ready to express yourself.`,
          images: [
            {
              url: `https://wealllaughthesame.com/images/walts-logo-banner.png`,
              alt: 'We All Laugh The Same Logo',
            },
          ],
        }}
      />
      <div className="bg-brand-off-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            className="text-4xl sm:text-5xl font-extrabold text-center text-dandelion mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Customize & Checkout
          </motion.h1>

          {/* Progress Steps */}
          <motion.div
            className="flex justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-dandelion rounded-full flex items-center justify-center">
                  <Shirt className="w-5 h-5 text-brand-black" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">Customize</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-gray-500" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">Checkout</span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
            <motion.div
              className="bg-brand-white p-6 sm:p-8 rounded-2xl shadow-xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center mb-6">
                <Palette className="w-6 h-6 text-dandelion mr-3" />
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-black">
                  Customize Your Shirt
                </h2>
              </div>
              
              <div className="w-full h-[400px] sm:h-[500px] bg-gray-200 rounded-xl overflow-hidden mb-6 viewer-container">
                <TShirtViewer
                  modelUrl={tShirtModel}
                  textureUrl={design.texture}
                  color={color.hex}
                />
              </div>

              <motion.div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Shirt className="w-4 h-4 mr-2" />
                  Unisex Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <motion.button
                      key={s.name}
                      className={`relative px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200
                                  ${
                                    size === s.name
                                      ? 'bg-dandelion text-brand-black border-dandelion shadow-lg'
                                      : 'bg-brand-white text-brand-black border-gray-300 hover:border-dandelion hover:shadow-md'
                                  }`}
                      onClick={() => handleSizeChange(s)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {s.name}
                      <AnimatePresence>
                        {size === s.name && (
                          <motion.span
                            className="absolute top-[-8px] right-[-8px] bg-emerald-500 p-1 rounded-full"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <Check className="w-3 h-3 text-white" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Design:
                </label>
                <div className="flex flex-wrap gap-2">
                  {designs.map((d) => (
                    <motion.button
                      key={d.name}
                      className={`relative px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200
                                  ${
                                    design.name === d.name
                                      ? 'bg-dandelion text-brand-black border-dandelion shadow-lg'
                                      : 'bg-brand-white text-brand-black border-gray-300 hover:border-dandelion hover:shadow-md'
                                  }`}
                      onClick={() => setDesign(d)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {d.name}
                      <AnimatePresence>
                        {design.name === d.name && (
                          <motion.span
                            className="absolute top-[-8px] right-[-8px] bg-emerald-500 p-1 rounded-full"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <Check className="w-3 h-3 text-white" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  T-Shirt Color:
                </label>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map((c) => (
                    <motion.button
                      key={c.name}
                      className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                        color.hex === c.hex
                          ? 'ring-4 ring-dandelion ring-offset-2 shadow-lg'
                          : 'border-gray-300 hover:border-dandelion hover:shadow-md'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      onClick={() => setColor(c)}
                      aria-label={`Select ${c.name} color`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <AnimatePresence>
                        {color.hex === c.hex && (
                          <motion.div
                            className="w-full h-full rounded-full flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Check className="w-4 h-4 text-white drop-shadow-lg" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Current Item Price & Add to Cart */}
              <motion.div
                className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                layout
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700">Current Item Price:</span>
                  <motion.span
                    key={price}
                    className="font-bold text-brand-black text-lg"
                    initial={{ scale: 1.2, color: "#FFC107" }}
                    animate={{ scale: 1, color: "#1a1a1a" }}
                    transition={{ duration: 0.3 }}
                  >
                    ${price}
                  </motion.span>
                </div>
                
                <motion.button
                  onClick={addToCart}
                  className="w-full bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:ring-offset-2 transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Add to Cart
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              id="checkout"
              className="bg-brand-white p-6 sm:p-8 rounded-2xl shadow-xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center mb-6">
                <ShoppingCart className="w-6 h-6 text-dandelion mr-3" />
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-black">
                  Complete Your Order
                </h2>
              </div>
              
              {/* Cart Items */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="font-semibold text-brand-black mb-4 flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Your Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                </h3>
                
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Your cart is empty</p>
                    <p className="text-sm">Add some items to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {cart.map((item) => (
                        <motion.div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              <div
                                className="w-4 h-4 rounded-full border mr-2"
                                style={{ backgroundColor: item.color.hex }}
                              />
                              <h4 className="font-medium text-sm text-brand-black">
                                {item.design} T-Shirt
                              </h4>
                            </div>
                            <p className="text-xs text-gray-600">
                              Size: {item.size} | Color: {item.color.name}
                            </p>
                            <p className="text-sm font-semibold text-brand-black">
                              ${item.price} each
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <motion.button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Minus className="w-4 h-4" />
                            </motion.button>
                            
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            
                            <motion.button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                            
                            <motion.button
                              onClick={() => removeFromCart(item.id)}
                              className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors ml-2"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {/* Cart Totals */}
                    <motion.div
                      className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                      layout
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Subtotal:</span>
                        <span className="font-bold text-brand-black">${subtotal}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Shipping:</span>
                        <span className="font-bold text-brand-black">${shipping}</span>
                      </div>
                      <hr className="my-2 border-yellow-300" />
                      <div className="flex justify-between items-center text-lg">
                        <span className="font-bold text-brand-black">Total:</span>
                        <motion.span
                          key={total}
                          className="font-bold text-dandelion text-xl"
                          initial={{ scale: 1.3 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          ${total}
                        </motion.span>
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>

              {cart.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <CheckoutButton onCheckout={handleCheckout} isLoading={isCheckoutLoading} />
                </motion.div>
              )}

              {cart.length === 0 && (
                <motion.div
                  className="text-center py-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <p className="text-gray-500">Add items to your cart to proceed with checkout</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CheckoutPage;
