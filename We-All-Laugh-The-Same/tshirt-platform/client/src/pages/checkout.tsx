import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { NextSeo } from "next-seo";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ShoppingCart,
  Palette,
  Shirt,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Truck,
  User,
} from "lucide-react";

const TShirtViewer = dynamic(() => import("../components/TShirtViewer"), {
  loading: () => (
    <div className="flex justify-center items-center h-full">
      <div className="spinner"></div>
    </div>
  ),
  ssr: false,
});

const sizes = [
  { name: "S", price: 30 },
  { name: "M", price: 30 },
  { name: "L", price: 30 },
  { name: "XL", price: 32 },
  { name: "2XL", price: 32 },
];

const designs = [
  { name: "Cats and Dogs", texture: "/images/WALTS cats and dogs WHITE.png" },
  { name: "Drinks", texture: "/images/WALTS drinks WHITE.png" },
  {
    name: "Elephant Donkey",
    texture: "/images/WALTS elephant donkey WHITE.png",
  },
  { name: "Gender", texture: "/images/WALTS gender WHITE.png" },
  { name: "Religion", texture: "/images/WALTS religion WHITE.png" },
];

const tShirtModel = "/models/Male_Tshirt.obj";

const availableColors = [
  { name: "Black", hex: "#2C2C2C" },
  { name: "Gray", hex: "#808080" },
  { name: "Purple", hex: "#6F5BA7" },
];

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
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

interface ShippingAddress {
  name: string;
  email: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

const PaymentForm = ({
  cart,
  shippingAddress,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const handlePayment = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setIsProcessing(true);
    setPaymentError("");

    try {
      // Create Payment Intent
      const cartItems = cart.map((item) => ({
        design: item.design,
        size: item.size,
        color: item.color.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment-intent/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartItems,
            shippingAddress,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret } = await response.json();

      // Confirm payment with card
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: shippingAddress.name,
            },
          },
        },
      );

      if (error) {
        setPaymentError(error.message);
        onPaymentError(error.message);
      } else if (paymentIntent.status === "succeeded") {
        onPaymentSuccess(paymentIntent);
      }
    } catch (error) {
      const message = error.message || "Payment failed. Please try again.";
      setPaymentError(message);
      onPaymentError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
          <CreditCard className="w-4 h-4 mr-2" />
          Payment Details
        </label>
        <div className="p-4 border border-gray-300 rounded-lg bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {paymentError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {paymentError}
        </div>
      )}

      <motion.button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="group relative w-full rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 border-2 border-cyan-500 px-12 py-4 text-sm font-bold text-gray-900 shadow-lg transition-all duration-400 hover:from-gray-800 hover:to-gray-900 hover:text-white hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/50 focus:outline-none focus:ring-4 focus:ring-yellow-300 active:scale-95 active:shadow-md disabled:opacity-50 disabled:hover:from-yellow-400 disabled:hover:to-yellow-500 disabled:hover:text-gray-900"
        whileHover={{
          scale: isProcessing ? 1 : 1.02,
          y: isProcessing ? 0 : -2,
        }}
        whileTap={{ scale: isProcessing ? 1 : 0.98 }}
      >
        <span className="flex items-center justify-center gap-2">
          {isProcessing ? (
            <motion.div
              className="spinner"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>Complete Payment</span>
              <svg
                className="w-4 h-4 transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:scale-120"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </>
          )}
        </span>
      </motion.button>
    </form>
  );
};

const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { id: 1, name: "Customize", icon: Shirt },
    { id: 2, name: "Shipping", icon: Truck },
    { id: 3, name: "Payment", icon: CreditCard },
  ];

  return (
    <motion.div
      className="flex justify-center mb-8 sm:mb-10 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-full border border-blue-400 shadow-sm px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center space-x-2 sm:space-x-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep >= step.id;

            return (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                      isActive ? "bg-dandelion" : "bg-gray-200"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        isActive ? "text-brand-black" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <span
                    className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium ${
                      isActive ? "text-gray-700" : "text-gray-500"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-4 sm:w-8 h-0.5 ${
                      currentStep > step.id ? "bg-dandelion" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

function CheckoutPageContent() {
  // Current customization state
  const [color, setColor] = useState(availableColors[0]);
  const [design, setDesign] = useState(designs[0]);
  const [size, setSize] = useState(sizes[0].name);
  const [price, setPrice] = useState(sizes[0].price);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Checkout flow state
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: "",
    email: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "US",
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = cart.length > 0 ? 5 : 0;
  const total = subtotal + shipping;

  // Handle shipping form
  const handleShippingSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "line1",
      "city",
      "state",
      "postal_code",
    ];
    const missingFields = requiredFields.filter(
      (field) => !shippingAddress[field]?.trim(),
    );

    if (missingFields.length > 0) {
      alert(`Please fill in: ${missingFields.join(", ")}`);
      return;
    }

    setCurrentStep(3); // Move to payment step
  };

  // Handle payment success
  const handlePaymentSuccess = (paymentIntent) => {
    setPaymentSuccess(true);
    setPaymentDetails(paymentIntent);
  };

  // Handle payment error
  const handlePaymentError = (error) => {
    console.error("Payment failed:", error);
    // Error handling is done in PaymentForm component
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
      (item) =>
        item.design === design.name &&
        item.size === size &&
        item.color.name === color.name,
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

    setCart(
      cart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
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
              alt: "We All Laugh The Same Logo",
            },
          ],
        }}
      />
      <div className="text-center bg-brand-off-white min-h-screen flex flex-col relative">
        {/* Background Decorations */}
        {[
          { top: 0, side: "left", hueRotate: 0 },
          { top: 1200, side: "right", hueRotate: 90 },
        ].map((decoration, index) => (
          <div
            key={index}
            className="absolute pointer-events-none"
            style={{
              top: `${decoration.top}px`,
              [decoration.side]: "-400px",
              width: "800px",
              height: "800px",
              opacity: 0.6,
              filter: `hue-rotate(${decoration.hueRotate}deg)`,
              zIndex: 0,
            }}
          >
            <Image
              src="/images/vvvortex.svg"
              alt=""
              width={800}
              height={800}
              className="w-full h-full"
            />
          </div>
        ))}

        <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Title */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center text-dandelion mb-6 sm:mb-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Customize & Checkout
            </motion.h1>

            {/* Progress Steps */}
            <CheckoutSteps currentStep={currentStep} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 mt-8 sm:mt-12">
              {/* Left Column - Customization (Always visible) */}
              <motion.div
                className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border border-blue-400"
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
                        className={`relative px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-300
                                  ${
                                    size === s.name
                                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-brand-black border-cyan-400 shadow-lg"
                                      : "bg-white/90 text-brand-black border-blue-300 hover:border-cyan-400 hover:shadow-md hover:bg-gray-50"
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
                        className={`relative px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-300
                                  ${
                                    design.name === d.name
                                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-brand-black border-cyan-400 shadow-lg"
                                      : "bg-white/90 text-brand-black border-blue-300 hover:border-cyan-400 hover:shadow-md hover:bg-gray-50"
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
                        className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                          color.hex === c.hex
                            ? "ring-4 ring-cyan-400 ring-offset-2 shadow-lg border-cyan-500"
                            : "border-blue-300 hover:border-cyan-400 hover:shadow-md"
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
                  className="mt-6 p-4 bg-yellow-50/95 backdrop-blur-sm rounded-lg border border-blue-300 shadow-md"
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
                    className="group relative w-full rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-500 border-2 border-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all duration-400 hover:from-emerald-500 hover:to-emerald-600 hover:border-emerald-700 hover:shadow-2xl hover:shadow-emerald-500/50 focus:outline-none focus:ring-4 focus:ring-emerald-300 active:scale-95 active:shadow-md"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Plus className="w-5 h-5" />
                      <span>Add to Cart</span>
                      <svg
                        className="w-4 h-4 transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:scale-120"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Right Column - Cart/Shipping/Payment */}
              <motion.div
                id="checkout"
                className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border border-blue-400"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {/* Step 1: Cart */}
                {currentStep === 1 && (
                  <>
                    <div className="flex items-center mb-6">
                      <ShoppingCart className="w-6 h-6 text-dandelion mr-3" />
                      <h2 className="text-2xl sm:text-3xl font-bold text-brand-black">
                        Your Cart
                      </h2>
                    </div>

                    {cart.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Your cart is empty</p>
                        <p className="text-sm">
                          Add some items to get started!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 mb-6">
                        <AnimatePresence>
                          {cart.map((item) => (
                            <motion.div
                              key={item.id}
                              className="flex items-center justify-between p-3 bg-gray-50/95 backdrop-blur-sm rounded-lg border border-blue-200"
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
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
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
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
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
                          className="mt-4 p-4 bg-yellow-50/95 backdrop-blur-sm rounded-lg border border-blue-300 shadow-md"
                          layout
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700">Subtotal:</span>
                            <span className="font-bold text-brand-black">
                              ${subtotal}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700">Shipping:</span>
                            <span className="font-bold text-brand-black">
                              ${shipping}
                            </span>
                          </div>
                          <hr className="my-2 border-yellow-300" />
                          <div className="flex justify-between items-center text-lg">
                            <span className="font-bold text-brand-black">
                              Total:
                            </span>
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

                    {cart.length > 0 && (
                      <motion.button
                        onClick={() => setCurrentStep(2)}
                        className="group relative w-full rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 border-2 border-cyan-500 px-12 py-4 text-sm font-bold text-gray-900 shadow-lg transition-all duration-400 hover:from-gray-800 hover:to-gray-900 hover:text-white hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/50 focus:outline-none focus:ring-4 focus:ring-yellow-300 active:scale-95 active:shadow-md"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <Truck className="w-5 h-5" />
                          <span>Continue to Shipping</span>
                          <svg
                            className="w-4 h-4 transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:scale-120"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </span>
                      </motion.button>
                    )}
                  </>
                )}

                {/* Step 2: Shipping */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center mb-6">
                      <Truck className="w-6 h-6 text-dandelion mr-3" />
                      <h2 className="text-2xl font-bold text-brand-black">
                        Shipping Address
                      </h2>
                    </div>

                    <form onSubmit={handleShippingSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.name}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dandelion focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={shippingAddress.email}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dandelion focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 1 *
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.line1}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              line1: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dandelion focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.line2}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              line2: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dandelion focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.city}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                city: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dandelion focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.state}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                state: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dandelion focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.postal_code}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                postal_code: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dandelion focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country *
                          </label>
                          <select
                            value={shippingAddress.country}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                country: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dandelion focus:border-transparent"
                            required
                          >
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex space-x-4 pt-4">
                        <motion.button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-300 transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Back to Cart
                        </motion.button>

                        <motion.button
                          type="submit"
                          className="group relative flex-1 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 border-2 border-cyan-500 px-8 py-3 text-sm font-bold text-gray-900 shadow-lg transition-all duration-400 hover:from-gray-800 hover:to-gray-900 hover:text-white hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/50 focus:outline-none focus:ring-4 focus:ring-yellow-300 active:scale-95 active:shadow-md"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="flex items-center justify-center gap-2">
                            <span>Continue to Payment</span>
                            <svg
                              className="w-4 h-4 transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:scale-120"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </span>
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && !paymentSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center mb-6">
                      <CreditCard className="w-6 h-6 text-dandelion mr-3" />
                      <h2 className="text-2xl font-bold text-brand-black">
                        Payment
                      </h2>
                    </div>

                    <PaymentForm
                      cart={cart}
                      shippingAddress={shippingAddress}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                    />

                    <motion.button
                      onClick={() => setCurrentStep(2)}
                      className="w-full mt-4 bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-300 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Back to Shipping
                    </motion.button>
                  </motion.div>
                )}

                {/* Success Message */}
                {paymentSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-brand-black mb-2">
                      Payment Successful!
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Thank you for your order. You'll receive an email
                      confirmation shortly.
                    </p>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-700">
                      <p>
                        <strong>Payment ID:</strong> {paymentDetails?.id}
                      </p>
                      <p>
                        <strong>Amount:</strong> $
                        {(paymentDetails?.amount / 100).toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutPageContent />
    </Elements>
  );
}

export default CheckoutPage;

