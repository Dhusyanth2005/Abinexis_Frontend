import React from 'react';
import { ArrowLeft, Mail } from 'lucide-react';

const ReturnRefundPolicy = () => {
  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackClick}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              style={{ backgroundColor: 'var(--primary-mint)' }}
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Return & Refund Policy</h1>
              <p className="text-gray-400 text-sm">Learn about our return and refund process</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Company Info */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--primary-mint)' }}>
              Abinexis - Return & Refund Policy
            </h2>
            <div className="space-y-2 text-gray-300">
              <p><strong>Effective Date:</strong> 03-08-2025</p>
              <p><strong>Website:</strong> www.abinexis.com</p>
              <p><strong>Contact Email:</strong> abinexisr@gmail.com</p>
            </div>
          </div>

          {/* Intro Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              We're Here to Help
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              At Abinexis, customer satisfaction is at the heart of everything we do. While we work hard to ensure your orders arrive in perfect condition, we understand that things don't always go as planned.
            </p>
            <p className="text-gray-300 leading-relaxed mb-8">
              This policy outlines how returns and refunds are handled at Abinexis.
            </p>

            {/* Policy Sections */}
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              1. Return Window
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              You can request a return within 7 days of receiving your order.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              To be eligible, the item must be:
            </p>
            <ul className="text-gray-300 leading-relaxed mb-4 ml-6 space-y-1">
              <li>• Damaged or defective</li>
              <li>• Incorrect (wrong item, color, or size)</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mb-8">
              Please note: We do not accept returns for buyer's remorse (e.g., change of mind).
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              2. What You'll Need
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              To start a return, please send us:
            </p>
            <ul className="text-gray-300 leading-relaxed mb-4 ml-6 space-y-1">
              <li>• Your order number</li>
              <li>• A brief description of the issue</li>
              <li>• Clear photos or videos of the damaged or incorrect product</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mb-8">
              Email everything to abinexisr@gmail.com. Our team will get back to you within 2 business days.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              3. Refunds
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              If your return is approved:
            </p>
            <ul className="text-gray-300 leading-relaxed mb-8 ml-6 space-y-1">
              <li>• We'll process a full or partial refund to your original payment method</li>
              <li>• Refunds are issued after reviewing the issue and confirming eligibility</li>
              <li>• It may take 5–10 business days for the refund to reflect in your account</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              4. Exchanges
            </h3>
            <p className="text-gray-300 leading-relaxed mb-8">
              In most cases, we do not offer exchanges due to the nature of dropshipping. However, if the item is clearly incorrect or defective, we may send a replacement free of charge.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              5. Non-Returnable Items
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              We do not accept returns for:
            </p>
            <ul className="text-gray-300 leading-relaxed mb-8 ml-6 space-y-1">
              <li>• Items returned after the 7-day window</li>
              <li>• Products damaged due to misuse or improper handling</li>
              <li>• Digital or downloadable items (if applicable)</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              6. Shipping Costs
            </h3>
            <p className="text-gray-300 leading-relaxed mb-8">
              Since most of our products ship directly from suppliers, return shipping may not be required. If a return is necessary, we will guide you through the process.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              7. Need Help?
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              We're here to make things right.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              If you have any concerns, just reach out to us at:
            </p>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" style={{ color: 'var(--primary-mint)' }} />
              <span className="text-sm">Email us at:</span>
              <a 
                href="mailto:abinexisr@gmail.com" 
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--primary-mint)' }}
              >
                abinexisr@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnRefundPolicy;