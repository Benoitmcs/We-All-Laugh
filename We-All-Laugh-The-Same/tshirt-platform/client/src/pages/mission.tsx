import { motion, Variants } from 'framer-motion';
import { Heart, Users, Sparkles, Target, Mail } from 'lucide-react';
import { useState } from 'react';

const MissionPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | ''>('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSubmitMessage('Please enter a valid email address');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitStatus('');

    try {
      const payload = [
        {
          "Email": email,
          "submittedAt": new Date().toISOString(),
          "formMode": "production"
        }
      ];

      const response = await fetch('https://n8n.srv879764.hstgr.cloud/webhook/42f63f19-74b1-4248-8207-5c1523bd014a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitMessage('Thank you! You\'ve been added to our newsletter.');
        setSubmitStatus('success');
        setEmail('');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      setSubmitMessage('Something went wrong. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const values = [
    {
      icon: Heart,
      title: "Unity",
      description: "Bringing people together through shared laughter",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: Sparkles,
      title: "Joy",
      description: "Creating moments of laughter in everyday life",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: Users,
      title: "Diversity",
      description: "Celebrating our differences while finding common ground",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Target,
      title: "Quality",
      description: "Crafting thoughtful designs with meaningful messages",
      color: "bg-green-100 text-green-600"
    }
  ];


  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-yellow-100 via-brand-off-white to-[#06D9FF]/20 py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-5xl sm:text-7xl font-extrabold text-dandelion mb-8"
            variants={itemVariants}
          >
            Our Mission
          </motion.h1>
          <motion.div
            className="bg-white shadow-2xl rounded-2xl p-8 md:p-12"
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
          >
            <div className="prose prose-lg sm:prose-xl max-w-none text-gray-800 text-center relative z-10">
              <motion.p
                className="mb-6 text-xl"
                variants={itemVariants}
              >
                At <span className="font-bold text-yellow-600  py-1 rounded">We All Laugh The Same</span>, our mission is to spread joy, foster unity, and celebrate diversity through our unique and creative t-shirt designs.
              </motion.p>
              <motion.p
                className="mb-6"
                variants={itemVariants}
              >
                We fundamentally believe that humor is a universal language and a powerful tool that transcends boundaries to bring people together. Laughter has the incredible ability to connect us, remind us of our shared humanity, and brighten even the toughest days.
              </motion.p>
              <motion.p
                className="mb-6"
                variants={itemVariants}
              >
                We are passionately committed to crafting high-quality, thoughtfully designed apparel that not only looks great but also carries a positive message. Each design is created with the hope of sparking conversations, inspiring smiles, and making a small but meaningful impact on the world.
              </motion.p>
              <motion.p
                className="text-xl font-semibold"
                variants={itemVariants}
              >
                Join us in <span className="font-bold text-yellow-600 py-1 rounded">wearing and sharing</span> the laughter.
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center text-brand-black mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            Our Core Values
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-brand-white p-6 rounded-xl shadow-lg text-center group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${value.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-brand-black mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section 
      <section className="py-20 bg-yellow-50 rounded-lg shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-4xl font-bold text-brand-black mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            Making a Difference Together
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-5xl font-bold text-dandelion mb-2">1000+</div>
              <div className="text-gray-700">Smiles Shared</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-5xl font-bold text-[#06D9FF] mb-2">50+</div>
              <div className="text-gray-700">Communities Reached</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="text-5xl font-bold text-emerald-500 mb-2">∞</div>
              <div className="text-gray-700">Connections Made</div>
            </motion.div>
          </div>
        </div>
      </section>*/}

      {/* Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-2xl mx-auto bg-brand-white shadow-lg rounded-2xl p-8 md:p-12"
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
              Join Our Community
            </h3>
            <p className="text-gray-600 text-lg">
              Get the latest updates on new designs, exclusive offers, and spread the laughter with us!
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                  submitStatus === 'success' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
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
                {isSubmitting ? 'Joining...' : 'Join the Community'}
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </motion.button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-dandelion">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-4xl font-bold text-brand-black mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            Ready to Spread Some Joy?
          </motion.h2>
          <motion.p
            className="text-xl text-brand-black mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Join our community and start wearing your smile today!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.a
              href="/checkout"
              className="inline-block rounded-full bg-gray-800 px-12 py-4 text-lg font-bold text-white shadow-lg hover:bg-gray-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-700 active:bg-gray-900 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Shop Our Designs
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default MissionPage;
