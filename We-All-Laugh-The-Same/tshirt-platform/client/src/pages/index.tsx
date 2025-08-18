import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ChevronRight, Eye, Shirt, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

const featuredDesigns = [
  {
    name: 'Cat People and Dog People',
    image: '/images/WALTS cats and dogs WHITE.png',
    href: '/checkout?design=cats-dogs',
    newDrop: true,
  },
  {
    name: 'Republicans and Democrats',
    image: '/images/WALTS elephant donkey WHITE.png',
    href: '/checkout?design=elephant-donkey',
    newDrop: true,
  },
  {
    name: 'Religious Tolerance',
    image: '/images/WALTS religion WHITE.png',
    href: '/checkout?design=religion',
    newDrop: true,
  },
  {
    name: 'Gender Inclusion',
    image: '/images/WALTS gender WHITE.png',
    href: '/checkout?design=gender',
    newDrop: true,
  },
  {
    name: 'All Drinks',
    image: '/images/WALTS drinks WHITE.png',
    href: '/checkout?design=drinks',
    newDrop: true,
  },
  {
    name: 'Respect Others',
    image: '/images/Respect Others line of type WHITE.png',
    href: '/checkout?design=respect-others',
    newDrop: true,
  },
];

function HomePage() {
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
    <div className="text-center bg-brand-off-white min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="text-brand-black bg-gradient-to-b from-[#fff7d1] via-[#f0f8ff] to-[#c0f0ff] rounded-lg shadow-2xl relative overflow-hidden">
          {/* Radial highlight behind headline */}
          <div className="absolute inset-0 bg-gradient-radial from-yellow-200/40 via-transparent to-transparent opacity-60 pointer-events-none"></div>
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-yellow-300/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          
          <motion.div
            className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-[calc(100vh-var(--header-height,80px))] lg:items-center relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="mx-auto max-w-3xl text-center p-8">
              <motion.h1
                className="text-6xl font-extrabold sm:text-8xl text-dandelion flex flex-col items-center leading-tight"
                variants={itemVariants}
              >
                <Image
                  src="/images/Logo.png"
                  alt="We All Laugh The Same"
                  width={500}
                  height={125}
                  priority
                  className="invert-colors"
                />
                <motion.span
                  className="sm:block mt-4 text-4xl font-light text-gray-950 drop-shadow-sm"
                  variants={itemVariants}
                  style={{
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  Fostering Respect and Tolerance
                </motion.span>
              </motion.h1>

             
              <motion.div
                className="mt-10 flex flex-wrap justify-center gap-6"
                variants={itemVariants}
              >
                <Link
                  href="/checkout"
                  className="group relative block w-full sm:w-auto rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 border-2 border-gray-800 px-12 py-4 text-sm font-bold text-gray-900 shadow-lg transition-all duration-400 hover:from-gray-800 hover:to-gray-900 hover:text-white hover:border-yellow-400 hover:shadow-2xl hover:shadow-gray-800/50 focus:outline-none focus:ring-4 focus:ring-yellow-300 active:scale-95 active:shadow-md"
                  style={{
                    animation: 'subtlePulse 15s ease-out infinite',
                    minWidth: '200px', // Ensure consistent button width
                  }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>Shop Now</span>
                    <svg 
                      className="w-4 h-4 transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:scale-120" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>

                <Link
                  className="block w-full sm:w-auto rounded-lg bg-cyan-400 border-2 border-gray-900 px-12 py-4 text-sm font-bold text-gray-900 shadow-lg transition-all duration-300 hover:bg-cyan-300 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300 active:scale-95 active:shadow-md"
                  href="/mission"
                >
                  Our Mission
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Featured Designs Section */}
        <section className="py-20 bg-brand-off-white">
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
                  className="relative group flex flex-col h-full bg-radial-gradient-custom rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl"
                  style={{
                    backgroundColor: '#f9f9f9',
                    backgroundImage: `
                      radial-gradient(circle at 20% 80%, rgba(18, 11, 55, 0.05), transparent 60%),
                      radial-gradient(circle at 80% 80%, rgba(255, 193, 7, 0.05), transparent 60%),
                      radial-gradient(circle at 50% 10%, rgba(255, 18, 52, 0.05), transparent 60%)
                    `
                  }}
                                            
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
                    <h3 className="text-lg font-semibold text-brand-black">{design.name}</h3>
                    <div className="flex-grow" />
                    <Link href={design.href} className="mt-4 block w-full rounded-lg bg-cyan-400 border-2 border-gray-900 px-8 py-3 text-sm font-bold text-gray-900 shadow-lg transition-all duration-300 hover:bg-cyan-300 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300 active:scale-95 active:shadow-md sm:w-auto">
                      View Product
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Mission Highlight */}
        <section className="py-20 bg-yellow-50 rounded-lg shadow-md">
          <div className="mx-auto max-w-screen-xl px-4 text-center">
            <div className="max-w-3xl mx-auto p-8">
              <motion.h2 
                className="text-4xl font-bold text-brand-black mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
              >
                More Than Just a T-Shirt
              </motion.h2>
              <motion.p 
                className="mx-auto max-w-2xl text-lg text-gray-900 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                We believe our community can bridge our divides. Our mission is to create designs that spark joy, encourage dialogue, and remind us that, fundamentally, we are all connected as humans here on earth.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link href="/mission" className="group inline-flex items-center justify-center rounded-full bg-emerald-400 border-2 border-gray-900 px-8 py-3 text-sm font-bold text-gray-900 shadow-lg transition-all duration-300 hover:bg-emerald-300 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300 active:scale-95 active:shadow-md">
                  Our Mission <ChevronRight className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-brand-off-white">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <motion.div 
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-dandelion text-yellow-600 mb-4">
                  <Eye size={36} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Choose a Design</h3>
                <p className="text-gray-800">Browse our collection of unique, smile-inducing designs.</p>
              </motion.div>
              {/* Step 2 */}
              <motion.div 
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-dandelion text-[#06D9FF] mb-4">
                  <Shirt size={36} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Select Your Fit</h3>
                <p className="text-gray-800">Pick your preferred size and color for the perfect fit.</p>
              </motion.div>
              {/* Step 3 */}
              <motion.div 
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-dandelion text-emerald-600 mb-4">
                  <ShoppingCart size={36} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Place Your Order</h3>
                <p className="text-gray-800">Securely check out and get ready to spread some joy, tolerance, and respect for others!</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-20 bg-yellow-50 rounded-lg shadow-md">
          <div className="mx-auto max-w-screen-xl px-4 text-center">
            <div className="max-w-3xl mx-auto p-8">
              <motion.h2 
                className="text-4xl font-bold text-brand-black mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
              >
                Join the Community
              </motion.h2>
              <motion.p 
                className="mx-auto max-w-2xl text-lg text-gray-700 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                See what our happy customers are saying. Share your own photos with #WeAllLaughTheSame!
              </motion.p>
              {/* Placeholder for testimonials or social media feed */}
              <div className="text-gray-500 italic">
                (Customer photos and testimonials coming soon!)
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-dandelion">
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
              <Link href="/checkout" className="group relative inline-block rounded-full bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-gray-700 px-12 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:from-gray-700 hover:to-gray-800 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500 active:scale-95 active:shadow-md">
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
