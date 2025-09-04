import React, { useState, useEffect, useRef, useCallback, useMemo, Component } from 'react';
import { ShoppingCart, Shield, Truck, Star, Heart, Zap } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-gray-900 h-[70vh] flex items-center justify-center">
          <div className="text-white text-xl">
            Something went wrong. Please try again later.
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [homepageData, setHomepageData] = useState({ banners: [], featuredProducts: [] });
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const animationFrameRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const isTransitioningRef = useRef(false);
  const navigate = useNavigate();
  const [currentUrgencyIndex, setCurrentUrgencyIndex] = useState(0);

  const urgencyMessages = [
    "Hurry! This exclusive deal ends in just a few hours.",
    "Don't miss out—limited stock available, act fast!",
    "Time's ticking—grab this offer before it’s gone!",
    "Last chance to save big—shop now while it lasts!"
  ];

  const fetchHomepageData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://abinexis-backend.onrender.com/api/homepage', {
        params: { populate: 'banners.searchProduct' } // Populate searchProduct to get category
      });
      setHomepageData({
        banners: response.data.banners || [],
        featuredProducts: response.data.featuredProducts || []
      });
    } catch (error) {
      console.error('Error fetching homepage data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomepageData();
  }, [fetchHomepageData]);

  const slides = homepageData.banners.map(banner => {
    const searchProduct = banner.searchProduct;
    return {
      title: banner.title || 'Untitled',
      subtitle: banner.description || 'Featured Collection',
      image: banner.image || 'https://via.placeholder.com/1200x800',
      cta: 'Shop Now',
      urgency: urgencyMessages[currentUrgencyIndex], // Dynamic urgency message
      badge: 'FEATURED',
      searchProductId: searchProduct?._id || null,
      category: searchProduct?.category || 'default' // Assuming category is a field in Product schema
    };
  });

  // Fetch price details for featured products with initial filter values
  const fetchPriceDetails = useCallback(async (products) => {
    const token = localStorage.getItem('token') || '';
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const updatedProducts = await Promise.all(
      products.map(async (product) => {
        try {
          // Initialize filters with the first value of each filter
          const initialFilters = {};
          product.filters?.forEach(filter => {
            if (filter.values && filter.values.length > 0) {
              initialFilters[filter.name] = filter.values[0];
            }
          });

          const priceResponse = await axios.get(
            `https://abinexis-backend.onrender.com/api/products/${product._id}/price-details`,
            {
              headers,
              params: { selectedFilters: JSON.stringify(initialFilters) }
            }
          );
          const priceDetails = priceResponse.data;
          const discount = priceDetails.normalPrice > priceDetails.effectivePrice && priceDetails.effectivePrice > 0
            ? Math.round(((priceDetails.normalPrice - priceDetails.effectivePrice) / priceDetails.normalPrice) * 100)
            : 0;

          return {
            ...product,
            name: product.name,
            image: product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300',
            displayPrice: priceDetails.effectivePrice || 0,
            originalPrice: priceDetails.normalPrice || 0,
            discount,
            shippingCost: priceDetails.shippingCost || 0
          };
        } catch (error) {
          console.error(`Error fetching price details for product ${product._id}:`, error);
          return {
            ...product,
            name: product.name || 'Unnamed Product',
            image: product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300',
            displayPrice: 0,
            originalPrice: 0,
            discount: 0,
            shippingCost: 0
          };
        }
      })
    );
    return updatedProducts;
  }, []);

  // Update cards when homepageData changes
  useEffect(() => {
    const updateCards = async () => {
      if (homepageData.featuredProducts.length > 0) {
        const updatedCards = await fetchPriceDetails(homepageData.featuredProducts);
        setCards(updatedCards);
      } else {
        setCards([]);
      }
    };
    updateCards();
  }, [homepageData.featuredProducts, fetchPriceDetails]);

  const createCircularList = useCallback(() => {
    if (!cards.length) return null;
    const nodes = cards.map((card, index) => ({
      ...card,
      index,
      next: null,
      prev: null
    }));
    
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].next = nodes[(i + 1) % nodes.length];
      nodes[i].prev = nodes[i === 0 ? nodes.length - 1 : i - 1];
    }
    
    return nodes[0];
  }, [cards]);

  const generateDisplayCards = useCallback(() => {
    const head = createCircularList();
    if (!head) return [];
    
    const displayCards = [];
    let current = head;
    
    for (let i = 0; i < cards.length * 3; i++) {
      displayCards.push({
        ...current,
        displayId: `${current._id}-${i}`,
        position: i
      });
      current = current.next;
    }
    
    return displayCards;
  }, [cards, createCircularList]);

  const displayCards = useMemo(() => generateDisplayCards(), [generateDisplayCards]);

  useEffect(() => {
    if (slides.length === 0) return;
    
    setIsVisible(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    const urgencyTimer = setInterval(() => {
      setCurrentUrgencyIndex((prev) => (prev + 1) % urgencyMessages.length);
    }, 5000); // Change urgency message every 5 seconds

    return () => {
      clearInterval(timer);
      clearInterval(urgencyTimer);
    };
  }, [slides.length]);

  const smoothScroll = useCallback(() => {
    if (!autoScroll || !scrollContainerRef.current || !cards.length) return;

    const container = scrollContainerRef.current;
    const cardWidth = 240;
    const scrollSpeed = 0.5;

    const scroll = () => {
      if (!autoScroll || !scrollContainerRef.current) return;
      
      const currentTransform = container.style.transform || 'translateX(0px)';
      const currentX = parseFloat(currentTransform.replace('translateX(', '').replace('px)', '')) || 0;
      const newX = currentX - scrollSpeed;
      
      const resetPoint = -cardWidth * cards.length;
      const finalX = newX <= resetPoint ? 0 : newX;
      
      container.style.transform = `translateX(${finalX}px)`;
      
      animationFrameRef.current = requestAnimationFrame(scroll);
    };
    
    animationFrameRef.current = requestAnimationFrame(scroll);
  }, [autoScroll, cards.length]);

  useEffect(() => {
    if (autoScroll && cards.length > 0) {
      scrollTimeoutRef.current = setTimeout(smoothScroll, 1000);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [autoScroll, smoothScroll, cards.length]);

  const handleMouseEnter = useCallback(() => {
    setAutoScroll(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setAutoScroll(true);
  }, []);

  const handleCardClick = (category, productId) => {
    navigate(`/shop/${category.toLowerCase()}/${productId}`);
  };

  const handleShopNow = () => {
    const currentSlideData = slides[currentSlide];
    if (currentSlideData.searchProductId) {
      navigate(`/shop/${currentSlideData.category.toLowerCase()}/${currentSlideData.searchProductId}`);
    }
  };

  const handleViewCategories = () => {
    const currentSlideData = slides[currentSlide];
    if (currentSlideData.category) {
      navigate(`/shop/${currentSlideData.category.toLowerCase()}`);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 h-[70vh] flex items-center justify-center">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#52B69A]"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="bg-gray-900">
        <section className="relative h-[70vh] overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl animate-spin-slow"></div>
          </div>

          {slides.length > 0 && slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  console.error('Image failed to load:', slide.image);
                  e.target.src = 'https://via.placeholder.com/1200x800';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80 z-10"></div>
            </div>
          ))}

          <div className="relative z-20 flex items-center justify-center h-full pt-10">
            <div className="text-center px-4 max-w-5xl mx-auto">
              <div className={`transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                {slides.length > 0 && (
                  <>
                     <div className="hidden md:inline-flex items-center px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-full text-emerald-400 font-semibold text-sm mb-4 backdrop-blur-sm">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2"></span>
                      {slides[currentSlide].badge}
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-3 leading-none">
                      <span className="bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                        {slides[currentSlide].title}
                      </span>
                    </h1>

                    <h2 className="text-2xl md:text-3xl font-bold text-emerald-400 mb-3">
                      {slides[currentSlide].subtitle}
                    </h2>

                    <p className="text-lg md:text-xl text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
                      {slides[currentSlide].description}
                    </p>

                    <div className="text-base text-orange-400 font-semibold mb-6 animate-pulse">
                      {slides[currentSlide].urgency}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                      <button
                        onClick={handleShopNow}
                        className="group relative px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-bold text-base transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <span>{slides[currentSlide].cta}</span>
                          <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        </span>
                      </button>
                      <button
                        onClick={handleViewCategories}
                        className="px-8 py-3 border-2 border-emerald-500/50 rounded-xl text-white font-bold text-base hover:bg-emerald-500/10 backdrop-blur-sm transition-all duration-300 hover:border-emerald-400"
                      >
                        View Categories
                      </button>
                    </div>

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
                  </>
                )}
              </div>
            </div>
          </div>

          {slides.length > 0 && (
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
          )}

          {/* Zap icon - Hidden on mobile (sm and below) */}
          <div className="absolute top-1/4 left-8 animate-float hidden md:block">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-emerald-500/30">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          
          {/* Heart icon - Hidden on mobile (sm and below) */}
          <div className="absolute top-1/3 right-8 animate-float-delay hidden md:block">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-cyan-500/30">
              <Heart className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
        
        </section>

        {cards.length > 0 && (
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
                      className="min-w-[220px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-300 group hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer"
                      onClick={() => handleCardClick(card.category, card._id)}
                    >
                      <div className="relative mb-3 overflow-hidden rounded-lg">
                        <img
                          src={card.image}
                          alt={card.name}
                          className="w-full h-40 object-cover transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            console.error('Image failed to load:', card.image);
                            e.target.src = 'https://via.placeholder.com/300';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        {card.discount > 0 && (
                          <div className="absolute top-2 left-2 text-white px-2 py-1 rounded text-xs font-bold bg-red-500">
                            -{card.discount}%
                          </div>
                        )}
                      </div>

                      <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors duration-300">
                        {card.name}
                      </h3>

                      <div className="text-center">
                        <div className="text-xs text-gray-400 mb-1">
                          {card.discount > 0 && (
                            <span className="line-through mr-2">₹{card.originalPrice}</span>
                          )}
                          <span className="text-lg font-bold">₹{card.displayPrice}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent pointer-events-none z-10"></div>
              <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-gray-950 via-gray-950/80 to-transparent pointer-events-none z-10"></div>
            </div>
          </section>
        )}

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
    </ErrorBoundary>
  );
};

export default HeroSection;