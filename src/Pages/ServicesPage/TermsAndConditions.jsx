import React from 'react';
import { ArrowLeft, Mail } from 'lucide-react';

const TermsAndConditions = () => {
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
              <h1 className="text-2xl font-bold">Terms and Conditions</h1>
              <p className="text-gray-400 text-sm">Please read these terms carefully before using our services</p>
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
              Abinexis - Dropshipping Terms and Conditions
            </h2>
            <div className="space-y-2 text-gray-300">
              <p><strong>Effective Date:</strong> 03-08-2025</p>
              <p><strong>Company Name:</strong> Abinexis</p>
              <p><strong>Website:</strong> www.abinexis.com</p>
              <p><strong>Contact Email:</strong> abinexisr@gmail.com</p>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              1. Welcome
            </h3>
            <p className="text-gray-300 leading-relaxed mb-8">
              Thanks for choosing Abinexis! By using our website and services, you agree to these Terms and Conditions. Please take a moment to read them. If you don't agree, we kindly ask you not to use the platform.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              2. Who Can Use Abinexis?
            </h3>
            <p className="text-gray-300 leading-relaxed mb-8">
              You must be 18 or older—or the legal age in your country—to use our services. By signing up or placing an order, you confirm that you meet this requirement.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              3. Ordering Products
            </h3>
            <p className="text-gray-300 leading-relaxed mb-8">
              When you place an order, we'll do our best to fulfill it. Sometimes, products may be out of stock or prices may be listed incorrectly. In such cases, we may cancel the order and will notify you as soon as possible.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              4. Pricing & Payments
            </h3>
            <p className="text-gray-300 leading-relaxed mb-8">
              All prices are in [INR/USD] and may change from time to time. Orders are processed only after full payment. We use secure third-party payment gateways, and we don't store your card details.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              5. Shipping & Delivery
            </h3>
            <p className="text-gray-300 leading-relaxed mb-8">
              We work with trusted suppliers who ship directly to your customers. Delivery times depend on where the order is going and the product itself. While we aim to be prompt, we can't be held responsible for delays beyond our control, like customs or weather.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              6. Returns & Refunds
            </h3>
            <p className="text-gray-300 leading-relaxed mb-8">
              You can request a return within [7/14] days of delivery—but only if the item is defective or incorrect. Please provide clear proof (like photos or a video). If approved, we'll process a refund after reviewing the issue.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              7. Our Content
            </h3>
            <p className="text-gray-300 leading-relaxed mb-8">
              Everything on the Abinexis website—like our branding, product descriptions, and graphics—belongs to us. Please don't copy or reuse it without our permission.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              8. Your Responsibilities
            </h3>
            <p className="text-gray-300 leading-relaxed mb-8">
              We trust that you'll use Abinexis respectfully and honestly. Don't misuse the platform or break the law. If we find any misuse, we may suspend or end your access.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              9. Liability
            </h3>
            <p className="text-gray-300 leading-relaxed mb-8">
              We do our best to provide a reliable and smooth experience. However, Abinexis can't be held responsible for losses or damages that may arise from using our services.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              10. Updates to These Terms
            </h3>
            <p className="text-gray-300 leading-relaxed mb-8">
              We might update these Terms as our services evolve. If we do, we'll let you know. By continuing to use Abinexis, you agree to the updated terms.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              11. Legal Stuff
            </h3>
            <p className="text-gray-300 leading-relaxed mb-8">
              These Terms are governed by Indian law. Any legal matters will be handled in the courts of [Insert City/State, e.g., Trichy, Tamil Nadu].
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              12. Need Help?
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Have a question or concern? We're here for you.
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

export default TermsAndConditions;