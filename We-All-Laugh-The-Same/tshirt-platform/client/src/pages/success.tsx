import React from 'react';
import { NextSeo } from 'next-seo';
import Link from 'next/link';

function SuccessPage() {
  return (
    <>
      <NextSeo
        title="Payment Successful - We All Laugh The Same"
        description="Thank you for your order."
      />
      <div className="bg-brand-off-white min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-dandelion">
              Thank You!
            </h1>
            <p className="mt-4 text-lg text-brand-black">
              Your order has been placed successfully.
            </p>
            <p className="mt-2 text-md text-gray-600">
              You will receive an email confirmation shortly.
            </p>
          </div>
          <div className="mt-6">
            <Link href="/" className="inline-block bg-dandelion text-brand-black font-semibold py-3 px-6 rounded-md shadow-md hover:bg-yellow-400 transition-colors duration-150">
                Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default SuccessPage;
