import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  Tag,
  Truck,
  AlertCircle,
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-400 text-center py-16 px-4">
          <p className="text-sm sm:text-base">
            Something went wrong: {this.state.error?.message || 'Unknown error'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg text-sm sm:text-base"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockError, setStockError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const response = await fetch('https://abinexis-backend.onrender.com/api/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        const formattedItems = data.items.map((item) => ({
          id: item.product?._id || '',
          name: item.product?.name || 'Unknown Product',
          price:
            item.discountPrice > 0
              ? item.discountPrice
              : item.price || item.product?.discountPrice || item.product?.basePrice || 0,
          originalPrice: item.price || item.product?.basePrice || 0,
          quantity: item.quantity || 1,
          image: item.product?.images?.[0] || item.product?.image || 'https://via.placeholder.com/150',
          color: item.filters?.color || item.product?.color || 'N/A',
          size: item.filters?.size || item.product?.size || 'N/A',
          inStock: (item.product?.countInStock || 0) > 0,
          countInStock: item.product?.countInStock || 0,
          category: item.product?.category || 'General',
          filters: item.filters || {},
          cartItemPrice: item.price || 0,
          cartItemDiscountPrice: item.discountPrice || 0,
          shippingCost: item.product?.shippingCost || 0,
        }));
        setCartItems(formattedItems);
        console.log('Cart items with filter-based prices:', formattedItems);
      } else {
        setError(data.message || 'Failed to fetch cart');
      }
    } catch (err) {
      setError('Error fetching cart');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchCart();

    // Check for order success query parameter
    const params = new URLSearchParams(location.search);
    if (params.get('orderSuccess') === 'true') {
      fetchCart(); // Immediate refetch after successful order
      navigate('/cart', { replace: true }); // Clear query parameter
    }

    const intervalId = setInterval(fetchCart, 30000);
    return () => clearInterval(intervalId);
  }, [location.search, navigate]);

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    const item = cartItems.find((item) => item.id === id);
    if (!item) return;

    if (newQuantity > item.quantity && newQuantity > item.countInStock) {
      setStockError(`Cannot add more ${item.name}. Only ${item.countInStock} in stock.`);
      return;
    }

    try {
      const response = await fetch('https://abinexis-backend.onrender.com/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          productId: id,
          quantity: newQuantity - item.quantity,
          filters: item.filters,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        const formattedItems = data.items.map((item) => ({
          id: item.product?._id || '',
          name: item.product?.name || 'Unknown Product',
          price:
            item.discountPrice > 0
              ? item.discountPrice
              : item.price || item.product?.discountPrice || item.product?.basePrice || 0,
          originalPrice: item.price || item.product?.basePrice || 0,
          quantity: item.quantity || 1,
          image: item.product?.images?.[0] || item.product?.image || 'https://via.placeholder.com/150',
          color: item.filters?.color || item.product?.color || 'N/A',
          size: item.filters?.size || item.product?.size || 'N/A',
          inStock: (item.product?.countInStock || 0) > 0,
          countInStock: item.product?.countInStock || 0,
          category: item.product?.category || 'General',
          filters: item.filters || {},
          cartItemPrice: item.price || 0,
          cartItemDiscountPrice: item.discountPrice || 0,
          shippingCost: item.product?.shippingCost || 0,
        }));
        setCartItems(formattedItems);
        setStockError('');
      } else {
        setStockError(data.message || 'Failed to update quantity');
      }
    } catch (err) {
      setStockError('Error updating quantity');
    }
  };

  const removeItem = async (id) => {
    try {
      const item = cartItems.find((item) => item.id === id);
      const response = await fetch('https://abinexis-backend.onrender.com/api/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ productId: id, filters: item.filters }),
      });
      const data = await response.json();
      if (response.ok) {
        const formattedItems = data.items.map((item) => ({
          id: item.product?._id || '',
          name: item.product?.name || 'Unknown Product',
          price:
            item.discountPrice > 0
              ? item.discountPrice
              : item.price || item.product?.discountPrice || item.product?.basePrice || 0,
          originalPrice: item.price || item.product?.basePrice || 0,
          quantity: item.quantity || 1,
          image: item.product?.images?.[0] || item.product?.image || 'https://via.placeholder.com/150',
          color: item.filters?.color || item.product?.color || 'N/A',
          size: item.filters?.size || item.product?.size || 'N/A',
          inStock: (item.product?.countInStock || 0) > 0,
          countInStock: item.product?.countInStock || 0,
          category: item.product?.category || 'General',
          filters: item.filters || {},
          cartItemPrice: item.price || 0,
          cartItemDiscountPrice: item.discountPrice || 0,
          shippingCost: item.product?.shippingCost || 0,
        }));
        setCartItems(formattedItems);
        setStockError('');
      } else {
        setStockError(data.message || 'Failed to remove item');
      }
    } catch (err) {
      setStockError('Error removing item');
    }
  };

  const inStockItems = cartItems.filter((item) => item.inStock);
  const subtotal = inStockItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savings = inStockItems.reduce((sum, item) => {
    const savingsPerItem = item.originalPrice - item.price;
    return sum + savingsPerItem * item.quantity;
  }, 0);
  const totalShipping = [...new Set(inStockItems.map((item) => item.shippingCost))].reduce(
    (sum, cost) => sum + cost,
    0
  );
  let discount = 0;
  const total = subtotal - discount + totalShipping;

  const CartItem = ({ item }) => (
    <div className="bg-gray-950 rounded-xl p-4 sm:p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 sm:w-32 sm:h-32 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden mx-auto sm:mx-0">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name || 'Product image'}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150';
                  console.error('Image failed to load for:', item.name, item.image);
                }}
              />
            ) : (
              <ShoppingBag className="w-8 h-8 sm:w-12 sm:h-12 text-[var(--brand-primary)]" />
            )}
          </div>
          {!item.inStock && (
            <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center">
              <span className="text-red-400 font-medium text-xs sm:text-sm">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <Link
            to={`/shop/${item.category}/${item.id}?${new URLSearchParams(item.filters).toString()}`}
            className="block"
          >
            <div className="mb-2">
              <h3 className="text-lg sm:text-xl font-semibold text-white line-clamp-2">
                {item.name}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">{item.category}</p>
            <div className="flex flex-wrap gap-2 sm:gap-4 mb-3 sm:mb-4">
              {Object.entries(item.filters || {}).map(([key, value]) => (
                <div key={key} className="text-xs sm:text-sm">
                  <span className="text-gray-400">
                    {key.charAt(0).toUpperCase() + key.slice(1)}:{' '}
                  </span>
                  <span className="text-white">{value}</span>
                </div>
              ))}
            </div>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {item.inStock ? (
                <>
                  <span className="text-lg sm:text-2xl font-bold text-[var(--brand-primary)]">
                    ₹{item.price ? item.price.toFixed(2) : '0.00'}
                  </span>
                  {item.originalPrice > item.price && (
                    <>
                      <span className="text-xs sm:text-sm text-gray-500 line-through">
                        ₹{item.originalPrice ? item.originalPrice.toFixed(2) : '0.00'}
                      </span>
                      <span className="text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded whitespace-nowrap">
                        Save ₹{(item.originalPrice - item.price).toFixed(2)}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <span className="text-sm text-red-400">Out of Stock</span>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={!item.inStock}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    item.inStock
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <span className="w-8 sm:w-12 text-center font-medium text-sm sm:text-base">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={!item.inStock || item.quantity >= item.countInStock}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    item.inStock && item.quantity < item.countInStock
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-400 hover:text-red-300 transition-colors p-2"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
          {stockError && item.id === cartItems.find((i) => i.id === item.id)?.id && (
            <div className="mt-2 bg-red-500/10 border border-red-400/20 rounded-lg p-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{stockError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--brand-primary)]" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[var(--primary-light-green)] to-[var(--brand-primary)] bg-clip-text text-transparent">
                Shopping Cart
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                {cartItems.length} items in your cart
              </p>
            </div>
          </div>
        </div>

        {initialLoading ? (
          <div className="flex justify-center items-center h-64 sm:h-screen">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-[var(--brand-primary)]"></div>
          </div>
        ) : loading ? (
          <div className="text-center py-16">
            <p className="text-gray-400">Loading cart...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 px-4">
            <p className="text-red-400 text-sm sm:text-base">{error}</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
              Add some items to get started!
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 sm:px-8 py-3 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white rounded-lg font-medium hover:from-[var(--brand-secondary)] hover:to-[var(--brand-accent)] transition-all text-sm sm:text-base"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {cartItems.map((item) => (
                <ErrorBoundary key={item.id}>
                  <CartItem item={item} />
                </ErrorBoundary>
              ))}
            </div>

            <div className="lg:col-span-1 order-first lg:order-last">
              <div className="bg-gray-900 rounded-xl p-4 sm:p-6 shadow-2xl lg:sticky lg:top-4">
                <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--brand-primary)]" />
                  Order Summary
                </h2>
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-400">Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-green-400 text-sm sm:text-base">
                      <span>You Save</span>
                      <span>- ₹{savings.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-400">Shipping</span>
                    <span>
                      {totalShipping === 0 ? (
                        <span className="text-green-400">Free</span>
                      ) : (
                        `₹${totalShipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-base sm:text-lg font-bold border-t border-gray-700 pt-2 sm:pt-3">
                    <span>Total</span>
                    <span className="text-[var(--brand-primary)]">₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--brand-primary)]" />
                    <span className="text-xs sm:text-sm font-medium">Shipping</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Shipping costs are calculated per item
                  </p>
                </div>
                <button
                  className={`w-full py-3 sm:py-4 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white rounded-lg font-medium hover:from-[var(--brand-secondary)] hover:to-[var(--brand-accent)] transition-all text-sm sm:text-base ${
                    total === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => navigate('/checkout', { state: { orderItems: inStockItems } })}
                  disabled={total === 0}
                  title={total === 0 ? 'Add in-stock items to proceed to checkout' : 'Proceed to checkout'}
                >
                  Proceed to Checkout
                </button>
                {total === 0 && (
                  <p className="text-red-400 text-sm mt-2 text-center">
                    Add in-stock items to proceed to checkout
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;