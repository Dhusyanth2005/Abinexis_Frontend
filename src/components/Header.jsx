import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, User, Heart, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0); // State for cart item count
  const navigate = useNavigate();

  const categories = [
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

  // Function to check if token is expired
  const checkTokenExpiration = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        return false;
      }
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error('Error parsing token:', error);
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      return false;
    }
  };

  // Function to fetch cart item count
  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCartCount(0);
        return;
      }
      const response = await axios.get('https://abinexis-backend.onrender.com/api/cart', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const data = response.data;
        const totalItems = data.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    checkTokenExpiration();
    fetchCartCount(); // Fetch cart count on mount

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-container') && !event.target.closest('.search-container')) {
        setIsProfileOpen(false);
        setSuggestions([]);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isProfileOpen) {
      checkTokenExpiration();
    }
  }, [isProfileOpen]);

  // Fetch cart count periodically or when cart might change
  useEffect(() => {
    const intervalId = setInterval(fetchCartCount, 30000); // Refresh every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(`https://abinexis-backend.onrender.com/api/products/search?query=${encodeURIComponent(query)}`);
      const { suggestions = [] } = response.data;
      const sortedSuggestions = [...suggestions].sort((a, b) => a.display.localeCompare(b.display));
      setSuggestions(sortedSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    fetchSuggestions(query);
  };

  const handleSearch = async (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      try {
        const response = await axios.get(`https://abinexis-backend.onrender.com/api/products/search?query=${encodeURIComponent(query)}`);
        const { suggestions = [] } = response.data;

        // Check if query matches a category exactly
        const matchedCategory = categories.find((category) =>
          category.toLowerCase() === query
        );
        if (matchedCategory) {
          navigate(`/shop/${matchedCategory.toLowerCase()}`);
          setSearchQuery('');
          setSuggestions([]);
          setIsMenuOpen(false);
          return;
        }

        // If multiple suggestions (e.g., "headphones"), navigate to category
        if (suggestions.length > 1) {
          const uniqueCategories = [...new Set(suggestions.map(s => s.category.toLowerCase()))];
          if (uniqueCategories.length === 1) {
            navigate(`/shop/${uniqueCategories[0]}`);
          } else {
            // Fallback to first category if multiple categories
            navigate(`/shop/${suggestions[0].category.toLowerCase()}`);
          }
          setSearchQuery('');
          setSuggestions([]);
          setIsMenuOpen(false);
          return;
        }

        // If a single suggestion is found, navigate to product
        if (suggestions.length === 1) {
          const suggestion = suggestions[0];
          navigate(`/shop/${suggestion.category.toLowerCase()}/${suggestion._id}`);
          setSearchQuery('');
          setSuggestions([]);
          setIsMenuOpen(false);
          return;
        }

        // Check if query is a substring of any category (e.g., "laptop" for "realme laptop")
        const relatedCategory = categories.find((category) =>
          category.toLowerCase().includes(query)
        );
        if (relatedCategory) {
          navigate(`/shop/${relatedCategory.toLowerCase()}`);
          setSearchQuery('');
          setSuggestions([]);
          setIsMenuOpen(false);
          return;
        }

        // No match found, navigate to product not found page
        navigate('/product-not-found', { state: { query } });
        setSearchQuery('');
        setSuggestions([]);
        setIsMenuOpen(false);
      } catch (error) {
        console.error('Error fetching search results:', error);
        navigate('/product-not-found', { state: { query, error: error.message } });
        setSearchQuery('');
        setSuggestions([]);
        setIsMenuOpen(false);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(`/shop/${suggestion.category.toLowerCase()}/${suggestion._id}`);
    setSearchQuery('');
    setSuggestions([]);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsProfileOpen(false);
    setCartCount(0); // Reset cart count on logout
    navigate('/auth');
  };

  return (
    <>
      <style jsx>{`
        .brand-gradient { background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary)); }
        .brand-text-gradient { background: linear-gradient(135deg, var(--brand-primary), var(--brand-accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .brand-border { border-color: var(--brand-primary); }
        .brand-hover:hover { color: var(--brand-primary); }
        .brand-accent-hover:hover { color: var(--brand-accent); }
        .search-input { background: rgba(31, 41, 55, 0.8); border: 1px solid rgba(75, 85, 99, 0.5); transition: all 0.3s ease; }
        .search-input:focus { background: rgba(31, 41, 55, 1); border-color: var(--brand-primary); box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3); }
        .category-item { transition: all 0.3s ease; position: relative; }
        .category-item:hover { color: var(--brand-primary); transform: translateY(-1px); }
        .category-item::after { content: ''; position: absolute; bottom: -8px; left: 0; width: 0; height: 2px; background: linear-gradient(135deg, var(--brand-primary), var(--brand-accent)); transition: width 0.3s ease; }
        .category-item:hover::after { width: 100%; }
        .profile-dropdown { position: absolute; top: 100%; right: 0; background: rgba(31, 41, 55, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(75, 85, 99, 0.5); border-radius: 8px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3); min-width: 200px; z-index: 1000; opacity: 0; transform: translateY(-10px); transition: all 0.3s ease; pointer-events: none; }
        .profile-dropdown.show { opacity: 1; transform: translateY(0); pointer-events: auto; }
        .profile-dropdown-item { padding: 12px 16px; color: #d1d5db; text-decoration: none; display: block; transition: all 0.3s ease; border-bottom: 1px solid rgba(75, 85, 99, 0.3); }
        .profile-dropdown-item:last-child { border-bottom: none; }
        .profile-dropdown-item:hover { background: rgba(59, 130, 246, 0.1); color: var(--brand-primary); transform: translateX(4px); }
        .suggestions-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: rgba(31, 41, 55, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(75, 85, 99, 0.5); border-radius: 8px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3); z-index: 1000; max-height: 200px; overflow-y: auto; display: ${suggestions.length > 0 ? 'block' : 'none'}; }
        .suggestion-item { padding: 8px 12px; color: #d1d5db; text-decoration: none; display: block; transition: all 0.3s ease; cursor: pointer; }
        .suggestion-item:hover { background: rgba(59, 130, 246, 0.1); color: var(--brand-primary); }
      `}</style>

      <header className="fixed top-0 w-full z-50 bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 group cursor-pointer">
              <div className="w-10 h-10 brand-gradient rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold brand-text-gradient">Abinexis</span>
            </Link>

            <div className="flex-1 max-w-2xl mx-8 hidden md:block search-container">
              <div className="relative flex">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onKeyDown={handleSearch}
                  className="w-full pl-10 pr-12 py-2 search-input rounded-lg text-white placeholder-gray-400 outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <Search className="w-5 h-5" />
                </button>
                {suggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion.display}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <Link to="/wishlist">
                  <Heart className="w-6 h-6 text-gray-300 brand-hover cursor-pointer transition-colors duration-300" />
                </Link>
                <div className="relative profile-container">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="bg-transparent border-none cursor-pointer"
                  >
                    <User className="w-6 h-6 text-gray-300 brand-hover cursor-pointer transition-colors duration-300" />
                  </button>
                  <div className={`profile-dropdown ${isProfileOpen ? 'show' : ''}`}>
                    <Link to="/profile" className="profile-dropdown-item" onClick={() => setIsProfileOpen(false)}>My Profile</Link>
                    <Link to="/order" className="profile-dropdown-item" onClick={() => setIsProfileOpen(false)}>My Orders</Link>
                    <Link to="/cart" className="profile-dropdown-item" onClick={() => setIsProfileOpen(false)}>My Cart</Link>
                    <Link to="/wishlist" className="profile-dropdown-item" onClick={() => setIsProfileOpen(false)}>My Wishlist</Link>
                  
                    {isLoggedIn && (
                      <button
                        className="profile-dropdown-item w-full text-left"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    )}
                  </div>
                </div>
                <Link to="/cart" className="relative">
                  <ShoppingCart className="w-6 h-6 text-gray-300 brand-hover cursor-pointer transition-colors duration-300" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 brand-gradient rounded-full flex items-center justify-center text-xs text-white font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <button
                  className="md:hidden text-gray-300 hover:text-white bg-transparent border-none cursor-pointer"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="hidden md:flex items-center justify-center space-x-8 py-3">
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/shop/${category.toLowerCase()}`}
                  className="category-item text-gray-300 hover:text-white transition-colors duration-300 bg-transparent border-none cursor-pointer text-sm font-medium px-2 py-1"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800">
            <div className="px-4 py-6 space-y-4">
              <div className="relative mb-6 flex search-container">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onKeyDown={handleSearch}
                  className="w-full pl-10 pr-12 py-2 search-input rounded-lg text-white placeholder-gray-400 outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <Search className="w-5 h-5" />
                </button>
                {suggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion.display}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t border-gray-800 pt-4">
                <h3 className="text-gray-400 text-sm font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/shop/${category.toLowerCase()}`}
                      className="block text-gray-300 hover:text-white transition-colors duration-300 bg-transparent border-none cursor-pointer w-full text-left py-1 text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;