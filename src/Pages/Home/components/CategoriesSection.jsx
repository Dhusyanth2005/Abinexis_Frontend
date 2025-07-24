import React, { useState } from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-[#52B69A] to-[#34A0A4] text-white px-3 py-1 rounded-full text-xs font-semibold">
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold text-sm mb-2 truncate">{product.name}</h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < product.rating ? 'text-yellow-400' : 'text-gray-600'}>
                ★
              </span>
            ))}
          </div>
          <span className="text-gray-400 text-xs">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#52B69A] font-bold">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-gray-500 line-through text-sm">₹{product.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const CategoriesSection = () => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  const allCategories = [
    'Electronics',
    'Fashion', 
    'Beauty',
    'Health',
    'Kitchen',
    'Fitness',
    'Spiritual',
    'Kids',
    'Pets',
    'Stationery',
  ];

  const categories = [
    {
      name: "Electronics",
      count: 245,
      products: [
        {
          id: 1,
          name: "Wireless Headphones Pro",
          price: 299,
          originalPrice: 399,
          rating: 5,
          reviews: 128,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
          badge: "Best Seller"
        },
        {
          id: 2,
          name: "Smart Watch Series X",
          price: 599,
          rating: 4,
          reviews: 89,
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
          badge: "New"
        },
        {
          id: 3,
          name: "Bluetooth Speaker",
          price: 149,
          originalPrice: 199,
          rating: 4,
          reviews: 67,
          image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop"
        },
        {
          id: 10,
          name: "Gaming Laptop Pro",
          price: 1299,
          originalPrice: 1599,
          rating: 5,
          reviews: 234,
          image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop",
          badge: "Gaming"
        },
        {
          id: 11,
          name: "4K Webcam Ultra",
          price: 179,
          rating: 4,
          reviews: 156,
          image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop",
          badge: "Popular"
        },
        {
          id: 12,
          name: "Wireless Charging Pad",
          price: 49,
          originalPrice: 79,
          rating: 4,
          reviews: 89,
          image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=300&fit=crop"
        },
        {
          id: 13,
          name: "4K Webcam Ultra",
          price: 179,
          rating: 4,
          reviews: 156,
          image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop",
          badge: "Popular"
        },
        {
          id: 14,
          name: "Wireless Charging Pad",
          price: 49,
          originalPrice: 79,
          rating: 4,
          reviews: 89,
          image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=300&fit=crop"
        },
        {
          id: 15,
          name: "4K Webcam Ultra",
          price: 179,
          rating: 4,
          reviews: 156,
          image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop",
          badge: "Popular"
        },
        {
          id: 16,
          name: "Wireless Charging Pad",
          price: 49,
          originalPrice: 79,
          rating: 4,
          reviews: 89,
          image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=300&fit=crop"
        }
      ]
    },
    {
      name: "Fashion",
      count: 189,
      products: [
        {
          id: 4,
          name: "Designer Leather Jacket",
          price: 299,
          originalPrice: 450,
          rating: 5,
          reviews: 156,
          image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop",
          badge: "Sale"
        },
        {
          id: 5,
          name: "Premium Sneakers",
          price: 179,
          rating: 4,
          reviews: 203,
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop"
        },
        {
          id: 6,
          name: "Classic Wrist Watch",
          price: 459,
          rating: 5,
          reviews: 78,
          image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop",
          badge: "Luxury"
        },
        {
          id: 13,
          name: "Designer Sunglasses",
          price: 229,
          originalPrice: 329,
          rating: 5,
          reviews: 167,
          image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
          badge: "Trending"
        },
        {
          id: 14,
          name: "Luxury Handbag",
          price: 399,
          rating: 4,
          reviews: 112,
          image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop",
          badge: "Premium"
        },
        {
          id: 15,
          name: "Casual Denim Jeans",
          price: 89,
          originalPrice: 129,
          rating: 4,
          reviews: 298,
          image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop"
        }
      ]
    },
    {
      name: "Beauty",
      count: 156,
      products: [
        {
          id: 19,
          name: "Organic Face Serum",
          price: 79,
          originalPrice: 99,
          rating: 5,
          reviews: 234,
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
          badge: "Organic"
        },
        {
          id: 20,
          name: "Luxury Makeup Kit",
          price: 199,
          rating: 4,
          reviews: 156,
          image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
          badge: "Complete Set"
        },
        {
          id: 21,
          name: "Premium Skincare Set",
          price: 149,
          originalPrice: 199,
          rating: 5,
          reviews: 189,
          image: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=300&fit=crop"
        },
        {
          id: 22,
          name: "Anti-Aging Cream",
          price: 89,
          rating: 4,
          reviews: 267,
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
          badge: "Bestseller"
        },
        {
          id: 23,
          name: "Natural Lip Balm Set",
          price: 29,
          originalPrice: 39,
          rating: 4,
          reviews: 123,
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
        },
        {
          id: 24,
          name: "Professional Hair Dryer",
          price: 259,
          rating: 5,
          reviews: 89,
          image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=300&fit=crop",
          badge: "Pro Grade"
        }
      ]
    },
    {
      name: "Health",
      count: 98,
      products: [
        {
          id: 25,
          name: "Vitamin D3 Supplements",
          price: 39,
          originalPrice: 49,
          rating: 5,
          reviews: 345,
          image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
          badge: "Essential"
        },
        {
          id: 26,
          name: "Fitness Tracker Pro",
          price: 199,
          rating: 4,
          reviews: 178,
          image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=300&fit=crop",
          badge: "Popular"
        },
        {
          id: 27,
          name: "Protein Powder Premium",
          price: 79,
          rating: 4,
          reviews: 234,
          image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop"
        },
        {
          id: 28,
          name: "Digital Blood Pressure Monitor",
          price: 129,
          originalPrice: 159,
          rating: 5,
          reviews: 156,
          image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop",
          badge: "Medical Grade"
        },
        {
          id: 29,
          name: "Omega-3 Fish Oil",
          price: 49,
          rating: 4,
          reviews: 289,
          image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"
        },
        {
          id: 30,
          name: "Meditation Cushion",
          price: 89,
          originalPrice: 119,
          rating: 5,
          reviews: 67,
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
          badge: "Zen"
        }
      ]
    },
    {
      name: "Kitchen",
      count: 167,
      products: [
        {
          id: 31,
          name: "Stainless Steel Cookware Set",
          price: 299,
          originalPrice: 399,
          rating: 5,
          reviews: 234,
          image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
          badge: "Complete Set"
        },
        {
          id: 32,
          name: "High-Speed Blender",
          price: 199,
          rating: 4,
          reviews: 156,
          image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop",
          badge: "Powerful"
        },
        {
          id: 33,
          name: "Ceramic Knife Set",
          price: 89,
          originalPrice: 129,
          rating: 4,
          reviews: 189,
          image: "https://images.unsplash.com/photo-1594736797933-d0401ba4ba46?w=400&h=300&fit=crop"
        },
        {
          id: 34,
          name: "Smart Coffee Maker",
          price: 249,
          rating: 5,
          reviews: 123,
          image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
          badge: "Smart"
        },
        {
          id: 35,
          name: "Bamboo Cutting Board",
          price: 39,
          rating: 4,
          reviews: 267,
          image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
          badge: "Eco-Friendly"
        },
        {
          id: 36,
          name: "Air Fryer Deluxe",
          price: 179,
          originalPrice: 229,
          rating: 5,
          reviews: 345,
          image: "https://images.unsplash.com/photo-1574781330855-d0db2706b3d0?w=400&h=300&fit=crop",
          badge: "Healthy"
        }
      ]
    },
    {
      name: "Fitness",
      count: 123,
      products: [
        {
          id: 37,
          name: "Adjustable Dumbbells Set",
          price: 349,
          originalPrice: 449,
          rating: 5,
          reviews: 234,
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          badge: "Space Saver"
        },
        {
          id: 38,
          name: "Yoga Mat Premium",
          price: 79,
          rating: 4,
          reviews: 156,
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
          badge: "Non-Slip"
        },
        {
          id: 39,
          name: "Resistance Bands Set",
          price: 49,
          originalPrice: 69,
          rating: 4,
          reviews: 189,
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
        },
        {
          id: 40,
          name: "Foam Roller Pro",
          price: 89,
          rating: 5,
          reviews: 123,
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          badge: "Recovery"
        },
        {
          id: 41,
          name: "Protein Shaker Bottle",
          price: 19,
          rating: 4,
          reviews: 267,
          image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop"
        },
        {
          id: 42,
          name: "Balance Ball Swiss",
          price: 59,
          originalPrice: 79,
          rating: 4,
          reviews: 145,
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          badge: "Stability"
        }
      ]
    },
    {
      name: "Spiritual",
      count: 87,
      products: [
        {
          id: 43,
          name: "Meditation Singing Bowl",
          price: 129,
          originalPrice: 159,
          rating: 5,
          reviews: 178,
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
          badge: "Handcrafted"
        },
        {
          id: 44,
          name: "Crystal Healing Set",
          price: 89,
          rating: 4,
          reviews: 156,
          image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
          badge: "Natural"
        },
        {
          id: 45,
          name: "Incense Stick Collection",
          price: 39,
          originalPrice: 59,
          rating: 4,
          reviews: 234,
          image: "https://images.unsplash.com/photo-1602874801006-8c8b7d7e0b15?w=400&h=300&fit=crop"
        },
        {
          id: 46,
          name: "Chakra Balancing Stones",
          price: 79,
          rating: 5,
          reviews: 123,
          image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
          badge: "Energy"
        },
        {
          id: 47,
          name: "Meditation Cushion Set",
          price: 149,
          rating: 4,
          reviews: 89,
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
          badge: "Comfort"
        },
        {
          id: 48,
          name: "Essential Oil Diffuser",
          price: 99,
          originalPrice: 129,
          rating: 5,
          reviews: 267,
          image: "https://images.unsplash.com/photo-1602874801006-8c8b7d7e0b15?w=400&h=300&fit=crop",
          badge: "Aromatherapy"
        }
      ]
    },
    {
      name: "Kids",
      count: 156,
      products: [
        {
          id: 49,
          name: "Educational Building Blocks",
          price: 79,
          originalPrice: 99,
          rating: 5,
          reviews: 345,
          image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=300&fit=crop",
          badge: "Educational"
        },
        {
          id: 50,
          name: "Interactive Learning Tablet",
          price: 199,
          rating: 4,
          reviews: 234,
          image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=300&fit=crop",
          badge: "Smart"
        },
        {
          id: 51,
          name: "Art & Craft Kit",
          price: 49,
          originalPrice: 69,
          rating: 4,
          reviews: 189,
          image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop"
        },
        {
          id: 52,
          name: "Remote Control Car",
          price: 129,
          rating: 5,
          reviews: 156,
          image: "https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=400&h=300&fit=crop",
          badge: "Fun"
        },
        {
          id: 53,
          name: "Storytelling Books Set",
          price: 59,
          rating: 4,
          reviews: 267,
          image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
          badge: "Reading"
        },
        {
          id: 54,
          name: "Musical Instrument Toy",
          price: 89,
          originalPrice: 119,
          rating: 4,
          reviews: 123,
          image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
          badge: "Musical"
        }
      ]
    },
    {
      name: "Pets",
      count: 98,
      products: [
        {
          id: 55,
          name: "Automatic Pet Feeder",
          price: 149,
          originalPrice: 199,
          rating: 5,
          reviews: 234,
          image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
          badge: "Smart"
        },
        {
          id: 56,
          name: "Orthopedic Pet Bed",
          price: 89,
          rating: 4,
          reviews: 156,
          image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop",
          badge: "Comfort"
        },
        {
          id: 57,
          name: "Interactive Pet Toy",
          price: 39,
          originalPrice: 59,
          rating: 4,
          reviews: 189,
          image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop"
        },
        {
          id: 58,
          name: "Pet Grooming Kit",
          price: 79,
          rating: 5,
          reviews: 123,
          image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop",
          badge: "Grooming"
        },
        {
          id: 59,
          name: "Pet Carrier Backpack",
          price: 119,
          rating: 4,
          reviews: 267,
          image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
          badge: "Travel"
        },
        {
          id: 60,
          name: "Premium Pet Treats",
          price: 29,
          originalPrice: 39,
          rating: 5,
          reviews: 345,
          image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop",
          badge: "Healthy"
        }
      ]
    },
    {
      name: "Stationery",
      count: 134,
      products: [
        {
          id: 61,
          name: "Premium Notebook Set",
          price: 49,
          originalPrice: 69,
          rating: 5,
          reviews: 234,
          image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
          badge: "Quality"
        },
        {
          id: 62,
          name: "Fountain Pen Collection",
          price: 159,
          rating: 4,
          reviews: 156,
          image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=300&fit=crop",
          badge: "Luxury"
        },
        {
          id: 63,
          name: "Desk Organizer Set",
          price: 89,
          originalPrice: 119,
          rating: 4,
          reviews: 189,
          image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop"
        },
        {
          id: 64,
          name: "Calligraphy Kit",
          price: 79,
          rating: 5,
          reviews: 123,
          image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=300&fit=crop",
          badge: "Artistic"
        },
        {
          id: 65,
          name: "Planner & Journal Set",
          price: 59,
          rating: 4,
          reviews: 267,
          image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
          badge: "Planning"
        },
        {
          id: 66,
          name: "Colored Pencils Pro",
          price: 39,
          originalPrice: 59,
          rating: 4,
          reviews: 345,
          image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
          badge: "Art"
        }
      ]
    }
  ];

  const [activeCategory, setActiveCategory] = useState(0);
  const maxVisibleCategories = 5;

  const handleViewAllProducts = () => {
    const selectedCategoryName = categories[activeCategory].name.toLowerCase();
    // Navigate to shop page with selected category
    window.location.href = `/shop/${selectedCategoryName}`;
  };

  const handleCategorySelect = (categoryName) => {
    const categoryIndex = categories.findIndex(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
    if (categoryIndex !== -1) {
      setActiveCategory(categoryIndex);
    }
    setShowAllCategories(false);
  };

  const visibleCategories = categories.slice(0, maxVisibleCategories);
  const hasMoreCategories = categories.length > maxVisibleCategories;

  return (
    <section id="categories" className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Shop by <span className="bg-gradient-to-r from-[#52B69A] to-[#34A0A4] bg-clip-text text-transparent">Categories</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover our curated collections of premium products across various categories
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {visibleCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(index)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === index
                  ? 'bg-gradient-to-r from-[#52B69A] to-[#34A0A4] text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
          
          {hasMoreCategories && (
            <button
              onClick={() => setShowAllCategories(true)}
              className="px-6 py-3 rounded-full font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all duration-300"
            >
              +{categories.length - maxVisibleCategories} more
            </button>
          )}
        </div>

        {/* All Categories Modal */}
        {showAllCategories && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">All Categories</h3>
                <button
                  onClick={() => setShowAllCategories(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {allCategories.map((category, index) => {
                  const isActive = categories[activeCategory]?.name.toLowerCase() === category.toLowerCase();
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleCategorySelect(category)}
                      className={`px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-[#52B69A] to-[#34A0A4] text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gradient-to-r hover:from-[#52B69A] hover:to-[#34A0A4] hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Products Grid - Increased to 4 columns on large screens */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {categories[activeCategory].products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={handleViewAllProducts}
            className="px-8 py-4 bg-transparent border-2 border-[#52B69A] text-[#52B69A] rounded-full font-semibold hover:bg-[#52B69A] hover:text-white transition-all duration-300"
          >
            View All {categories[activeCategory].name} Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;