import React, { useState, useEffect, useCallback } from 'react';
import { Star, Clock, ShoppingCart, Zap } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://abinexis-backend.onrender.com';

const TodayOfferShow = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [todayOffers, setTodayOffers] = useState([]);
  const [priceDetailsMap, setPriceDetailsMap] = useState({});
  const [reviewsMap, setReviewsMap] = useState({}); // Store reviews for each product
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Calculate time remaining until midnight
  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Set to next midnight
    
    const difference = midnight.getTime() - now.getTime();
    
    if (difference > 0) {
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      return { hours, minutes, seconds };
    }
    
    // If we've reached midnight, reset to 24 hours
    return { hours: 24, minutes: 0, seconds: 0 };
  }, []);

  // Initialize countdown with real time
  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
  }, [calculateTimeLeft]);

  // Real-time countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      // Optional: Reset offers at midnight (you can customize this logic)
      if (newTimeLeft.hours === 24 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        console.log('New day started! Refreshing offers...');
        // Optionally refresh offers here
        // fetchTodayOffers();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  // Fetch today's offers from homepage
  const fetchTodayOffers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/homepage`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: { populate: 'todayOffers' },
      });
      const offers = response.data.todayOffers || [];
      setTodayOffers(offers);
    } catch (err) {
      console.error('Error fetching today offers:', err);
      setError(err.response?.data?.message || 'Error fetching offers');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch price details for a product
  const fetchPriceDetails = useCallback(
    async (productId) => {
      try {
        const initialFilters = {};
        const product = todayOffers.find(p => p._id === productId);
        product?.filters?.forEach(filter => {
          if (filter.values && filter.values.length > 0) {
            initialFilters[filter.name] = filter.values[0];
          }
        });
        const response = await axios.get(
          `${API_URL}/api/products/${productId}/price-details`,
          {
            params: { selectedFilters: JSON.stringify(initialFilters) },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
        return { id: productId, ...response.data };
      } catch (err) {
        console.error(`Error fetching price details for ${productId}:`, err);
        return { id: productId, effectivePrice: 0, normalPrice: 0 };
      }
    },
    [todayOffers]
  );

  // Fetch reviews for a product
  const fetchReviews = useCallback(
    async (productId) => {
      try {
        const headers = {};
        const token = localStorage.getItem('token');
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        const response = await axios.get(`${API_URL}/api/reviews/${productId}`, { headers });
        const reviews = response.data.filter(review => review.product.toString() === productId);
        return { id: productId, reviews };
      } catch (err) {
        console.error(`Error fetching reviews for ${productId}:`, err);
        return { id: productId, reviews: [] };
      }
    },
    []
  );

  useEffect(() => {
    fetchTodayOffers();
  }, [fetchTodayOffers]);

  // Fetch price details and reviews for all offers
  useEffect(() => {
    if (todayOffers.length > 0) {
      const fetchAllPriceDetailsAndReviews = async () => {
        // Fetch price details
        const priceDetailsPromises = todayOffers.map(offer => fetchPriceDetails(offer._id));
        const priceDetailsResults = await Promise.all(priceDetailsPromises);
        const priceDetailsMap = priceDetailsResults.reduce(
          (acc, details) => ({
            ...acc,
            [details.id]: details,
          }),
          {}
        );
        setPriceDetailsMap(priceDetailsMap);

        // Fetch reviews
        const reviewsPromises = todayOffers.map(offer => fetchReviews(offer._id));
        const reviewsResults = await Promise.all(reviewsPromises);
        const reviewsMap = reviewsResults.reduce(
          (acc, { id, reviews }) => ({
            ...acc,
            [id]: reviews,
          }),
          {}
        );
        setReviewsMap(reviewsMap);
      };
      fetchAllPriceDetailsAndReviews();
    }
  }, [todayOffers, fetchPriceDetails, fetchReviews]);

  const handleBuyNow = (category, productId) => {
    navigate(`/shop/${category.toLowerCase()}/${productId}`);
  };

  // Calculate cumulative rating for a product
  const calculateCumulativeRating = (reviews) => {
    return reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-mint)]"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (todayOffers.length === 0) {
    return <div className="text-center mt-10 text-gray-400">No offers available today.</div>;
  }

  return (
    <section id="today-offers" className="py-20 bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[var(--primary-mint)] to-[var(--primary-turquoise)] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-[var(--primary-blue)] to-[var(--primary-ocean)] rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

          {/* Add current time for reference (optional - remove if not needed) */}
          <div className="text-sm text-gray-500 mb-4">
            Current time: {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {todayOffers.map((offer) => {
            const priceDetails = priceDetailsMap[offer._id] || { effectivePrice: 0, normalPrice: 0 };
            const effectivePrice = priceDetails.effectivePrice || 0;
            const normalPrice = priceDetails.normalPrice || 0;
            const discount = normalPrice > effectivePrice && effectivePrice > 0
              ? Math.round(((normalPrice - effectivePrice) / normalPrice) * 100)
              : 0;
            const reviews = reviewsMap[offer._id] || [];
            const cumulativeRating = calculateCumulativeRating(reviews);

            return (
              <div key={offer._id} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="relative">
                  <img
                    src={offer.images?.[0] || 'https://via.placeholder.com/400x300'}
                    alt={offer.name}
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[var(--primary-mint)]/20 backdrop-blur-sm border border-[var(--primary-mint)]/30 text-[var(--primary-mint)] px-2 py-1 rounded text-xs font-semibold">
                    {offer.category}
                  </div>
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    -{discount}%
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm font-medium text-white mb-2 line-clamp-2 leading-tight">
                    {offer.name}
                  </h3>

                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.round(cumulativeRating) ? 'fill-current' : ''}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 ml-1">
                      ({reviews.length.toLocaleString()})
                    </span>
                  </div>

                  <div className="mb-4 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[var(--primary-mint)]">
                        ₹{effectivePrice}
                      </span>
                      {discount > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{normalPrice}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-green-400 font-medium">
                      Save ₹{normalPrice - effectivePrice}
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuyNow(offer.category, offer._id || 'https://via.placeholder.com/80')}
                    className="w-full bg-[var(--primary-mint)] text-white py-2 px-3 rounded text-sm font-medium hover:bg-[var(--primary-turquoise)] transition-colors duration-300 flex items-center justify-center gap-1 mt-auto"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TodayOfferShow;