import React, { useState, useEffect } from 'react'; // Removed Component import since it's not needed
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  ShoppingBag,
  Tag,
  Truck,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-400 text-center py-16">
          <p>Something went wrong: {this.state.error?.message || 'Unknown error'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg"
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
  const navigate = useNavigate(); // Added navigate hook
  const [initialLoading, setInitialLoading] = useState(true); 
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 500); // 2-second delay
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          const formattedItems = data.items.map(item => ({
            id: item.product?._id || '',
            name: item.product?.name || 'Unknown Product',
            price: item.discountPrice > 0 ? item.discountPrice : item.price || item.product?.discountPrice || item.product?.basePrice || 0,
            originalPrice: item.price || item.product?.basePrice || 0,
            quantity: item.quantity || 1,
            image: item.product?.images?.[0] || item.product?.image || 'https://via.placeholder.com/150',
            color: item.filters?.color || item.product?.color || 'N/A',
            size: item.filters?.size || item.product?.size || 'N/A',
            inStock: (item.product?.countInStock || 0) > 0,
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
      }
    };

    fetchCart();

    // Poll for stock updates every 30 seconds
    const intervalId = setInterval(fetchCart, 30000);
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  // Update item quantity
  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const item = cartItems.find(item => item.id === id);
      const response = await fetch('http://localhost:5000/api/cart/add', {
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
        const formattedItems = data.items.map(item => ({
          id: item.product?._id || '',
          name: item.product?.name || 'Unknown Product',
          price: item.discountPrice > 0 ? item.discountPrice : item.price || item.product?.discountPrice || item.product?.basePrice || 0,
          originalPrice: item.price || item.product?.basePrice || 0,
          quantity: item.quantity || 1,
          image: item.product?.images?.[0] || item.product?.image || 'https://via.placeholder.com/150',
          color: item.filters?.color || item.product?.color || 'N/A',
          size: item.filters?.size || item.product?.size || 'N/A',
          inStock: (item.product?.countInStock || 0) > 0,
          category: item.product?.category || 'General',
          filters: item.filters || {},
          cartItemPrice: item.price || 0,
          cartItemDiscountPrice: item.discountPrice || 0,
          shippingCost: item.product?.shippingCost || 0,
        }));
        setCartItems(formattedItems);
      } else {
        alert(data.message || 'Failed to update quantity');
      }
    } catch (err) {
      alert('Error updating quantity');
    }
  };

  // Remove item from cart
  const removeItem = async (id) => {
    try {
      const item = cartItems.find(item => item.id === id);
      const response = await fetch('http://localhost:5000/api/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ productId: id, filters: item.filters }),
      });
      const data = await response.json();
      if (response.ok) {
        const formattedItems = data.items.map(item => ({
          id: item.product?._id || '',
          name: item.product?.name || 'Unknown Product',
          price: item.discountPrice > 0 ? item.discountPrice : item.price || item.product?.discountPrice || item.product?.basePrice || 0,
          originalPrice: item.price || item.product?.basePrice || 0,
          quantity: item.quantity || 1,
          image: item.product?.images?.[0] || item.product?.image || 'https://via.placeholder.com/150',
          color: item.filters?.color || item.product?.color || 'N/A',
          size: item.filters?.size || item.product?.size || 'N/A',
          inStock: (item.product?.countInStock || 0) > 0,
          category: item.product?.category || 'General',
          filters: item.filters || {},
          cartItemPrice: item.price || 0,
          cartItemDiscountPrice: item.discountPrice || 0,
          shippingCost: item.product?.shippingCost || 0,
        }));
        setCartItems(formattedItems);
      } else {
        alert(data.message || 'Failed to remove item');
      }
    } catch (err) {
      alert('Error removing item');
    }
  };

  // Calculate totals excluding out-of-stock items
  const inStockItems = cartItems.filter(item => item.inStock);
  const subtotal = inStockItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = inStockItems.reduce((sum, item) => {
    const savingsPerItem = item.originalPrice - item.price;
    return sum + (savingsPerItem * item.quantity);
  }, 0);
  const totalShipping = [...new Set(inStockItems.map(item => item.shippingCost))].reduce((sum, cost) => sum + cost, 0); // Sum unique shipping costs for in-stock items
  let discount = 0;
  const total = subtotal - discount + totalShipping;

  const CartItem = ({ item }) => (
    <div className="bg-gray-950 rounded-xl p-6 shadow-lg">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Product Image */}
        <div className="relative">
          <div className="w-32 h-32 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
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
              <ShoppingBag className="w-12 h-12 text-[var(--brand-primary)]" />
            )}
          </div>
          {!item.inStock && (
            <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center">
              <span className="text-red-400 font-medium text-sm">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Details - Wrapped in Link for navigation */}
        <Link to={`/shop/${item.category}/${item.id}?${new URLSearchParams(item.filters).toString()}`} className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-white">{item.name}</h3>
          </div>
          
          <p className="text-sm text-gray-400 mb-3">{item.category}</p>
          
          <div className="flex flex-wrap gap-4 mb-4">
            {Object.entries(item.filters || {}).map(([key, value]) => (
              <div key={key} className="text-sm">
                <span className="text-gray-400">{key.charAt(0).toUpperCase() + key.slice(1)}: </span>
                <span className="text-white">{value}</span>
              </div>
            ))}
          </div>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Price - Shows filter-based price only if in stock */}
            <div className="flex items-center gap-2">
              {item.inStock ? (
                <>
                  <span className="text-2xl font-bold text-[var(--brand-primary)]">
                    ₹{item.price ? item.price.toFixed(2) : '0.00'}
                  </span>
                  {item.originalPrice > item.price && (
                    <>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{item.originalPrice ? item.originalPrice.toFixed(2) : '0.00'}
                      </span>
                      <span className="text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded">
                        Save ₹{(item.originalPrice - item.price).toFixed(2)}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <span className="text-sm text-red-400">Out of Stock</span>
              )}
            </div>

            {/* Quantity Controls - Disabled if out of stock */}
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
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={!item.inStock}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  item.inStock 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => removeItem(item.id)}
            className="text-red-400 hover:text-red-300 transition-colors p-2"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-[var(--brand-primary)]" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--primary-light-green)] to-[var(--brand-primary)] bg-clip-text text-transparent">
                Shopping Cart
              </h1>
              <p className="text-gray-400">{cartItems.length} items in your cart</p>
            </div>
          </div>
        </div>

        {initialLoading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)]"></div>
          </div>
        ) : loading ? (
          <div className="text-center py-16">
            <p className="text-gray-400">Loading cart...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-400">{error}</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-16 h-16 text-gray-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-8">Add some items to get started!</p>
            <button onClick={()=>navigate("/")} className="px-8 py-3 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white rounded-lg font-medium hover:from-[var(--brand-secondary)] hover:to-[var(--brand-accent)] transition-all">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <ErrorBoundary key={item.id}>
                  <CartItem item={item} />
                </ErrorBoundary>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-xl p-6 shadow-2xl sticky top-4">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[var(--brand-primary)]" />
                  Order Summary
                </h2>

                {/* Order Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span> ₹{subtotal.toFixed(2)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>You Save</span>
                      <span>- ₹{savings.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span>
                      {totalShipping === 0 ? (
                        <span className="text-green-400">Free</span>
                      ) : (
                        ` ₹${totalShipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-700 pt-3">
                    <span>Total</span>
                    <span className="text-[var(--brand-primary)]"> ₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 text-[var(--brand-primary)]" />
                    <span className="text-sm font-medium">Shipping</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Shipping costs are calculated per item
                  </p>
                </div>

                {/* Checkout Button */}
                <button 
                  className="w-full py-4 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white rounded-lg font-medium hover:from-[var(--brand-secondary)] hover:to-[var(--brand-accent)] transition-all mb-4"
                  onClick={() => navigate('/checkout', { state: { orderItems: inStockItems } })} // Navigate with inStockItems
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;