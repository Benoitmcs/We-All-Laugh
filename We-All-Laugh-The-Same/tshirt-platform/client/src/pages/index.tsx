import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  ChevronDown,
  Eye,
  Shirt,
  ShoppingCart,
  Heart,
  Users,
  Sparkles,
  Target,
  Mail,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const featuredDesigns = [
  {
    name: "Cat People and Dog People",
    image: "/images/WALTS cats and dogs WHITE.png",
    href: "/checkout?design=cats-dogs",
    newDrop: true,
  },
  {
    name: "Republicans and Democrats",
    image: "/images/WALTS elephant donkey WHITE.png",
    href: "/checkout?design=elephant-donkey",
    newDrop: true,
  },
  {
    name: "Religious Tolerance",
    image: "/images/WALTS religion WHITE.png",
    href: "/checkout?design=religion",
    newDrop: true,
  },
  {
    name: "Gender Inclusion",
    image: "/images/WALTS gender WHITE.png",
    href: "/checkout?design=gender",
    newDrop: true,
  },
  {
    name: "All Drinks",
    image: "/images/WALTS drinks WHITE.png",
    href: "/checkout?design=drinks",
    newDrop: true,
  },
  {
    name: "Respect Others",
    image: "/images/Respect Others line of type WHITE.png",
    href: "/checkout?design=respect-others",
    newDrop: true,
  },
];

const values = [
  {
    icon: Heart,
    title: "Unity",
    description: "Bringing people together through shared laughter",
    color: "bg-red-100 text-red-600",
  },
  {
    icon: Sparkles,
    title: "Joy",
    description: "Creating moments of laughter in everyday life",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: Users,
    title: "Diversity",
    description: "Celebrating our differences while finding common ground",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Target,
    title: "Quality",
    description: "Crafting thoughtful designs with meaningful messages",
    color: "bg-green-100 text-green-600",
  },
];

function HomePage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | "">(
    "",
  );

  // Background decoration settings
  const decorationOpacity = 0.6;
  const decorationInterval = 1200; // pixels between each decoration
  const decorations = [
    { top: 0, side: "left", hueRotate: 0 },
    { top: decorationInterval, side: "right", hueRotate: 90 },
    { top: decorationInterval * 2, side: "left", hueRotate: 180 },
    { top: decorationInterval * 3, side: "right", hueRotate: 270 },
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setSubmitMessage("Please enter a valid email address");
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitStatus("");

    try {
      const payload = [
        {
          Email: email,
          submittedAt: new Date().toISOString(),
          formMode: "production",
        },
      ];

      const response = await fetch(
        "https://n8n.srv879764.hstgr.cloud/webhook/42f63f19-74b1-4248-8207-5c1523bd014a",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        setSubmitMessage("Thank you! You've been added to our newsletter.");
        setSubmitStatus("success");
        setEmail("");
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      setSubmitMessage("Something went wrong. Please try again.");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="text-center bg-brand-off-white min-h-screen flex flex-col relative">
      {/* Background Decorations */}
      {decorations.map((decoration, index) => (
        <div
          key={index}
          className="absolute pointer-events-none"
          style={{
            top: `${decoration.top}px`,
            [decoration.side]: "-400px",
            width: "800px",
            height: "800px",
            opacity: decorationOpacity,
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

      <main className="flex-grow px-0 relative z-10">
        {/* Hero Section */}
        <section className="text-brand-black bg-gradient-to-b from-[#fff7d1] via-[#f0f8ff] to-[#c0f0ff] rounded-lg shadow-2xl relative overflow-hidden min-h-[calc(100vh-5rem)] md:min-h-0 border border-blue-400">
          {/* Radial highlight behind headline */}
          <div className="absolute inset-0 bg-gradient-radial from-yellow-200/40 via-transparent to-transparent opacity-60 pointer-events-none"></div>
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-yellow-300/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

          {/* T-shirt background with overlaid designs */}
          <div className="absolute inset-0 flex opacity-100 pointer-events-none align-top -top-32 sm:top-0 justify-center">
            <div className="relative w-full max-w-4xl flex items-center justify-center gap-4">
              {/* First T-shirt - Cats and Dogs (rotated left 15deg) - Purple */}
              <motion.div
                className="relative w-64 lg:w-80 mt-8"
                style={{ rotate: "-15deg" }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Image
                  src="/images/BaseTShirtPurple.png"
                  alt="T-shirt"
                  width={400}
                  height={450}
                  className="w-full h-auto"
                  priority
                />
                {/* Cats and Dogs Logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-[60%] h-[50%] top-[10%]">
                    <Image
                      src="/images/WALTS cats and dogs WHITE.png"
                      alt="Cats and Dogs"
                      width={200}
                      height={200}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Second T-shirt - Gender (no rotation) - Black */}
              <motion.div
                className="relative w-64 lg:w-80"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Image
                  src="/images/BaseTShirtBlack.png"
                  alt="T-shirt"
                  width={400}
                  height={450}
                  className="w-full h-auto"
                />
                {/* Gender Logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-[60%] h-[50%] top-[10%]">
                    <Image
                      src="/images/WALTS gender WHITE.png"
                      alt="Gender"
                      width={200}
                      height={200}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Third T-shirt - Elephant & Donkey (rotated right 15deg) - Grey */}
              <motion.div
                className="relative w-64 lg:w-80 mt-8"
                style={{ rotate: "15deg" }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Image
                  src="/images/BaseTShirtGrey.png"
                  alt="T-shirt"
                  width={400}
                  height={450}
                  className="w-full h-auto"
                />
                {/* Elephant & Donkey Logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-[60%] h-[50%] top-[10%]">
                    <Image
                      src="/images/WALTS elephant donkey WHITE.png"
                      alt="Elephant and Donkey"
                      width={200}
                      height={200}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            className="mx-auto max-w-screen-xl px-4 pt-32 pb-32 lg:flex lg:flex-col lg:items-center relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="mx-auto max-w-3xl text-center pt-8 px-8">
              <motion.h1
                className="text-6xl font-extrabold sm:text-8xl text-dandelion flex flex-col items-center leading-tight"
                variants={itemVariants}
              >
                <Image
                  src="/images/Logo.png"
                  alt="We All Laugh The Same"
                  width={600}
                  height={150}
                  priority
                  className="invert-colors"
                />
                <motion.span
                  className="sm:block my-4 sm:mb-0 mb-8 sm:text-3xl md:text-2xlxl text-2xl font-bold text-gray-950 hero-subtitle"
                  variants={itemVariants}
                >
                  Fostering Respect and Tolerance
                </motion.span>
              </motion.h1>
            </div>

            <div className="mx-auto max-w-3xl text-center px-8 pb-8 sm:mt-20 sm:pt-20">
              <motion.div
                className="sm:mt-10  sm:pt0 pt-8 mt-30 flex flex-wrap justify-center gap-6"
                variants={itemVariants}
              >
                <Link
                  href="/checkout"
                  className="group relative block w-full sm:w-auto rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 border-2 border-cyan-500 px-12 py-4  text-sm font-bold text-gray-900 shadow-lg transition-all duration-400 hover:from-gray-800 hover:to-gray-900 hover:text-white hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/50 focus:outline-none focus:ring-4 focus:ring-yellow-300 active:scale-95 active:shadow-md shop-now-button"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>Shop Now</span>
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
                </Link>
              </motion.div>

              <motion.p
                className="mb-6 text-xl pt-8 mt-12"
                variants={itemVariants}
              >
                At{" "}
                <span className="font-bold text-yellow-600 py-1 rounded">
                  We All Laugh The Same
                </span>
                , our mission is to spread joy, foster unity, and celebrate
                diversity through our unique and creative t-shirt designs.
              </motion.p>

              <motion.p
                className="text-xl font-semibold"
                variants={itemVariants}
              >
                Join us in{" "}
                <span className="font-bold text-yellow-600 py-1 rounded">
                  wearing and sharing
                </span>{" "}
                the laughter.
              </motion.p>
            </div>
          </motion.div>
        </section>

        {/* Featured Designs Section */}
        <section className="py-20 bg-brand-off-white relative">
          <div className="mx-auto max-w-screen-xl px-4">
            <motion.h2
              className="text-4xl font-bold text-center text-brand-black mb-12 text-shadow-lg text-shadow-white "
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              Featured Designs
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {featuredDesigns.map((design, index) => (
                <motion.div
                  key={index}
                  className="relative group flex flex-col h-full rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl featured-design-card border border-blue-400"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {design.newDrop && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 z-10">
                      New Drop
                    </div>
                  )}
                  <Link href={design.href} className="block overflow-hidden">
                    <Image
                      src={design.image}
                      alt={design.name}
                      width={400}
                      height={256}
                      className="w-full h-64 object-contain transition-transform duration-300 invert-colors p-5 blur-3xl"
                    />
                  </Link>
                  <div className="p-4 text-center flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-brand-black">
                      {design.name}
                    </h3>
                    <div className="flex-grow" />
                    <Link
                      href={design.href}
                      className="mt-4 block w-full rounded-lg bg-cyan-400 border-2 border-gray-900 px-8 py-3 text-sm font-bold text-gray-900 shadow-lg transition-all duration-300 hover:bg-cyan-300 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300 active:scale-95 active:shadow-md sm:w-auto"
                    >
                      View Product
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Mission - Expanded */}
        <section
          id="our-mission"
          className="py-20 bg-gradient-to-b from-[#06D9FF] md:from-[#06D9FF]/40 via-white to-yellow-100 rounded-2xl shadow-xl overflow-hidden mx-4 my-8 relative border border-blue-400"
        >
          <motion.div
            className="max-w-4xl mx-auto px-4 text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2
              className="text-5xl sm:text-7xl font-extrabold text-dandelion mb-8"
              variants={itemVariants}
            >
              Our Values
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {values.map((value, index) => {
                const bgColors = [
                  "bg-blue-50/70",
                  "bg-blue-100/70",
                  "bg-blue-100/80",
                  "bg-blue-200/70",
                ];
                const borderColors = [
                  "border-blue-200",
                  "border-blue-300",
                  "border-blue-400",
                  "border-blue-500",
                ];
                const iconBorderColors = [
                  "border-blue-600",
                  "border-blue-500",
                  "border-blue-400",
                  "border-blue-300",
                ];
                return (
                  <motion.div
                    key={index}
                    className={`${bgColors[index]} backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center group cursor-pointer border ${borderColors[index]}`}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{
                      y: -10,
                      scale: 1.05,
                      transition: { duration: 0.3 },
                    }}
                  >
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full ${value.color} border-2 ${iconBorderColors[index]} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <value.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-black mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-900">{value.description}</p>
                  </motion.div>
                );
              })}
            </div>
            <motion.div
              className="bg-blue-200/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 md:p-12 mt-12 border border-blue-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="prose prose-lg sm:prose-2xl max-w-none text-center relative z-10">
                <p className="mb-6">
                  We fundamentally believe that humor is a universal language
                  and a powerful tool that transcends boundaries to bring people
                  together. Laughter has the incredible ability to connect us,
                  remind us of our shared humanity, and brighten even the
                  toughest days.
                </p>
                <p className="mb-6">
                  We are passionately committed to crafting high-quality,
                  thoughtfully designed apparel that not only looks great but
                  also carries a positive message. Each design is created with
                  the hope of sparking conversations, inspiring smiles, and
                  making a small but meaningful impact on the world.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-brand-off-white relative">
          <div className="mx-auto max-w-screen-xl px-4 text-center">
            <motion.h2
              className="text-4xl font-bold text-brand-black mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              Get Your T-Shirt in 3 Easy Steps
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <motion.div
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 flex flex-col items-center border border-blue-400 group cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
              >
                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-yellow-100 text-yellow-600 mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Eye size={36} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-brand-black">
                  Choose a Design
                </h3>
                <p className="text-gray-600 text-base">
                  Browse our collection of unique, smile-inducing designs.
                </p>
              </motion.div>
              {/* Step 2 */}
              <motion.div
                className="bg-gray-50/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 flex flex-col items-center border border-blue-400 group cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
              >
                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-cyan-100 text-cyan-600 mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Shirt size={36} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-brand-black">
                  Select Your Fit
                </h3>
                <p className="text-gray-600 text-base">
                  Pick your preferred size and color for the perfect fit.
                </p>
              </motion.div>
              {/* Step 3 */}
              <motion.div
                className="bg-gray-100/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 flex flex-col items-center border border-blue-400 group cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
              >
                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-emerald-100 text-emerald-600 mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <ShoppingCart size={36} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-brand-black">
                  Place Your Order
                </h3>
                <p className="text-gray-600 text-base">
                  Securely check out and get ready to spread some joy,
                  tolerance, and respect for others!
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Join the Community Section */}
        <section className="py-20 bg-yellow-100 rounded-2xl shadow-xl overflow-hidden mx-4 my-8 relative border border-blue-400">
          <div className="mx-auto max-w-screen-xl px-4">
            <div className="max-w-3xl mx-auto">
              <motion.h2
                className="text-4xl font-bold text-brand-black mb-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
              >
                Join the Community
              </motion.h2>
              <motion.p
                className="text-lg text-gray-700 mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                See what our happy customers are saying. Share your own photos
                with #WeAllLaughTheSame!
              </motion.p>

              {/* Placeholder for testimonials or social media feed */}
              <div className="text-gray-500 italic text-center mb-12">
                (Customer photos and testimonials coming soon!)
              </div>

              {/* Newsletter Form */}
              <motion.div
                className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-8 md:p-12 border border-blue-300"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                    <Mail className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-brand-black mb-4">
                    Stay Connected
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Get the latest updates on new designs, exclusive offers, and
                    spread the laughter with us!
                  </p>
                </div>

                <form onSubmit={handleNewsletterSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                      placeholder="Enter your email address"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {submitMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg text-center ${
                        submitStatus === "success"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {submitMessage}
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 border-2 border-yellow-600 px-12 py-4 text-lg font-bold text-gray-900 shadow-lg transition-all duration-300 hover:from-yellow-500 hover:to-yellow-600 hover:shadow-xl hover:scale-102 focus:outline-none focus:ring-4 focus:ring-yellow-300 active:scale-98 active:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    <span className="relative z-10">
                      {isSubmitting ? "Joining..." : "Join the Community"}
                    </span>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </motion.button>
                </form>

                <p className="text-xs text-gray-500 text-center mt-4">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-dandelion relative">
          <div className="mx-auto max-w-screen-xl px-4 text-center">
            <motion.h2
              className="text-4xl font-bold text-brand-black mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              Ready to Wear a Smile?
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/checkout"
                className="group relative inline-block rounded-full bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-gray-700 px-12 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:from-gray-700 hover:to-gray-800 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500 active:scale-95 active:shadow-md"
              >
                <span className="relative z-10">Shop All Designs</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
