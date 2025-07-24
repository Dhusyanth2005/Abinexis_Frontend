import React, { useState } from 'react';
import { Truck, Shield, Headphones, RefreshCcw, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const AboutSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
    const Navigate = useNavigate();
  const handleGoBack = () => {
    Navigate("/");
  };

  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Free Shipping",
      description: "Free shipping on orders over $50 worldwide"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Payment",
      description: "Your payment information is safe and secure"
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Get help anytime, anywhere with our support team"
    },
    {
      icon: <RefreshCcw className="w-8 h-8" />,
      title: "Easy Returns",
      description: "30-day return policy for your peace of mind"
    }
  ];

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section id="about" className="py-20 bg-gray-950">
      {/* Header with Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-3 px-6 py-3 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700 hover:border-[#52B69A]/50 transition-all duration-300 group hover:bg-gray-800/70"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-[#52B69A] transition-colors duration-300" />
            <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Back</span>
          </button>
          
         
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content and Image Container */}
        <div className="p-8 lg:p-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                About <span className="bg-gradient-to-r from-[#52B69A] to-[#34A0A4] bg-clip-text text-transparent">Abinexis</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                We're not just another e-commerce platform. Abinexis is your gateway to premium products, 
                exceptional quality, and unmatched customer service. Our dropshipping model ensures you get 
                the best products at competitive prices, delivered right to your doorstep.
              </p>
              <p className="text-lg text-gray-400 mb-8">
                Founded with a vision to make luxury accessible, we curate only the finest products from 
                trusted suppliers worldwide. Every item in our collection is carefully selected to meet 
                our high standards of quality and design.
              </p>
              <button 
                onClick={toggleExpanded}
                className="px-8 py-4 bg-gradient-to-r from-[#52B69A] to-[#34A0A4] rounded-full text-white font-semibold hover:scale-105 transition-all duration-300 flex items-center gap-2 group"
              >
                Learn More About Us
                {isExpanded ? 
                  <ChevronUp className="w-5 h-5 transition-transform duration-300" /> : 
                  <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                }
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#52B69A] to-[#34A0A4] rounded-3xl blur-3xl opacity-20"></div>
              <img
                src="https://res.cloudinary.com/duwvhcha4/image/upload/v1751526148/WhatsApp_Image_2025-06-24_at_15.27.47_ca5e9032_qxapzq.jpg"
                alt="About Us"
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>

        {/* Dropdown Container */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100 mb-12' : 'max-h-0 opacity-0'}`}>
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-3xl border border-[#52B69A]/30 p-8 lg:p-12 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-[#52B69A]/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-[#52B69A] to-[#34A0A4] rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">V</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Our Vision</h3>
                <p className="text-gray-300">Smart, fast, global dropshipping that transforms how people discover and purchase premium products worldwide.</p>
              </div>
              
              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-[#52B69A]/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-[#52B69A] to-[#34A0A4] rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Our Mission</h3>
                <p className="text-gray-300">Making modern shopping effortless through innovation, AI-powered recommendations, and exceptional customer experience.</p>
              </div>
              
              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-[#52B69A]/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-[#52B69A] to-[#34A0A4] rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">From Our Founder</h3>
                <p className="text-gray-300 mb-3">
                  I'm Abinash Ramakrishnan, the founder of Abinexis. I created this company with one clear mission.
                </p>
                <p className="text-[#52B69A] font-semibold">
                  "Where AI meets commerce, and growth begins."
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-[#52B69A]/10 to-[#34A0A4]/10 rounded-2xl border border-[#52B69A]/20">
              <h3 className="text-xl font-bold text-white mb-4">Our Complete Story</h3>
              <p className="text-gray-300 mb-4">
                At Abinexis, we aim to blend customer satisfaction, automation, and innovation into one seamless platform. 
                This isn't just my business — it's the beginning of my journey in building something that lasts.
              </p>
              <p className="text-gray-300">
                We believe in the power of technology to create meaningful connections between customers and products, 
                making every shopping experience personal, efficient, and delightful.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-[#52B69A]/50 transition-all duration-300 group hover:transform hover:scale-105"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#52B69A] to-[#34A0A4] rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;