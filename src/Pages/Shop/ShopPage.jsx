import React, { useState, useEffect, useRef } from 'react';
import { Heart, Star, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

// Custom Range Slider Component
const RangeSlider = ({ min, max, value, onChange }) => {
  const [isDragging, setIsDragging] = useState(null);
  const sliderRef = useRef(null);

  // Get coordinates from either mouse or touch event
  const getEventCoordinates = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    if (e.changedTouches && e.changedTouches.length > 0) {
      return { clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  };

  // Handle start of dragging (mouse or touch)
  const handleStart = (thumb) => (e) => {
    e.preventDefault();
    setIsDragging(thumb);
  };

  // Handle dragging movement
  const handleMove = (e) => {
    if (!isDragging || !sliderRef.current) return;

    e.preventDefault(); // Prevent scrolling on mobile
    
    const { clientX } = getEventCoordinates(e);
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = min + percentage * (max - min);

    if (isDragging === 'min') {
      onChange([Math.min(newValue, value[1]), value[1]]);
    } else {
      onChange([value[0], Math.max(newValue, value[0])]);
    }
  };

  // Handle end of dragging
  const handleEnd = () => {
    setIsDragging(null);
  };

  // Add event listeners for both mouse and touch
  useEffect(() => {
    if (isDragging) {
      // Add both mouse and touch event listeners
      const handleMouseMove = (e) => handleMove(e);
      const handleTouchMove = (e) => handleMove(e);
      const handleMouseUp = () => handleEnd();
      const handleTouchEnd = () => handleEnd();

      // Mouse events
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      // Touch events
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        // Clean up all event listeners
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, value, min, max]);

  // Handle slider track click/tap
  const handleTrackClick = (e) => {
    if (!sliderRef.current || isDragging) return;

    const { clientX } = getEventCoordinates(e);
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = min + percentage * (max - min);

    // Determine which thumb is closer and update accordingly
    const distanceToMin = Math.abs(newValue - value[0]);
    const distanceToMax = Math.abs(newValue - value[1]);

    if (distanceToMin < distanceToMax) {
      onChange([Math.min(newValue, value[1]), value[1]]);
    } else {
      onChange([value[0], Math.max(newValue, value[0])]);
    }
  };

  const minPercent = ((value[0] - min) / (max - min)) * 100;
  const maxPercent = ((value[1] - min) / (max - min)) * 100;

  return (
    <div className="relative">
      {/* Value Display */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-300">
          <span className="text-gray-400">₹</span>
          <span className="font-medium">{Math.round(value[0])}</span>
        </div>
        <div className="text-sm text-gray-300">
          <span className="text-gray-400">₹</span>
          <span className="font-medium">{Math.round(value[1])}</span>
        </div>
      </div>

      {/* Slider Track */}
      <div 
        ref={sliderRef}
        className="relative h-3 sm:h-2 bg-gray-700 rounded-full cursor-pointer"
        style={{ userSelect: 'none', touchAction: 'none' }}
        onClick={handleTrackClick}
        onTouchStart={(e) => {
          // Prevent default to avoid conflicts
          e.preventDefault();
          handleTrackClick(e);
        }}
      >
        {/* Active Range */}
        <div
          className="absolute h-3 sm:h-2 rounded-full pointer-events-none"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
            backgroundColor: 'var(--brand-primary)',
          }}
        />

        {/* Min Thumb */}
        <div
          className={`absolute w-6 h-6 sm:w-5 sm:h-5 bg-white border-2 rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1/2 top-1/2 transition-all hover:scale-110 z-10 ${
            isDragging === 'min' ? 'scale-125 cursor-grabbing' : ''
          }`}
          style={{
            left: `${minPercent}%`,
            borderColor: 'var(--brand-primary)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            touchAction: 'none',
          }}
          onMouseDown={handleStart('min')}
          onTouchStart={handleStart('min')}
        />

        {/* Max Thumb */}
        <div
          className={`absolute w-6 h-6 sm:w-5 sm:h-5 bg-white border-2 rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1/2 top-1/2 transition-all hover:scale-110 z-10 ${
            isDragging === 'max' ? 'scale-125 cursor-grabbing' : ''
          }`}
          style={{
            left: `${maxPercent}%`,
            borderColor: 'var(--brand-primary)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            touchAction: 'none',
          }}
          onMouseDown={handleStart('max')}
          onTouchStart={handleStart('max')}
        />
      </div>

      {/* Min/Max Labels */}
      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-500">₹{min}</span>
        <span className="text-xs text-gray-500">₹{max}</span>
      </div>
    </div>
  );
};

const ShopPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([10, 10000]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [categories, setCategories] = useState({});
  const [brands, setBrands] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const API_BASE_URL = 'https://abinexis-backend.onrender.com/api';

  // Fetch filters from backend
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/filters`);
        if (!response.ok) throw new Error('Failed to fetch filters');
        const data = await response.json();
        
        const categoryMap = {};
        const brandMap = {};
        
        data.subCategories.forEach(item => {
          if (!categoryMap[item.category]) {
            categoryMap[item.category] = [];
          }
          if (!categoryMap[item.category].includes(item.subCategory)) {
            categoryMap[item.category].push(item.subCategory);
          }
        });
        
        data.brands.forEach(item => {
          if (!brandMap[item.category]) {
            brandMap[item.category] = [];
          }
          if (!brandMap[item.category].includes(item.brand)) {
            brandMap[item.category].push(item.brand);
          }
        });
        
        setCategories(categoryMap);
        setBrands(brandMap);
      } catch (err) {
        console.error('Error fetching filters:', err);
      }
    };

    fetchFilters();
  }, []);

  // Handle category normalization and data fetch
  useEffect(() => {
    const validCategories = [
      'Kitchen',
      'Health',
      'Fashion',
      'Beauty',
      'Electronics',
      'Fitness',
      'Spiritual',
      'Kids',
      'Pets',
      'Stationery',
    ];

    const normalizedCategory = category
      ? category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
      : 'Fashion';
    
    const newCategory = validCategories.includes(normalizedCategory) 
      ? normalizedCategory 
      : 'Fashion';

    if (selectedCategory !== newCategory) {
      setSelectedCategory(newCategory);
      setSelectedSubCategory('');
      setSelectedBrands([]);
      setPriceRange([10, 10000]);
      setCurrentPage(1);
      setInitialLoad(true);
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_BASE_URL}/products?category=${newCategory}`, {
          headers,
        });
        
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        
        const filteredData = data.filter(product => 
          product.category.toLowerCase() === newCategory.toLowerCase()
        );

        // Fetch price details and reviews for each product with first filter values
        const productsWithPrice = await Promise.all(filteredData.map(async (product) => {
          const initialFilters = {};
          product.filters?.forEach(filter => {
            if (filter.values && filter.values.length > 0) {
              initialFilters[filter.name] = filter.values[0];
            }
          });

          try {
            const priceResponse = await axios.get(
              `${API_BASE_URL}/products/${product._id}/price-details`,
              {
                params: { selectedFilters: JSON.stringify(initialFilters) },
                headers,
              }
            );
            const priceDetails = priceResponse.data;
            const displayFilters = Object.entries(initialFilters).map(([name, value]) => `${name}: ${value}`).join(', ');
            
            // Fetch reviews to calculate cumulative rating
            const reviewsResponse = await axios.get(`${API_BASE_URL}/reviews/${product._id}`, {
              headers,
            });
            const reviews = reviewsResponse.data.filter(review => review.product.toString() === product._id);
            const cumulativeRating = reviews.length > 0
              ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
              : 0;

            return {
              ...product,
              displayPrice: priceDetails.effectivePrice || 0,
              originalPrice: priceDetails.normalPrice || 0,
              discount: priceDetails.normalPrice > priceDetails.effectivePrice && priceDetails.effectivePrice > 0
                ? Math.round(((priceDetails.normalPrice - priceDetails.effectivePrice) / priceDetails.normalPrice) * 100)
                : 0,
              displayFilters,
              cumulativeRating,
              numReviews: reviews.length,
            };
          } catch (err) {
            console.error(`Error fetching price details or reviews for product ${product._id}:`, err);
            return {
              ...product,
              displayPrice: 0,
              originalPrice: 0,
              discount: 0,
              displayFilters: '',
              cumulativeRating: 0,
              numReviews: 0,
            };
          }
        }));

        setTimeout(() => {
          setProducts(productsWithPrice);
          setInitialLoad(false);
          setLoading(false);
        }, 500);
      } catch (err) {
        setTimeout(() => {
          setError(err.message);
          setInitialLoad(false);
          setLoading(false);
        }, 500);
      }
    };

    fetchProducts();
  }, [category, selectedCategory]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSubCategory, selectedBrands, priceRange]);

  const handleProductClick = (category, productId) => {
    navigate(`/shop/${category.toLowerCase()}/${productId}`);
  };

  const handleBrandToggle = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Quick price filter handlers
const handleQuickPriceFilter = (filterType) => {
    switch (filterType) {
      case 'under50':
        setPriceRange([10, 50]);
        break;
      case 'under100':
        setPriceRange([10, 100]);
        break;
      case 'under500':
        setPriceRange([10, 500]);
        break;
      case 'under1000':
        setPriceRange([10, 1000]);
        break;
      case 'above1000':
        setPriceRange([1000, 10000]);
        break;
      case 'above5000':
        setPriceRange([5000, 10000]);
        break;
      default:
        break;
    }
  };
  const getFilteredProducts = () => {
    let filtered = [...products];

    if (selectedSubCategory) {
      filtered = filtered.filter((product) => 
        product.subCategory && product.subCategory.toLowerCase() === selectedSubCategory.toLowerCase()
      );
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) => 
        product.brand && selectedBrands.includes(product.brand)
      );
    }

    filtered = filtered.filter((product) => {
      const price = product.displayPrice || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    return filtered;
  };

  const getPaginatedProducts = () => {
    const filteredProducts = getFilteredProducts();
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    const filteredProducts = getFilteredProducts();
    return Math.ceil(filteredProducts.length / productsPerPage);
  };

  const getPageNumbers = () => {
    const totalPages = getTotalPages();
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const groupedProducts = () => {
    const paginatedProducts = getPaginatedProducts();
    
    if (selectedSubCategory) {
      return { [selectedSubCategory]: paginatedProducts };
    } else {
      return { [selectedCategory]: paginatedProducts };
    }
  };

  const clearFilters = () => {
    setSelectedSubCategory('');
    setSelectedBrands([]);
    setPriceRange([10, 10000]);
  };

  const hasFiltersApplied = () => {
    return selectedSubCategory !== '' || 
           selectedBrands.length > 0 || 
           priceRange[0] !== 10 || 
           priceRange[1] !== 10000;
  };

  const totalPages = getTotalPages();
  const totalProducts = getFilteredProducts().length;
  const startProduct = (currentPage - 1) * productsPerPage + 1;
  const endProduct = Math.min(currentPage * productsPerPage, totalProducts);

  if (loading || initialLoad) {
    return (
      <div className="min-h-screen bg-gray-950 text-white pt-32 pb-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-lg">Loading {selectedCategory || 'products'}...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white pt-32 pb-16">
        <div className="text-center py-10">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-32 pb-16">
      <Helmet>
        <title>Shop High-Quality Products Online - Best Deals</title>
        <meta name="description" content="Discover a wide range of high-quality products across categories like Fashion, Electronics, and more. Shop now for great deals and fast shipping." />
        <meta name="keywords" content="shop online, buy products online, best deals, high-quality products, fashion, electronics, kitchen, health, beauty, fitness" />
        <meta property="og:title" content="Shop High-Quality Products Online" />
        <meta property="og:description" content="Explore our collection of top-quality products with great deals and fast shipping. Shop now!" />
        <meta property="og:image" content="/api/placeholder/200/200" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div
            className={`${
              sidebarOpen ? 'block' : 'hidden'
            } lg:block fixed lg:static inset-0 z-50 lg:z-0 w-80 bg-gray-900 lg:bg-transparent p-6 overflow-y-auto pt-36 lg:pt-0`}
          >
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-white z-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-6">
              <button
                onClick={clearFilters}
                className="w-full text-left hover:text-white text-sm transition-colors"
                style={{ color: 'var(--brand-accent)' }}
              >
                Clear all filters
              </button>

              <div>
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  {selectedCategory}
                </h3>
                <div className="w-full h-px bg-gray-800 mb-4"></div>
              </div>

              {/* Subcategories */}
              <div>
                <h4 className="text-md font-medium mb-4 text-gray-300">Subcategories</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedSubCategory('')}
                    className={`w-full text-left py-2 px-3 rounded transition-colors ${
                      selectedSubCategory === ''
                        ? 'text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                    style={
                      selectedSubCategory === ''
                        ? { backgroundColor: 'var(--brand-primary)' }
                        : {}
                    }
                  >
                    All {selectedCategory}
                  </button>
                  {categories[selectedCategory]?.map((subCategory) => (
                    <button
                      key={subCategory}
                      onClick={() => setSelectedSubCategory(subCategory)}
                      className={`w-full text-left py-2 px-3 rounded transition-colors ${
                        selectedSubCategory === subCategory
                          ? 'text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                      style={
                        selectedSubCategory === subCategory
                          ? { backgroundColor: 'var(--brand-secondary)' }
                          : {}
                      }
                    >
                      {subCategory}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              {brands[selectedCategory] && brands[selectedCategory].length > 0 && (
                <div>
                  <h4 className="text-md font-medium mb-4 text-gray-300">Brands</h4>
                  <div className="space-y-2">
                    {brands[selectedCategory].map((brand) => (
                      <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandToggle(brand)}
                          className="w-4 h-4 bg-gray-800 border-gray-600 rounded focus:ring-2"
                          style={{
                            accentColor: 'var(--brand-primary)',
                            '--tw-ring-color': 'var(--brand-primary)',
                          }}
                        />
                        <span className="text-gray-300 text-sm">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range with Volume-style Slider */}
              <div>
                <h4 className="text-md font-medium mb-4 text-gray-300">Price Range</h4>
                <div className="px-2">
                  <RangeSlider
                    min={10}
                    max={10000}
                    value={priceRange}
                    onChange={setPriceRange}
                  />
                </div>
                
                {/* Quick Price Filter Buttons */}
                <div className="mt-4 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleQuickPriceFilter('under50')}
                      className="px-3 py-2 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded transition-colors"
                    >
                      Under ₹50
                    </button>
                    <button
                      onClick={() => handleQuickPriceFilter('under100')}
                      className="px-3 py-2 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded transition-colors"
                    >
                      Under ₹100
                    </button>
                    <button
                      onClick={() => handleQuickPriceFilter('under500')}
                      className="px-3 py-2 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded transition-colors"
                    >
                      Under ₹500
                    </button>
                    <button
                      onClick={() => handleQuickPriceFilter('under1000')}
                      className="px-3 py-2 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded transition-colors"
                    >
                      Under ₹1000
                    </button>
                    <button
                      onClick={() => handleQuickPriceFilter('above1000')}
                      className="px-3 py-2 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded transition-colors"
                    >
                      Above ₹1,000
                    </button>
                    <button
                      onClick={() => handleQuickPriceFilter('above5000')}
                      className="px-3 py-2 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded transition-colors"
                    >
                      Above ₹5,000
                    </button>
          
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">
                  {selectedCategory}
                  {selectedSubCategory && ` - ${selectedSubCategory}`}
                </h1>
                <p className="text-gray-400 mt-1">
                  {totalProducts > 0 && (
                    <>
                      Showing {startProduct}-{endProduct} of {totalProducts} products
                    </>
                  )}
                  {totalProducts === 0 && "No products found"}
                </p>
              </div>
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 rounded hover:opacity-90 transition-all text-white"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Products Grid */}
            <div className="space-y-12">
              {Object.entries(groupedProducts()).map(([groupName, products]) => (
                <div key={groupName}>
                  {selectedSubCategory && (
                    <>
                      <h2
                        className="text-2xl font-bold mb-6"
                        style={{ color: 'var(--brand-primary)' }}
                      >
                        {groupName}
                      </h2>
                      <div className="w-full h-px bg-gray-800 mb-8"></div>
                    </>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                    {products.map((product) => (
                      <div
                        key={product._id}
                        className="group relative bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer"
                        onClick={() => handleProductClick(product.category, product._id)}
                      >
                        <div className="aspect-square bg-gray-800 relative overflow-hidden">
                          <img
                            src={product.images?.[0] || '/api/placeholder/200/200'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.target.src = '/api/placeholder/200/200'; }}
                          />
                          {product.discount > 0 && (
                            <div
                              className="absolute top-2 left-2 text-white px-2 py-1 rounded text-xs font-bold"
                              style={{ backgroundColor: 'var(--brand-accent)' }}
                            >
                              -{product.discount}%
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-white mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          
                          <div className="flex items-center mb-2">
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.round(product.cumulativeRating || 0)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-400 ml-2">
                              ({product.cumulativeRating || 0})
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-white">
                                ₹{product.displayPrice.toLocaleString('en-IN')}
                              </span>
                              {product.discount > 0 && (
                                <span className="text-sm text-gray-400 line-through">
                                  ₹{product.originalPrice.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* No Products Message */}
            {totalProducts === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">
                  No products found in {selectedCategory}
                  {selectedSubCategory && ` - ${selectedSubCategory}`}
                </div>
                {hasFiltersApplied() && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 rounded hover:opacity-90 transition-all text-white"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-12 gap-4">
                <div className="text-sm text-gray-400">
                  Showing {startProduct}-{endProduct} of {totalProducts} products
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                      currentPage === 1
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>

                  <div className="flex items-center space-x-1">
                    {getPageNumbers().map((pageNum, index) => (
                      <button
                        key={index}
                        onClick={() => typeof pageNum === 'number' && setCurrentPage(pageNum)}
                        disabled={pageNum === '...'}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          pageNum === currentPage
                            ? 'text-white'
                            : pageNum === '...'
                            ? 'text-gray-500 cursor-default'
                            : 'text-gray-300 hover:text-white hover:bg-gray-800'
                        }`}
                        style={
                          pageNum === currentPage
                            ? { backgroundColor: 'var(--brand-primary)' }
                            : {}
                        }
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                      currentPage === totalPages
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;