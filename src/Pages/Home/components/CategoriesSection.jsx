import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star } from 'lucide-react';

const API_URL = 'https://abinexis-backend.onrender.com/api';

const ProductCard = ({ product, onClick }) => {
  const discount = product.originalPrice > product.effectivePrice && product.effectivePrice > 0
    ? Math.round(((product.originalPrice - product.effectivePrice) / product.originalPrice) * 100)
    : 0;

  return (
    <div 
      className="bg-gray-900 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={product.images?.[0] || 'https://via.placeholder.com/400x300'}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300'; }}
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
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < Math.round(product.cumulativeRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
              />
            ))}
          </div>
          <span className="text-gray-400 text-xs">({product.numReviews || 0})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#52B69A] font-bold">₹{product.effectivePrice || 0}</span>
          {discount > 0 && (
            <span className="text-gray-500 line-through text-sm">₹{product.originalPrice || 0}</span>
          )}
          {discount > 0 && (
            <span className="text-xs px-2 py-1 rounded-full bg-green-900 text-green-300">
              {discount}% OFF
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const CategoriesSection = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const maxVisibleCategories = 5;

  // Fetch categories and products from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Fetch all products
        const response = await axios.get(`${API_URL}/products`, { headers });
        const products = response.data;

        // Group products by category
        const categoryMap = {};
        for (const product of products) {
          const category = product.category;
          if (!categoryMap[category]) {
            categoryMap[category] = [];
          }

          // Fetch price details for the first filter combination
          const initialFilters = {};
          product.filters?.forEach(filter => {
            if (filter.values && filter.values.length > 0) {
              initialFilters[filter.name] = filter.values[0];
            }
          });

          try {
            const priceResponse = await axios.get(
              `${API_URL}/products/${product._id}/price-details`,
              {
                params: { selectedFilters: JSON.stringify(initialFilters) },
                headers,
              }
            );
            const priceDetails = priceResponse.data;

            // Fetch reviews to calculate cumulative rating
            const reviewsResponse = await axios.get(`${API_URL}/reviews/${product._id}`, { headers });
            const reviews = reviewsResponse.data.filter(review => review.product.toString() === product._id);
            const cumulativeRating = reviews.length > 0
              ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
              : 0;

            categoryMap[category].push({
              ...product,
              effectivePrice: priceDetails.effectivePrice || 0,
              originalPrice: priceDetails.normalPrice || 0,
              cumulativeRating,
              numReviews: reviews.length,
            });
          } catch (err) {
            console.error(`Error fetching price details or reviews for product ${product._id}:`, err);
            categoryMap[category].push({
              ...product,
              effectivePrice: 0,
              originalPrice: 0,
              cumulativeRating: 0,
              numReviews: 0,
            });
          }
        }

        // Convert categoryMap to array format
        const categoryArray = Object.entries(categoryMap).map(([name, products]) => ({
          name,
          count: products.length,
          products: products.slice(0, 10), // Limit to 10 products per category
        }));

        setCategories(categoryArray);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.response?.data?.message || 'Error fetching categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleViewAllProducts = () => {
    if (categories[activeCategory]) {
      const selectedCategoryName = categories[activeCategory].name.toLowerCase();
      navigate(`/shop/${selectedCategoryName}`);
    }
  };

  const handleCategorySelect = (categoryName) => {
    const categoryIndex = categories.findIndex(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
    if (categoryIndex !== -1) {
      setActiveCategory(categoryIndex);
    }
    setShowAllCategories(false);
  };

  const handleProductClick = (category, productId) => {
    navigate(`/shop/${category.toLowerCase()}/${productId}`);
  };

  const visibleCategories = categories.slice(0, maxVisibleCategories);
  const hasMoreCategories = categories.length > maxVisibleCategories;

  if (loading) {
    return (
      <div className="py-20 bg-gray-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#52B69A]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 bg-gray-950 text-center">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#52B69A] text-white rounded hover:bg-[#34A0A4] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

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
                {categories.map((category, index) => {
                  const isActive = categories[activeCategory]?.name.toLowerCase() === category.name.toLowerCase();
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleCategorySelect(category.name)}
                      className={`px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-[#52B69A] to-[#34A0A4] text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gradient-to-r hover:from-[#52B69A] hover:to-[#34A0A4] hover:text-white'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {categories[activeCategory]?.products.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onClick={() => handleProductClick(product.category, product._id)}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={handleViewAllProducts}
            className="px-8 py-4 bg-transparent border-2 border-[#52B69A] text-[#52B69A] rounded-full font-semibold hover:bg-[#52B69A] hover:text-white transition-all duration-300"
          >
            View All {categories[activeCategory]?.name} Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;