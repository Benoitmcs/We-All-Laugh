import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { NextSeo } from 'next-seo';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function ReturnPage() {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    fetch(`/api/checkout/session?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === 'open') {
    return (
      <NextSeo noindex={true} />
    )
  }

  if (status === 'complete') {
    return (
      <>
        <NextSeo title="Thanks for your order!" noindex={true} />
        <div className="bg-brand-off-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-dandelion mb-4">Payment successful!</h1>
            <p className="text-lg text-brand-black">
              Thank you for your purchase! A confirmation email has been sent to {customerEmail}.
            </p>
          </div>
        </div>
      </>
    )
  }

  return null;
}

export default ReturnPage;
