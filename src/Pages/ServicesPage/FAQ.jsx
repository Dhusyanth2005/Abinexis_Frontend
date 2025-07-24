import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft, Mail, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqData = [
    {
      category: "Getting Started",
      questions: [
        {
          id: "age-requirement",
          question: "What age do I need to be to use Abinexis?",
          answer: "You must be 18 or older—or the legal age in your country—to use our services. By signing up or placing an order, you confirm that you meet this requirement."
        },
        {
          id: "how-to-order",
          question: "How do I place an order?",
          answer: "Simply browse our products, add items to your cart, and proceed to checkout. Orders are processed only after full payment through our secure third-party payment gateways."
        },
        {
          id: "payment-security",
          question: "Is my payment information secure?",
          answer: "Yes! We use secure third-party payment gateways and we don't store your card details. Your payment information is processed safely and securely."
        }
      ]
    },
    {
      category: "Orders & Pricing",
      questions: [
        {
          id: "out-of-stock",
          question: "What happens if an item is out of stock?",
          answer: "Sometimes products may be out of stock or prices may be listed incorrectly. In such cases, we may cancel the order and will notify you as soon as possible."
        },
        {
          id: "price-changes",
          question: "Can prices change after I place an order?",
          answer: "All prices are in INR/USD and may change from time to time. However, once your order is placed and payment is processed, the price is locked in for that order."
        },
        {
          id: "currency",
          question: "What currency are prices displayed in?",
          answer: "All prices are displayed in INR/USD and may change from time to time based on market conditions."
        }
      ]
    },
    {
      category: "Shipping & Delivery",
      questions: [
        {
          id: "shipping-process",
          question: "How does shipping work?",
          answer: "We work with trusted suppliers who ship directly to your customers. This dropshipping model allows us to offer a wide variety of products efficiently."
        },
        {
          id: "delivery-time",
          question: "How long does delivery take?",
          answer: "Delivery times depend on where the order is going and the product itself. While we aim to be prompt, we can't be held responsible for delays beyond our control, like customs or weather."
        },
        {
          id: "shipping-delays",
          question: "What if my order is delayed?",
          answer: "While we strive for prompt delivery, delays can occur due to factors beyond our control such as customs processing, weather conditions, or supplier issues. We'll keep you updated on any significant delays."
        }
      ]
    },
    {
      category: "Returns & Refunds",
      questions: [
        {
          id: "return-window",
          question: "How long do I have to return an item?",
          answer: "You can request a return within 7 days of receiving your order. The item must be damaged, defective, or incorrect (wrong item, color, or size)."
        },
        {
          id: "return-process",
          question: "How do I start a return?",
          answer: "Email us at abinexisr@gmail.com with your order number, a brief description of the issue, and clear photos or videos of the damaged or incorrect product. Our team will respond within 2 business days."
        },
        {
          id: "refund-time",
          question: "How long does it take to get a refund?",
          answer: "If your return is approved, we'll process a full or partial refund to your original payment method. It may take 5–10 business days for the refund to reflect in your account."
        },
        {
          id: "exchanges",
          question: "Do you offer exchanges?",
          answer: "In most cases, we do not offer exchanges due to the nature of dropshipping. However, if the item is clearly incorrect or defective, we may send a replacement free of charge."
        },
        {
          id: "non-returnable",
          question: "What items cannot be returned?",
          answer: "We do not accept returns for: items returned after the 7-day window, products damaged due to misuse or improper handling, digital or downloadable items, or returns due to buyer's remorse (change of mind)."
        }
      ]
    },
    {
      category: "Privacy & Data",
      questions: [
        {
          id: "data-collection",
          question: "What personal information do you collect?",
          answer: "We collect your name, email, phone number, shipping and billing addresses, payment and order details, IP address and browser/device info, and any messages or support inquiries you send us."
        },
        {
          id: "data-usage",
          question: "How do you use my information?",
          answer: "We use your information to complete your orders, respond to your questions, improve your shopping experience, prevent fraud and keep the platform secure, and share important updates or offers (only if you've opted in)."
        },
        {
          id: "data-sharing",
          question: "Do you share my data with others?",
          answer: "We only share your data when necessary: with our suppliers and shipping partners to deliver your order, with payment providers to complete transactions, or with law enforcement if required by law. We never sell or rent your personal data."
        },
        {
          id: "data-control",
          question: "Can I control my personal data?",
          answer: "Yes! You can access or update your personal info, ask us to delete your data, or unsubscribe from marketing at any time. Just email us at abinexisr@gmail.com and we'll assist you."
        },
        {
          id: "cookies",
          question: "Do you use cookies?",
          answer: "We use cookies to make your experience smoother — like remembering your preferences or helping pages load faster. You can always control cookies in your browser settings."
        }
      ]
    },
    {
      category: "Account & Legal",
      questions: [
        {
          id: "account-suspension",
          question: "Can my account be suspended?",
          answer: "We trust that you'll use Abinexis respectfully and honestly. Don't misuse the platform or break the law. If we find any misuse, we may suspend or end your access."
        },
        {
          id: "content-ownership",
          question: "Who owns the content on your website?",
          answer: "Everything on the Abinexis website—like our branding, product descriptions, and graphics—belongs to us. Please don't copy or reuse it without our permission."
        },
        {
          id: "terms-updates",
          question: "Do you update your terms and policies?",
          answer: "We might update these Terms as our services evolve. If we do, we'll let you know. By continuing to use Abinexis, you agree to the updated terms."
        },
        {
          id: "legal-jurisdiction",
          question: "What laws govern these terms?",
          answer: "These Terms are governed by Indian law. Any legal matters will be handled in the courts of Trichy, Tamil Nadu."
        }
      ]
    }
  ];

  const FAQItem = ({ question, answer, id, isOpen, toggle }) => (
    <div className="border border-gray-800 rounded-lg overflow-hidden mb-4 bg-gray-900/50">
      <button
        onClick={() => toggle(id)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors duration-200"
      >
        <span className="font-medium text-white pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-gray-300 leading-relaxed border-t border-gray-800">
          <div className="pt-4">{answer}</div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Frequently Asked Questions</h1>
                <p className="text-gray-100 mt-1">Find answers to common questions about Abinexis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Quick Contact Banner */}
        <div className="bg-gradient-to-r from-[var(--brand-accent)] to-[var(--primary-ocean)] rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <Mail className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-xl font-semibold text-white">Still have questions?</h2>
              <p className="text-gray-100 mt-1">
                Can't find what you're looking for? Email us at{' '}
                <a href="mailto:abinexisr@gmail.com" className="text-white font-medium hover:underline">
                  abinexisr@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        {faqData.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--brand-primary)] mb-6 flex items-center">
              <span className="w-1 h-8 bg-[var(--brand-primary)] rounded-full mr-3"></span>
              {category.category}
            </h2>
            
            <div className="space-y-3">
              {category.questions.map((item) => (
                <FAQItem
                  key={item.id}
                  question={item.question}
                  answer={item.answer}
                  id={item.id}
                  isOpen={openItems[item.id]}
                  toggle={toggleItem}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Contact Footer */}
        <div className="mt-12 text-center p-8 bg-gray-900/50 rounded-lg border border-gray-800">
          <h3 className="text-xl font-semibold text-[var(--brand-primary)] mb-4">Need More Help?</h3>
          <p className="text-gray-300 mb-4">
            Our support team is here to help you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
            <a 
              href="mailto:abinexisr@gmail.com"
              className="flex items-center space-x-2 text-[var(--brand-primary)] hover:text-[var(--brand-secondary)] transition-colors duration-200"
            >
              <Mail className="w-5 h-5" />
              <span>abinexisr@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;