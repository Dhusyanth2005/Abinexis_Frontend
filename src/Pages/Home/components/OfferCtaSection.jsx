import React from 'react';
import { Zap, ArrowDown, Sparkles, Timer, Gift, Shield, Truck, Star, CreditCard } from 'lucide-react';

const OfferCTASection = () => {
  const scrollToOffers = () => {
    const offersSection = document.getElementById('today-offers');
    if (offersSection) {
      offersSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="py-20 bg-gray-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-gradient-to-r from-[var(--primary-mint)] to-[var(--primary-turquoise)] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-gradient-to-r from-[var(--primary-blue)] to-[var(--primary-ocean)] rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[var(--primary-mint)]/30 to-[var(--primary-turquoise)]/30 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 animate-bounce delay-100">
          <Gift className="w-8 h-8 text-[var(--primary-mint)] opacity-30" />
        </div>
        <div className="absolute top-32 right-16 animate-bounce delay-300">
          <Sparkles className="w-6 h-6 text-[var(--primary-turquoise)] opacity-30" />
        </div>
        <div className="absolute bottom-24 left-20 animate-bounce delay-500">
          <Timer className="w-7 h-7 text-[var(--primary-mint)] opacity-30" />
        </div>
        <div className="absolute bottom-40 right-10 animate-bounce delay-700">
          <Zap className="w-9 h-9 text-[var(--primary-turquoise)] opacity-30" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
          {/* Main CTA Card - Takes 3 columns */}
          <div className="lg:col-span-3">
            <div className="relative bg-gray-950 rounded-2xl p-8 border-4 border-gray-800 overflow-hidden">
              
              {/* Moving glow border effect - Increased thickness */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div 
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent, transparent, var(--primary-mint), var(--primary-turquoise), transparent, transparent)',
                    opacity: '0.8',
                    animation: 'spin 3s linear infinite'
                  }}
                ></div>
                <div 
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'conic-gradient(from 180deg, transparent, transparent, var(--primary-turquoise), var(--primary-mint), transparent, transparent)',
                    opacity: '0.6',
                    animation: 'spin 4s linear infinite reverse'
                  }}
                ></div>
              </div>
              
              {/* Inner content background - Increased border thickness */}
              <div className="absolute inset-[4px] bg-gray-950 rounded-2xl"></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-lg">
                  <Zap className="w-4 h-4" />
                  LIMITED TIME ONLY
                  <Zap className="w-4 h-4" />
                </div>

                {/* Main heading */}
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  Don't Miss Out!
                  <br />
                  <span className="bg-gradient-to-r from-[var(--primary-mint)] to-[var(--primary-turquoise)] bg-clip-text text-transparent">
                    Exclusive Deals
                  </span>
                  <br />
                  <span className="text-2xl md:text-3xl text-gray-300">
                    Await You!
                  </span>
                </h2>

                {/* Description */}
                <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
                  Discover unbeatable offers on premium products. 
                  <span className="text-[var(--primary-mint)] font-semibold"> Up to 70% OFF </span>
                  on selected items for today only!
                </p>

                {/* Features list */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="flex items-center justify-center gap-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border-2 border-gray-700/50">
                    <div className="bg-gradient-to-r from-[var(--primary-mint)] to-[var(--primary-turquoise)] rounded-full p-2">
                      <Timer className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">Flash Sales</div>
                      <div className="text-gray-400 text-xs">Limited Time</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border-2 border-gray-700/50">
                    <div className="bg-gradient-to-r from-[var(--primary-mint)] to-[var(--primary-turquoise)] rounded-full p-2">
                      <Gift className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">Premium Quality</div>
                      <div className="text-gray-400 text-xs">Best Brands</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border-2 border-gray-700/50">
                    <div className="bg-gradient-to-r from-[var(--primary-mint)] to-[var(--primary-turquoise)] rounded-full p-2">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">Huge Savings</div>
                      <div className="text-gray-400 text-xs">Up to 70% OFF</div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <button 
                  onClick={scrollToOffers}
                  className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-[var(--primary-mint)] to-[var(--primary-turquoise)] text-white px-6 py-3 rounded-full font-bold text-base shadow-lg hover:shadow-xl hover:shadow-[var(--primary-mint)]/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-transparent"
                >
                  <Zap className="w-4 h-4 group-hover:animate-pulse" />
                  Explore Today's Offers
                  <ArrowDown className="w-4 h-4 group-hover:animate-bounce" />
                  
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-mint)] to-[var(--primary-turquoise)] rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
                </button>

                {/* Urgency text */}
                <div className="mt-4 flex items-center justify-center gap-2 text-yellow-400">
                  <Timer className="w-4 h-4 animate-pulse" />
                  <span className="text-sm font-semibold">⚡ These deals expire in 24 hours!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Advantage Cards - Right Side */}
          <div className="lg:col-span-1 space-y-4">
            {/* Free Shipping Card */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border-2 border-gray-700/50 hover:border-[var(--primary-mint)]/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-r from-[var(--primary-mint)] to-[var(--primary-turquoise)] rounded-full p-2 shrink-0">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">Free Shipping</h3>
                  <p className="text-gray-400 text-xs">On orders over $50</p>
                </div>
              </div>
            </div>

            {/* Money Back Guarantee Card */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border-2 border-gray-700/50 hover:border-[var(--primary-mint)]/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-r from-[var(--primary-mint)] to-[var(--primary-turquoise)] rounded-full p-2 shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">Money Back</h3>
                  <p className="text-gray-400 text-xs">30-day guarantee</p>
                </div>
              </div>
            </div>

            {/* 5-Star Rating Card */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border-2 border-gray-700/50 hover:border-[var(--primary-mint)]/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-r from-[var(--primary-mint)] to-[var(--primary-turquoise)] rounded-full p-2 shrink-0">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">5-Star Rated</h3>
                  <p className="text-gray-400 text-xs">Trusted by 10k+ customers</p>
                </div>
              </div>
            </div>

            {/* Secure Payment Card */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border-2 border-gray-700/50 hover:border-[var(--primary-mint)]/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-r from-[var(--primary-mint)] to-[var(--primary-turquoise)] rounded-full p-2 shrink-0">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">Secure Payment</h3>
                  <p className="text-gray-400 text-xs">SSL encrypted checkout</p>
                </div>
              </div>
            </div>

            {/* Bonus: Limited Stock Alert */}
            <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-4 border-2 border-red-500/30 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-2 shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">Limited Stock</h3>
                  <p className="text-gray-400 text-xs">Only 47 items left!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        :root {
          --primary-mint: #4ade80;
          --primary-turquoise: #06b6d4;
          --primary-blue: #3b82f6;
          --primary-ocean: #1e40af;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default OfferCTASection;