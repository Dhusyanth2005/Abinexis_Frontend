import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, Truck, CheckCircle, Clock, ArrowLeft, MapPin, Calendar, CreditCard, Phone, MessageCircle, RefreshCw, Download, ChevronRight } from 'lucide-react';
import { jsPDF } from 'jspdf';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrackingDetails, setShowTrackingDetails] = useState(false);
  const navigate = useNavigate();

  const supportPhone = '+91 82480 38528';

  // Fetch order details on mount
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
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

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
          description: 'Your order has been cancelled.',
          completed: true,
          date: order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A',
        },
      ];
    }

    const currentIndex = trackingSteps.findIndex(step => step.status === order.orderStatus);
    return trackingSteps.map((step, index) => ({
      ...step,
      completed: order.orderStatus === 'delivered' ? true : index <= currentIndex,
      date: order.orderStatus === 'delivered' && order.deliveredAt
        ? new Date(order.deliveredAt).toLocaleString()
        : index <= currentIndex && order.createdAt
          ? new Date(order.createdAt).toLocaleString()
          : 'Pending',
    }));
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
        return <Package className="w-6 h-6 text-red-400" />;
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

  const handleWhatsAppMessage = () => {
    const message = encodeURIComponent(
      `Hi, I need help with my order ${id}. Could you please provide an update on the status?`
    );
    window.open(`https://wa.me/${supportPhone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
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
                            Order delivered successfully on {new Date(order.deliveredAt).toLocaleDateString()}
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
              </div>
            </div>

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
                <button
                  className="w-full px-4 py-3 rounded-lg text-white font-medium transition-colors"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  <RefreshCw className="w-4 h-4 inline mr-2" />
                  Reorder Items
                </button>
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
                <button
                  onClick={handleWhatsAppMessage}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;