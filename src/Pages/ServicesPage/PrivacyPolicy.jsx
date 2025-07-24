import React from 'react';
import { ArrowLeft, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
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
              <h1 className="text-2xl font-bold">Privacy Policy</h1>
              <p className="text-gray-400 text-sm">Learn how we protect and handle your personal information</p>
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
              Abinexis - Privacy Policy
            </h2>
            <div className="space-y-2 text-gray-300">
              <p><strong>Effective Date:</strong> 03-08-2025</p>
              <p><strong>Company Name:</strong> Abinexis</p>
              <p><strong>Website:</strong> www.abinexis.com</p>
              <p><strong>Contact Email:</strong> abinexisr@gmail.com</p>
            </div>
          </div>

          {/* Privacy Policy Sections */}
          <div className="space-y-8">
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              1. Your Privacy Matters
            </h3>
            <p className="text-gray-300 leading-relaxed mb-8">
              At Abinexis, we value your trust. This Privacy Policy explains what personal information we collect, why we collect it, and how we keep it safe. By using our website and services, you agree to the terms below.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              2. What We Collect
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              When you use Abinexis, we may collect:
            </p>
            <ul className="text-gray-300 leading-relaxed mb-8 ml-6 space-y-1">
              <li>• Your name, email, phone number</li>
              <li>• Shipping and billing addresses</li>
              <li>• Payment and order details</li>
              <li>• IP address and browser/device info</li>
              <li>• Messages or support inquiries you send us</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              3. Why We Collect It
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="text-gray-300 leading-relaxed mb-8 ml-6 space-y-1">
              <li>• Complete your orders</li>
              <li>• Respond to your questions</li>
              <li>• Improve your shopping experience</li>
              <li>• Prevent fraud and keep the platform secure</li>
              <li>• Share important updates or offers (only if you've opted in)</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              4. Who We Share It With
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              We only share your data when necessary:
            </p>
            <ul className="text-gray-300 leading-relaxed mb-4 ml-6 space-y-1">
              <li>• With our suppliers and shipping partners to deliver your order</li>
              <li>• With payment providers to complete your transactions</li>
              <li>• With law enforcement if required by law</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mb-8">
              We never sell or rent your personal data.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              5. How We Protect Your Data
            </h3>
            <p className="text-gray-300 leading-relaxed mb-8">
              We follow standard security practices to keep your data safe. While we do our best, no system is perfect — so we encourage you to use strong passwords and be mindful of your own online security too.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              6. Cookies & Tracking
            </h3>
            <p className="text-gray-300 leading-relaxed mb-8">
              We use cookies to make your experience smoother — like remembering your preferences or helping pages load faster. You can always control cookies in your browser settings.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              7. External Links
            </h3>
            <p className="text-gray-300 leading-relaxed mb-8">
              Some pages may link to other websites. We're not responsible for their content or privacy policies, so we recommend reviewing them separately.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              8. Your Choices
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              You have full control over your data. You can:
            </p>
            <ul className="text-gray-300 leading-relaxed mb-4 ml-6 space-y-1">
              <li>• Access or update your personal info</li>
              <li>• Ask us to delete your data</li>
              <li>• Unsubscribe from marketing at any time</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mb-8">
              Just drop us a message at abinexisr@gmail.com and we'll assist you.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              9. Policy Updates
            </h3>
            <p className="text-gray-300 leading-relaxed mb-8">
              We may update this policy from time to time. If we make big changes, we'll let you know. Using our website after changes means you agree to the updated policy.
            </p>

            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
              10. Contact Us
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Questions about how we handle your data?
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

export default PrivacyPolicy;