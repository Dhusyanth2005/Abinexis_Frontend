import React from 'react';
import { ArrowLeft, Mail } from 'lucide-react';

const ShippingInformation = () => {
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
              <h1 className="text-2xl font-bold">Shipping Information</h1>
              <p className="text-gray-400 text-sm">Learn about our shipping process and delivery times</p>
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
              Abinexis - Shipping Information
            </h2>
            <div className="space-y-2 text-gray-300">
              <p><strong>Effective Date:</strong> 03-08-2025</p>
              <p><strong>Website:</strong> www.abinexis.com</p>
              <p><strong>Contact Email:</strong> abinexisr@gmail.com</p>
            </div>
          </div>

          {/* Shipping Information Sections */}
          <div className="space-y-8">
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              1. How We Ship Your Orders
            </h3>
            <p className="text-gray-300 leading-relaxed mb-8">
              At Abinexis, we work with trusted third-party suppliers to deliver quality products to your doorstep. Since we operate using a dropshipping model, shipping times and processes may vary depending on the supplier and your location.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              2. Processing Time
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Once you place an order, we begin processing it within 1–3 business days.
            </p>
            <p className="text-gray-300 leading-relaxed mb-8">
              You'll receive a confirmation email once your order is shipped.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              3. Estimated Delivery Time
            </h3>
            <ul className="text-gray-300 leading-relaxed mb-4 ml-6 space-y-1">
              <li>• Domestic Orders (India): Usually delivered in 7–12 business days.</li>
              <li>• International Orders: May take 10–20 business days, depending on the destination.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mb-8">
              Please note: These are estimates. Delays can happen due to customs, weather, or supply chain issues beyond our control.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              4. Tracking Your Order
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              As soon as your order ships, we'll send you a tracking link via email (if available).
            </p>
            <p className="text-gray-300 leading-relaxed mb-8">
              Not all orders may come with tracking, especially if shipped from smaller vendors.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              5. Shipping Costs
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              We offer free standard shipping on most products.
            </p>
            <p className="text-gray-300 leading-relaxed mb-8">
              If a product has any additional shipping charges, it will be clearly mentioned on the product page before checkout.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              6. Issues With Shipping?
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              If your order is taking longer than expected or arrives damaged, don't worry—we're here to help.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Just send us:
            </p>
            <ul className="text-gray-300 leading-relaxed mb-4 ml-6 space-y-1">
              <li>• Your order number</li>
              <li>• A description of the issue</li>
              <li>• Any photos or videos, if applicable</li>
            </ul>
            <div className="flex items-center space-x-2 mb-4">
              <Mail className="w-4 h-4" style={{ color: 'var(--primary-mint)' }} />
              <span className="text-sm">Email:</span>
              <a 
                href="mailto:abinexisr@gmail.com" 
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--primary-mint)' }}
              >
                abinexisr@gmail.com
              </a>
            </div>
            <p className="text-gray-300 leading-relaxed">
              We'll respond within 2 business days and do our best to resolve the issue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInformation;