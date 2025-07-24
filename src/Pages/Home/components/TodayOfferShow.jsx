import React, { useState, useEffect } from 'react';
import { Star, Clock, Heart, ShoppingCart, Tag, Zap } from 'lucide-react';

const TodayOfferShow = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  const [likedOffers, setLikedOffers] = useState(new Set());

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const todayOffers = [
    {
      id: 1,
      title: "Premium Wireless Earbuds",
      originalPrice: 299,
      offerPrice: 149,
      discount: 50,
      rating: 4.9,
      reviews: 2847,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop",
      category: "Electronics"
    },
    {
      id: 2,
      title: "Smart Fitness Watch",
      originalPrice: 599,
      offerPrice: 399,
      discount: 33,
      rating: 4.8,
      reviews: 1923,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
      category: "Wearables"
    },
    {
      id: 3,
      title: "Designer Leather Bag",
      originalPrice: 450,
      offerPrice: 279,
      discount: 38,
      rating: 4.7,
      reviews: 856,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      category: "Fashion"
    },
    {
      id: 4,
      title: "Professional Camera Lens",
      originalPrice: 899,
      offerPrice: 649,
      discount: 28,
      rating: 4.9,
      reviews: 1456,
      image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop",
      category: "Photography"
    },
    {
      id: 5,
      title: "Luxury Skincare Set",
      originalPrice: 199,
      offerPrice: 129,
      discount: 35,
      rating: 4.8,
      reviews: 2341,
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop",
      category: "Beauty"
    },
    {
      id: 6,
      title: "Smart Home Speaker",
      originalPrice: 249,
      offerPrice: 179,
      discount: 28,
      rating: 4.6,
      reviews: 1098,
      image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400&h=300&fit=crop",
      category: "Smart Home"
    },
    {
      id: 7,
      title: "Gaming Mechanical Keyboard",
      originalPrice: 189,
      offerPrice: 119,
      discount: 37,
      rating: 4.7,
      reviews: 1567,
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop",
      category: "Gaming"
    },
    {
      id: 8,
      title: "Wireless Charging Pad",
      originalPrice: 79,
      offerPrice: 49,
      discount: 38,
      rating: 4.5,
      reviews: 892,
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
      category: "Accessories"
    },
    {
      id: 9,
      title: "Bluetooth Portable Speaker",
      originalPrice: 159,
      offerPrice: 99,
      discount: 38,
      rating: 4.6,
      reviews: 1234,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
      category: "Audio"
    },
    {
      id: 10,
      title: "USB-C Power Bank",
      originalPrice: 89,
      offerPrice: 59,
      discount: 34,
      rating: 4.4,
      reviews: 765,
      image: "https://images.unsplash.com/photo-1609592806788-0e8e6b7b8f48?w=400&h=300&fit=crop",
      category: "Accessories"
    },
    {
      id: 11,
      title: "Wireless Mouse",
      originalPrice: 69,
      offerPrice: 39,
      discount: 43,
      rating: 4.5,
      reviews: 1098,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
      category: "Computer"
    },
    {
      id: 12,
      title: "Phone Case Set",
      originalPrice: 39,
      offerPrice: 19,
      discount: 51,
      rating: 4.3,
      reviews: 543,
      image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop",
      category: "Mobile"
    }
  ];

  const toggleLike = (offerId) => {
    setLikedOffers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(offerId)) {
        newSet.delete(offerId);
      } else {
        newSet.add(offerId);
      }
      return newSet;
    });
  };

  return (
    <section id="today-offers" className="py-20 bg-gray-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[var(--primary-mint)] to-[var(--primary-turquoise)] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-[var(--primary-blue)] to-[var(--primary-ocean)] rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Zap className="w-8 h-8 text-[var(--primary-mint)]" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Today's <span className="bg-gradient-to-r from-[var(--primary-mint)] to-[var(--primary-turquoise)] bg-clip-text text-transparent">Hot Deals</span>
            </h2>
            <Zap className="w-8 h-8 text-[var(--primary-mint)]" />
          </div>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Unbelievable offers that won't last long. Grab these exclusive deals before they're gone!
          </p>

          {/* Countdown Timer */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-[var(--primary-mint)]">
              <Clock className="w-6 h-6" />
              <span className="text-lg font-semibold">Offer Ends In:</span>
            </div>
            <div className="flex gap-4">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="bg-gray-800 rounded-lg px-4 py-2 min-w-16">
                  <div className="text-2xl font-bold text-[var(--primary-mint)]">{value.toString().padStart(2, '0')}</div>
                  <div className="text-sm text-gray-400 capitalize">{unit}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {todayOffers.map((offer) => (
            <div key={offer.id} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              {/* Image Section */}
              <div className="relative">
                <img 
                  src={offer.image} 
                  alt={offer.title}
                  className="w-full h-36 object-cover"
                />
                
                {/* Category Tag */}
                <div className="absolute top-2 left-2 bg-[var(--primary-mint)]/20 backdrop-blur-sm border border-[var(--primary-mint)]/30 text-[var(--primary-mint)] px-2 py-1 rounded text-xs font-semibold">
                  {offer.category}
                </div>

                {/* Discount Badge */}
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  -{offer.discount}%
                </div>

                {/* Heart Icon */}
                <button 
                  onClick={() => toggleLike(offer.id)}
                  className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-1 hover:bg-black/70 transition-colors duration-300"
                >
                  <Heart 
                    className={`w-4 h-4 ${likedOffers.has(offer.id) ? 'text-red-500 fill-current' : 'text-white'}`}
                  />
                </button>
              </div>

              {/* Content Section */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-sm font-medium text-white mb-2 line-clamp-2 leading-tight">
                  {offer.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(offer.rating) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 ml-1">({offer.reviews.toLocaleString()})</span>
                </div>

                {/* Price Section */}
                <div className="mb-4 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[var(--primary-mint)]">
                      ₹{offer.offerPrice}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₹{offer.originalPrice}
                    </span>
                  </div>
                  <div className="text-xs text-green-400 font-medium">
                    Save ₹{offer.originalPrice - offer.offerPrice}
                  </div>
                </div>

                {/* Action Button */}
                 <button className="w-full bg-[var(--primary-mint)] text-white py-2 px-3 rounded text-sm font-medium hover:bg-[var(--primary-turquoise)] transition-colors duration-300 flex items-center justify-center gap-1 mt-auto">
                  <ShoppingCart className="w-4 h-4" />
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TodayOfferShow;