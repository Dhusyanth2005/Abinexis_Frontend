import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShoppingCart, Shield, Truck, Star, Heart, Zap } from 'lucide-react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const scrollContainerRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const animationFrameRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const currentIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);
  
  const slides = [
    {
      title: "Flash Sale",
      subtitle: "Up to 70% OFF",
      description: "Limited time offer on premium electronics & gadgets",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop",
      cta: "Shop Flash Sale",
      urgency: "⏰ Ends in 2 days",
      badge: "HOT DEAL"
    },
    {
      title: "New Arrivals",
      subtitle: "Latest Tech Trends",
      description: "Discover cutting-edge products before anyone else",
      image: "https://images.unsplash.com/photo-1560472355-536de3962603?w=1200&h=800&fit=crop",
      cta: "Explore New",
      urgency: "🔥 Just Launched",
      badge: "NEW"
    },
    {
      title: "Free Shipping",
      subtitle: "On Orders ₹50+",
      description: "Fast delivery worldwide with premium protection",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=800&fit=crop",
      cta: "Start Shopping",
      urgency: "🚚 Same Day Delivery",
      badge: "FREE"
    }
  ];

  const cards = [
    {
      id: 1,
      title: "Wireless Earbuds Pro",
      price: "₹129.99",
      originalPrice: "₹199.99",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Smart Watch Elite",
      price: "₹249.99",
      originalPrice: "₹349.99",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Gaming Headset",
      price: "₹89.99",
      originalPrice: "₹129.99",
      image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=300&h=300&fit=crop"
    },
    {
      id: 4,
      title: "Laptop Stand",
      price: "₹39.99",
      originalPrice: "₹59.99",
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop"
    },
    {
      id: 5,
      title: "Bluetooth Speaker",
      price: "₹79.99",
      originalPrice: "₹119.99",
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop"
    },
    {
      id: 6,
      title: "Phone Case Pro",
      price: "₹24.99",
      originalPrice: "₹34.99",
      image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&h=300&fit=crop"
    },
    {
      id: 7,
      title: "Charging Cable",
      price: "₹19.99",
      originalPrice: "₹29.99",
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop"
    },
    {
      id: 8,
      title: "Tablet Stand",
      price: "₹34.99",
      originalPrice: "₹49.99",
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop"
    }
  ];

  // Circular linked list implementation
  const createCircularList = useCallback(() => {
    const nodes = cards.map((card, index) => ({
      ...card,
      index,
      next: null,
      prev: null
    }));
    
    // Link nodes in circular fashion
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].next = nodes[(i + 1) % nodes.length];
      nodes[i].prev = nodes[i === 0 ? nodes.length - 1 : i - 1];
    }
    
    return nodes[0]; // Return head node
  }, [cards]);

  // Generate display cards using circular linked list
  const generateDisplayCards = useCallback(() => {
    const head = createCircularList();
    const displayCards = [];
    let current = head;
    
    // Generate enough cards to fill screen + buffer
    for (let i = 0; i < cards.length * 3; i++) {
      displayCards.push({
        ...current,
        displayId: `${current.id}-${i}`,
        position: i
      });
      current = current.next;
    }
    
    return displayCards;
  }, [cards, createCircularList]);

  const displayCards = generateDisplayCards();

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Smooth continuous scroll using transform
  const smoothScroll = useCallback(() => {
    if (!autoScroll || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const cardWidth = 240; // 220px + 20px gap
    const scrollSpeed = 0.5;
    
    const scroll = () => {
      if (!autoScroll || !scrollContainerRef.current) return;
      
      const currentTransform = container.style.transform || 'translateX(0px)';
      const currentX = parseFloat(currentTransform.replace('translateX(', '').replace('px)', '')) || 0;
      const newX = currentX - scrollSpeed;
      
      // Reset position for seamless loop
      const resetPoint = -cardWidth * cards.length;
      const finalX = newX <= resetPoint ? 0 : newX;
      
      container.style.transform = `translateX(${finalX}px)`;
      
      animationFrameRef.current = requestAnimationFrame(scroll);
    };
    
    animationFrameRef.current = requestAnimationFrame(scroll);
  }, [autoScroll, cards.length]);

  useEffect(() => {
    if (autoScroll) {
      scrollTimeoutRef.current = setTimeout(smoothScroll, 1000);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [autoScroll, smoothScroll]);

  const handleMouseEnter = useCallback(() => {
    setAutoScroll(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setAutoScroll(true);
  }, []);

  return (
    <div className="bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl animate-spin-slow"></div>
        </div>

        {/* Background Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80 z-10"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Main Content */}
        <div className="relative z-20 flex items-center justify-center h-full pt-10">
          <div className="text-center px-4 max-w-5xl mx-auto">
            <div className={`transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              {/* Badge */}
              <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-full text-emerald-400 font-semibold text-sm mb-4 backdrop-blur-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2"></span>
                {slides[currentSlide].badge}
              </div>

              {/* Main Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-3 leading-none">
                <span className="bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                  {slides[currentSlide].title}
                </span>
              </h1>

              {/* Subtitle */}
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-400 mb-3">
                {slides[currentSlide].subtitle}
              </h2>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
                {slides[currentSlide].description}
              </p>

              {/* Urgency Text */}
              <div className="text-base text-orange-400 font-semibold mb-6 animate-pulse">
                {slides[currentSlide].urgency}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                <button className="group relative px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-bold text-base transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40">
                  <span className="flex items-center justify-center space-x-2">
                    <span>{slides[currentSlide].cta}</span>
                    <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  </span>
                </button>
                
                <button className="px-8 py-3 border-2 border-emerald-500/50 rounded-xl text-white font-bold text-base hover:bg-emerald-500/10 backdrop-blur-sm transition-all duration-300 hover:border-emerald-400">
                  View Categories
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>Fast Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-emerald-400" />
                  <span>5-Star Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`relative transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-8 h-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full' 
                    : 'w-2 h-2 bg-white/30 rounded-full hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-8 animate-float">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-emerald-500/30">
            <Zap className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
        
        <div className="absolute top-1/3 right-8 animate-float-delay">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-cyan-500/30">
            <Heart className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
      </section>

      {/* Scrolling Cards Section - Circular Linked List Implementation */}
      <section className="py-6 bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden">
        <div className="w-full relative">
          <div className="overflow-hidden px-4">
            <div
              ref={scrollContainerRef}
              className="flex space-x-5 transition-transform duration-75 ease-linear"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ 
                transform: 'translateX(0px)',
                width: 'fit-content'
              }}
            >
              {displayCards.map((card) => (
                <div
                  key={card.displayId}
                  className="min-w-[220px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-300 group hover:shadow-lg hover:shadow-emerald-500/10"
                >
                  {/* Product Image */}
                  <div className="relative mb-3 overflow-hidden rounded-lg">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-40 object-cover transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Product Title */}
                  <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors duration-300">
                    {card.title}
                  </h3>

                  {/* Price Section */}
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">
                      under {card.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fog-like Gradient Fade Effects */}
          <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent pointer-events-none z-10"></div>
          <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-gray-950 via-gray-950/80 to-transparent pointer-events-none z-10"></div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(-2deg); }
        }
        
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float-delay 8s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;