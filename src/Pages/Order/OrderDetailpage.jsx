import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, Truck, CheckCircle, Clock, ArrowLeft, MapPin, Calendar, CreditCard, Phone, MessageCircle, RefreshCw, Download, ChevronRight, XCircle, AlertCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrackingDetails, setShowTrackingDetails] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [stockError, setStockError] = useState('');
  const [stockData, setStockData] = useState({}); // Store fetched stock data
  const navigate = useNavigate();

  const supportPhone = '+918248038528';

  const cancelOptions = [
    'I changed my mind',
    'Found it cheaper elsewhere',
    'Ordered by mistake',
    'Delivery time is too long',
    'Wrong product ordered',
    'Payment issues',
    'Other'
  ];

  // Fetch order details and stock data on mount
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://abinexis-backend.onrender.com/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOrder(response.data);

        // Fetch stock data for each item if order status is delivered
        if (response.data.orderStatus === 'delivered') {
          const stockPromises = response.data.orderItems.map(async (item) => {
            try {
              const productResponse = await axios.get(`https://abinexis-backend.onrender.com/api/products/${item.product}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              });
              return { productId: item.product, countInStock: productResponse.data.countInStock || 0 };
            } catch (err) {
              console.error(`Error fetching stock for product ${item.product}:`, err);
              return { productId: item.product, countInStock: 0 };
            }
          });
          const stockResults = await Promise.all(stockPromises);
          const stockMap = stockResults.reduce((acc, { productId, countInStock }) => ({
            ...acc,
            [productId]: countInStock,
          }), {});
          setStockData(stockMap);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // Handle opening cancel modal
  const handleOpenCancelModal = () => {
    setShowCancelModal(true);
  };

  // Handle cancel order submission
  const handleCancelOrder = async () => {
    if (!cancelReason) {
      alert('Please select a reason for cancellation.');
      return;
    }
    if (cancelReason === 'Other' && !otherReason.trim()) {
      alert('Please specify the reason for cancellation.');
      return;
    }

    const reason = cancelReason === 'Other' ? otherReason : cancelReason;

    try {
      const response = await axios.put(`https://abinexis-backend.onrender.com/api/orders/${id}/cancel`, {
        cancelReason: reason
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setOrder(response.data.order);
      setShowCancelModal(false);
      setCancelReason('');
      setOtherReason('');
      alert('Order cancelled successfully');
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Failed to cancel order. Please try again later.');
    }
  };

  // Handle WhatsApp message (open modal for order status)
  const handleWhatsAppMessage = () => {
    const message = `Hi, I need help with my order ${id}. Could you please provide an update on the status?`;
    setWhatsappMessage(message);
    setShowMessageModal(true);
  };

  // Handle Return/Refund (open modal for return/refund)
  const handleReturnRefund = () => {
    const message = `Hi, I need help with return and refund for my order ${id}.`;
    setWhatsappMessage(message);
    setShowMessageModal(true);
  };

  // Handle copying message to clipboard
  const handleCopyMessage = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(whatsappMessage).then(() => {
        alert('Message copied to clipboard!');
      }).catch((err) => {
        console.error('Failed to copy message:', err);
        alert('Please select and copy the message manually.');
      });
    } else {
      alert('Please select and copy the message manually.');
    }
  };

  // Proceed to WhatsApp
  const proceedToWhatsApp = () => {
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const cleanPhone = supportPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      alert('Invalid support phone number. Please contact support via another method.');
      setShowMessageModal(false);
      return;
    }
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
    setShowMessageModal(false);
  };

  // Handle reordering items (mimics CartPage's Proceed to Checkout)
  const handleReorderItems = () => {
    if (!order || !order.orderItems || order.orderItems.length === 0) {
      setStockError('No items to reorder.');
      return;
    }

    try {
      // Format items similar to CartPage
      const formattedItems = order.orderItems.map((item) => {
        const availableStock = stockData[item.product] || 0;
        return {
          id: item.product || '',
          name: item.name || 'Unknown Product',
          price: item.discountPrice > 0 ? item.discountPrice : item.price || 0,
          originalPrice: item.price || 0,
          quantity: item.quantity || 1,
          image: item.image || 'https://via.placeholder.com/150',
          color: item.filters?.color || 'N/A',
          size: item.filters?.size || 'N/A',
          inStock: availableStock > 0,
          countInStock: availableStock,
          category: item.category || 'General',
          filters: item.filters || {},
          cartItemPrice: item.price || 0,
          cartItemDiscountPrice: item.discountPrice || 0,
          shippingCost: item.shippingCost || 0,
        };
      });

      // Check if any item's quantity exceeds available stock
      const outOfStockItems = formattedItems.filter((item) => item.quantity > (stockData[item.id] || 0));
      if (outOfStockItems.length > 0) {
        setStockError(`Some items are out of stock or have insufficient stock: ${outOfStockItems.map(item => item.name).join(', ')}.`);
        return;
      }

      // Filter in-stock items
      const inStockItems = formattedItems.filter((item) => item.inStock && item.quantity <= item.countInStock);

      if (inStockItems.length === 0) {
        setStockError('No in-stock items available to reorder.');
        return;
      }

      // Navigate directly to checkout with in-stock items, mimicking CartPage
      navigate('/checkout', { state: { orderItems: inStockItems } });
      setStockError('');
    } catch (err) {
      console.error('Error reordering items:', err);
      setStockError('Failed to reorder items. Please try again.');
    }
  };

  // Tracking steps based on orderStatus
  const trackingSteps = [
    {
      status: 'processing',
      label: 'Order Placed',
      description: 'Your order has been confirmed and payment processed.',
    },
    {
      status: 'shipped',
      label: 'Shipped',
      description: 'Package has been dispatched and is on its way.',
    },
    {
      status: 'out of delivery',
      label: 'Out for Delivery',
      description: 'Package is out for delivery and will arrive soon.',
    },
    {
      status: 'delivered',
      label: 'Delivered',
      description: 'Package has been delivered to your address.',
    },
  ];

  const getTrackingSteps = () => {
    if (order.orderStatus === 'cancelled') {
      return [
        {
          status: 'cancelled',
          label: 'Cancelled',
          description: `Your order has been cancelled. Reason: ${order.cancelReason || 'N/A'}`,
          completed: true,
          date: order.statusTimestamps?.cancelledAt
            ? new Date(order.statusTimestamps.cancelledAt).toLocaleString()
            : order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : 'N/A',
        },
      ];
    }

    const currentIndex = trackingSteps.findIndex(step => step.status === order.orderStatus);
    return trackingSteps.map((step, index) => {
      let date;
      switch (step.status) {
        case 'processing':
          date = order.statusTimestamps?.processedAt
            ? new Date(order.statusTimestamps.processedAt).toLocaleString()
            : order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : 'Pending';
          break;
        case 'shipped':
          date = order.statusTimestamps?.shippedAt
            ? new Date(order.statusTimestamps.shippedAt).toLocaleString()
            : index <= currentIndex && order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : 'Pending';
          break;
        case 'out of delivery':
          date = order.statusTimestamps?.outForDeliveryAt
            ? new Date(order.statusTimestamps.outForDeliveryAt).toLocaleString()
            : index <= currentIndex && order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : 'Pending';
          break;
        case 'delivered':
          date = order.statusTimestamps?.deliveredAt
            ? new Date(order.statusTimestamps.deliveredAt).toLocaleString()
            : index <= currentIndex && order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : 'Pending';
          break;
        default:
          date = 'Pending';
      }

      return {
        ...step,
        completed: order.orderStatus === 'delivered' ? true : index <= currentIndex,
        date,
      };
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-6 h-6" style={{ color: 'var(--primary-light-green)' }} />;
      case 'shipped':
        return <Truck className="w-6 h-6" style={{ color: 'var(--brand-primary)' }} />;
      case 'processing':
        return <Clock className="w-6 h-6" style={{ color: 'var(--primary-blue)' }} />;
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Package className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'var(--primary-light-green)';
      case 'shipped':
        return 'var(--brand-primary)';
      case 'processing':
        return 'var(--primary-blue)';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const handlePhoneCall = () => {
    window.open(`tel:${supportPhone}`, '_self');
  };

  const handleProductClick = (productId, category) => {
    navigate(`/shop/${category || 'general'}/${productId}`);
  };

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();
    let y = 20;

    // Title
    doc.setFontSize(18);
    doc.text('Order Invoice', 20, y);
    y += 10;

    // Order Details
    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 20, y);
    y += 8;
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, y);
    y += 8;
    doc.text(`Status: ${order.orderStatus}`, 20, y);
    y += 10;

    // Customer Information
    doc.setFontSize(14);
    doc.text('Customer Information', 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(`Name: ${order.personalInfo.firstName} ${order.personalInfo.lastName}`, 20, y);
    y += 6;
    doc.text(`Email: ${order.personalInfo.email}`, 20, y);
    y += 10;

    // Shipping Information
    doc.setFontSize(14);
    doc.text('Shipping Information', 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(`Address: ${order.shippingInfo.address}`, 20, y);
    y += 6;
    doc.text(`City: ${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.postalCode}`, 20, y);
    y += 6;
    doc.text(`Phone: ${order.shippingInfo.phone}`, 20, y);
    y += 10;

    // Order Items
    doc.setFontSize(14);
    doc.text('Order Items', 20, y);
    y += 8;
    doc.setFontSize(10);
    order.orderItems.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name}`, 20, y);
      y += 6;
      doc.text(`   Category: ${item.category}`, 20, y);
      y += 6;
      doc.text(`   Quantity: ${item.quantity}`, 20, y);
      y += 6;
      doc.text(`   Price: Rs.${item.price.toFixed(2)}`, 20, y);
      y += 8;
    });

    // Price Summary
    doc.setFontSize(14);
    doc.text('Price Summary', 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(`Subtotal: Rs.${order.priceSummary.subtotal.toFixed(2)}`, 20, y);
    y += 6;
    if (order.priceSummary.savings > 0) {
      doc.text(`Savings: Rs.-${order.priceSummary.savings.toFixed(2)}`, 20, y);
      y += 6;
    }
    doc.text(`Shipping: Rs.${order.priceSummary.shippingCost.toFixed(2)}`, 20, y);
    y += 6;
    doc.text(`Total: Rs.${order.priceSummary.total.toFixed(2)}`, 20, y);
    y += 10;

    // Payment Information
    doc.setFontSize(14);
    doc.text('Payment Information', 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(`Method: ${order.paymentInfo.method}`, 20, y);
    y += 6;
    doc.text(`Status: ${order.isPaid ? 'Paid' : order.paymentInfo.status}`, 20, y);
    if (order.isPaid && order.paymentInfo.paidAt) {
      y += 6;
      doc.text(`Paid on: ${new Date(order.paymentInfo.paidAt).toLocaleDateString()}`, 20, y);
    }

    // Download the PDF
    doc.save(`order_${order._id}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">Error</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">Order not found</h3>
          <p className="text-gray-500">The requested order does not exist.</p>
        </div>
      </div>
    );
  }

  // Check if any items are in stock based on fetched stock data
  const hasInStockItems = order.orderItems.some((item) => (stockData[item.product] || 0) > 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/order"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Orders</span>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">Order Details</h1>
              <p className="text-gray-400 mt-1">{order._id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(order.orderStatus)}
                  <div>
                    <h2 className="text-xl font-semibold text-white">Order Status</h2>
                    <p className="text-gray-400">
                      Placed on: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className="px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide"
                    style={{
                      backgroundColor: `${getStatusColor(order.orderStatus)}20`,
                      color: getStatusColor(order.orderStatus),
                    }}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Tracking Toggle */}
              <button
                onClick={() => setShowTrackingDetails(!showTrackingDetails)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border transition-colors"
                style={{ borderColor: 'var(--brand-secondary)', color: 'var(--brand-secondary)' }}
              >
                <Truck className="w-5 h-5" />
                <span>View Detailed Tracking</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${showTrackingDetails ? 'rotate-90' : ''}`} />
              </button>

              {/* Detailed Tracking */}
              {showTrackingDetails && (
                <div className="mt-6 space-y-4">
                  {getTrackingSteps().map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div
                        className={`w-4 h-4 rounded-full border-2 mt-1 ${
                          step.completed ? 'bg-green-500 border-green-500' : 'border-gray-600'
                        }`}
                      >
                        {step.completed && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${step.completed ? 'text-white' : 'text-gray-400'}`}>
                            {step.label}
                          </h4>
                          <span className="text-sm text-gray-500">{step.date}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                        {step.status === 'delivered' && order.orderStatus === 'delivered' && (
                          <p className="text-sm text-green-400 mt-2">
                            Order delivered successfully on {new Date(order.statusTimestamps?.deliveredAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-gray-800 bg-opacity-50 rounded-lg"
                  >
                    <div
                      className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer"
                      onClick={() => handleProductClick(item.product, item.category)}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <Package
                        className="w-8 h-8 text-gray-400"
                        style={{ display: item.image ? 'none' : 'flex' }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{item.name}</h3>
                      <p className="text-sm text-gray-400">Category: {item.category}</p>
                      <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">₹{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                {order.orderStatus !== 'cancelled' && (
                  <div className="mt-4 space-y-3">
                    {order.orderStatus !== 'delivered' ? (
                      <button
                        onClick={handleOpenCancelModal}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Cancel Order</span>
                      </button>
                    ) : (
                      <div>
                        <button
                          onClick={handleReturnRefund}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Request Return/Refund</span>
                        </button>
                        <p className="text-xs text-gray-400 mt-2">
                          Note: You may need to copy and paste the message for new chats.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Cancel Order Modal */}
            {showCancelModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-800">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Cancel Order</h2>
                    <button onClick={() => setShowCancelModal(false)} className="text-gray-400 hover:text-gray-300">
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                  <p className="text-gray-300 mb-4">Are you sure you want to cancel this order?</p>
                  <h3 className="text-lg font-medium text-white mb-2">Why are you cancelling your order?</h3>
                  <div className="space-y-2 mb-4">
                    {cancelOptions.map((option) => (
                      <label key={option} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="cancelReason"
                          value={option}
                          checked={cancelReason === option}
                          onChange={(e) => setCancelReason(e.target.value)}
                          className="text-blue-600"
                        />
                        <span className="text-gray-300">{option}</span>
                      </label>
                    ))}
                    {cancelReason === 'Other' && (
                      <input
                        type="text"
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                        placeholder="Please specify"
                        className="w-full mt-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowCancelModal(false)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleCancelOrder}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                    >
                      Confirm Cancellation
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* WhatsApp Message Modal */}
            {showMessageModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-800">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">WhatsApp Message</h2>
                    <button onClick={() => setShowMessageModal(false)} className="text-gray-400 hover:text-gray-300">
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                  <p className="text-gray-300 mb-4">Please copy this message to send in WhatsApp:</p>
                  <textarea
                    value={whatsappMessage}
                    readOnly
                    className="w-full h-24 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none resize-none"
                  />
                  <p className="text-sm text-gray-400 mt-2">Select and copy the message above if needed.</p>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={handleCopyMessage}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                    >
                      Copy Message
                    </button>
                    <button
                      onClick={proceedToWhatsApp}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white"
                    >
                      Open WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Address */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Delivery Address</h2>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium text-white">
                    {order.personalInfo.firstName} {order.personalInfo.lastName}
                  </p>
                  <p className="text-gray-300">{order.shippingInfo.address}</p>
                  <p className="text-gray-300">
                    {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.postalCode}
                  </p>
                  <p className="text-gray-300">Phone: {order.shippingInfo.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">₹{order.priceSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-white">₹{order.priceSummary.shippingCost.toFixed(2)}</span>
                </div>
                {order.priceSummary.savings > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Savings</span>
                    <span className="text-green-400">-₹{order.priceSummary.savings.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-white">Total</span>
                    <span className="font-semibold text-white">₹{order.priceSummary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Payment Method</h2>
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white">{order.paymentInfo.method}</p>
                  <p className="text-sm text-gray-400">
                    Status: {order.isPaid ? 'Paid' : order.paymentInfo.status}
                  </p>
                  {order.isPaid && order.paymentInfo.paidAt && (
                    <p className="text-sm text-gray-400">
                      Paid on: {new Date(order.paymentInfo.paidAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Actions */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={handleDownloadInvoice}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Invoice</span>
                </button>
                {order.orderStatus === 'delivered' && (
                  <button
                    onClick={handleReorderItems}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-white font-medium transition-colors ${
                      hasInStockItems
                        ? 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] hover:from-[var(--brand-secondary)] hover:to-[var(--brand-accent)]'
                        : 'bg-gray-700 opacity-50 cursor-not-allowed'
                    }`}
                    disabled={!hasInStockItems}
                    title={hasInStockItems ? 'Reorder items' : 'No in-stock items to reorder'}
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reorder Items</span>
                  </button>
                )}
                {stockError && (
                  <div className="mt-2 bg-red-500/10 border border-red-400/20 rounded-lg p-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{stockError}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Support */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Need Help?</h2>
              <div className="space-y-3">
                <button
                  onClick={handlePhoneCall}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4 text-green-400" />
                  <span>Call Support</span>
                </button>
                <div>
                  <button
                    onClick={handleWhatsAppMessage}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                  <p className="text-xs text-gray-400 mt-2">
                    Note: You may need to copy and paste the message for new chats.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;