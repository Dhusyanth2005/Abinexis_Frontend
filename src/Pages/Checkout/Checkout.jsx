import React, { useState, useEffect } from 'react';
import { CreditCard, MapPin, User, ShoppingBag, Lock, Check, ChevronDown, ChevronUp, Plus, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://abinexis-backend.onrender.com';

const CheckoutPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState(state?.orderItems || []);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    paymentMethod: 'razorpay',
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [showAddNewAddress, setShowAddNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    isActive: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [personalInfoErrors, setPersonalInfoErrors] = useState({});
  const [newAddressErrors, setNewAddressErrors] = useState({});
  const [addressSelectionError, setAddressSelectionError] = useState('');

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Initial 0.5-second loading delay after header
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch user data including addresses
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/update`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const user = response.data;
        setFormData({
          ...formData,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
        });
        setSavedAddresses(user.addresses || []);
        const activeAddress = user.addresses?.find(addr => addr.isActive) || user.addresses?.[0] || null;
        setSelectedAddress(activeAddress);
        if (activeAddress) setAddressSelectionError(''); // Clear error if an address is pre-selected
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.response?.data?.message || 'Error fetching user data');
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Fetch price details for orderItems
  useEffect(() => {
    const fetchPriceDetails = async () => {
      try {
        const updatedItems = await Promise.all(
          orderItems.map(async (item) => {
            try {
              const response = await axios.get(
                `${API_URL}/api/products/${item.id}/price-details`,
                {
                  params: { selectedFilters: JSON.stringify(item.filters) },
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                }
              );
              const { effectivePrice, normalPrice, shippingCost } = response.data;
              return {
                ...item,
                price: effectivePrice || item.price || 0,
                originalPrice: normalPrice || item.originalPrice || 0,
                shippingCost: shippingCost || item.shippingCost || 0,
                inStock: item.inStock !== undefined ? item.inStock : true,
              };
            } catch (err) {
              console.error(`Error fetching price details for item ${item.id}:`, err);
              return item;
            }
          })
        );
        setOrderItems(updatedItems);
      } catch (err) {
        console.error('Error fetching price details:', err);
        setError('Error fetching price details');
      }
    };
    if (orderItems.length > 0) {
      fetchPriceDetails();
    }
  }, [state?.orderItems]);

  const validatePersonalInfo = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email address';
    setPersonalInfoErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateNewAddress = () => {
    const errors = {};
    if (!newAddress.type.trim()) errors.type = 'Address type is required';
    if (!newAddress.address.trim()) errors.address = 'Street address is required';
    if (!newAddress.city.trim()) errors.city = 'City is required';
    if (!newAddress.state.trim()) errors.state = 'State is required';
    if (!newAddress.zipCode.trim()) errors.zipCode = 'ZIP code is required';
    if (!newAddress.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^\+?\d{10,15}$/.test(newAddress.phone)) errors.phone = 'Invalid phone number';
    setNewAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAddressSelection = () => {
    if (!selectedAddress) {
      setAddressSelectionError('Please select a delivery address');
      return false;
    }
    setAddressSelectionError('');
    return true;
  };

  const handleStepClick = (stepId) => {
    if (stepId === 2 && currentStep === 1) {
      if (!validatePersonalInfo()) return;
    }
    if (stepId === 3 && currentStep === 2) {
      if (!validateAddressSelection()) return;
    }
    setCurrentStep(stepId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setPersonalInfoErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
    setNewAddressErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShowAddressDropdown(false);
    setAddressSelectionError(''); // Clear error when an address is selected
  };

  const handleAddNewAddress = () => {
    setShowAddNewAddress(true);
    setShowAddressDropdown(false);
  };

  const handleSaveNewAddress = async () => {
    if (!validateNewAddress()) return;
    try {
      const updatedAddresses = [
        ...savedAddresses.map(addr => ({ ...addr, isActive: false })),
        { ...newAddress, isActive: true },
      ];
      await axios.put(
        `${API_URL}/api/auth/update`,
        { addresses: updatedAddresses },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSavedAddresses(updatedAddresses);
      setSelectedAddress({ ...newAddress, isActive: true });
      setAddressSelectionError(''); // Clear error when a new address is saved
      setShowAddNewAddress(false);
      setNewAddress({
        type: 'Home',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        isActive: false,
      });
    } catch (err) {
      console.error('Error saving new address:', err);
      alert(err.response?.data?.message || 'Error saving new address');
    }
  };

  // Calculate totals excluding out-of-stock items
  const inStockItems = orderItems.filter(item => item.inStock);
  const subtotal = inStockItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = inStockItems.reduce((sum, item) => {
    const savingsPerItem = item.originalPrice - item.price;
    return sum + (savingsPerItem * item.quantity);
  }, 0);
  const totalShipping = [...new Set(inStockItems.map(item => item.shippingCost))].reduce((sum, cost) => {
    if (typeof cost !== 'number' || cost == null) {
      console.warn(`Invalid shippingCost: ${cost}`);
      return sum;
    }
    return sum + cost;
  }, 0);
  const total = subtotal + totalShipping;

  const handlePlaceOrder = async () => {
    if (!validateAddressSelection()) return;
    setIsProcessing(true);
    try {
      const orderData = {
        personalInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        },
        orderItems: orderItems.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price,
          originalPrice: item.originalPrice,
          shippingCost: item.shippingCost,
          image: item.image,
          filters: item.filters
        })),
        shippingInfo: {
          type: selectedAddress.type,
          address: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.zipCode,
          phone: selectedAddress.phone
        },
        paymentMethod: formData.paymentMethod,
        priceSummary: {
          subtotal,
          savings,
          shippingCost: totalShipping,
          total
        }
      };

      if (formData.paymentMethod === 'cod') {
        // For COD: Create order with isPaid: false
        const response = await axios.post(
          `${API_URL}/api/orders`,
          orderData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        alert('Order placed successfully! Pay on delivery.');
        navigate('/order');
      } else if (formData.paymentMethod === 'razorpay') {
        // For Razorpay: Fetch key and create Razorpay order
        const { data: keyData } = await axios.get(`${API_URL}/api/orders/v1/getKey`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const { key } = keyData;

        const { data: orderResponse } = await axios.post(
          `${API_URL}/api/orders/v1/payment/process`,
          { amount: total },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        const { order } = orderResponse;

        const options = {
          key,
          amount: order.amount,
          currency: 'INR',
          name: 'Your Company Name',
          description: 'Order Payment',
          order_id: order.id,
          callback_url: `${API_URL}/api/orders/v1/paymentVerification`,
          handler: async function (response) {
            try {
              // After payment, create the order in the database
              const verifyResponse = await axios.post(
                `${API_URL}/api/orders`,
                {
                  ...orderData,
                  paymentInfo: {
                    method: 'razorpay',
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                    status: 'captured'
                  }
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                  }
                }
              );
              alert('Payment successful! Order placed.');
              navigate('/order');
            } catch (err) {
              console.error('Error creating order after payment:', err);
              alert(err.response?.data?.message || 'Error creating order after payment');
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: selectedAddress.phone
          },
          theme: { color: '#52B69A' }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          alert('Payment failed. Please try again.');
          console.error('Payment failed:', response.error);
        });
        rzp.open();
      }
    } catch (err) {
      console.error('Error placing order:', err);
      alert(err.response?.data?.message || 'Error placing order');
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { id: 1, title: 'Information', icon: User },
    { id: 2, title: 'Shipping', icon: MapPin },
    { id: 3, title: 'Payment', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <style jsx>{`
        :root {
          --primary-light-green: #D9ED92;
          --primary-green: #B5E48C;
          --primary-sage: #99D98C;
          --primary-teal: #76C893;
          --primary-mint: #52B69A;
          --primary-turquoise: #34A0A4;
          --primary-blue: #168AAD;
          --primary-ocean: #1A759F;
          --primary-navy: #1E6091;
          --primary-deep-blue: #184E77;
          
          --brand-primary: #52B69A;
          --brand-secondary: #34A0A4;
          --brand-accent: #168AAD;
        }
        
        .brand-primary { color: var(--brand-primary); }
        .bg-brand-primary { background-color: var(--brand-primary); }
        .bg-brand-primary-hover:hover { background-color: var(--primary-turquoise); }
        .border-brand-primary { border-color: var(--brand-primary); }
        .bg-brand-primary-opacity { background-color: rgba(82, 182, 154, 0.1); }
        .focus-brand-primary:focus { outline: none; ring: 2px solid var(--brand-primary); border-color: var(--brand-primary); }
        .spinner-border { border-color: transparent; border-top-color: white; }
      `}</style>

      {/* Header with Back Button */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 brand-primary" />
            <h1 className="text-2xl font-bold">Checkout</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-400">Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* Conditional Loading or Main Content */}
      {initialLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-64px)] bg-gray-950">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)]"></div>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center mt-10">{error}</div>
      ) : (
        <>
          {/* Progress Steps */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-center space-x-8 mb-8">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                return (
                  <div 
                    key={step.id} 
                    className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleStepClick(step.id)}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted ? 'bg-brand-primary border-brand-primary' : isActive ? 'border-brand-primary bg-gray-800' : 'border-gray-600 bg-gray-800'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5 text-white" />
                      ) : (
                        <Icon className={`h-5 w-5 ${isActive ? 'brand-primary' : 'text-gray-400'}`} />
                      )}
                    </div>
                    <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Forms */}
              <div className="lg:col-span-2">
                <div className="bg-gray-900 rounded-lg p-6 space-y-6">
                  {/* Personal Information */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                        <User className="h-5 w-5 brand-primary" />
                        <span>Personal Information</span>
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 bg-gray-800 border ${personalInfoErrors.firstName ? 'border-red-500' : 'border-gray-700'} rounded-md text-white focus-brand-primary`}
                            placeholder="Enter first name"
                          />
                          {personalInfoErrors.firstName && (
                            <p className="text-red-500 text-xs mt-1">{personalInfoErrors.firstName}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 bg-gray-800 border ${personalInfoErrors.lastName ? 'border-red-500' : 'border-gray-700'} rounded-md text-white focus-brand-primary`}
                            placeholder="Enter last name"
                          />
                          {personalInfoErrors.lastName && (
                            <p className="text-red-500 text-xs mt-1">{personalInfoErrors.lastName}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 bg-gray-800 border ${personalInfoErrors.email ? 'border-red-500' : 'border-gray-700'} rounded-md text-white focus-brand-primary`}
                            placeholder="Enter email address"
                          />
                          {personalInfoErrors.email && (
                            <p className="text-red-500 text-xs mt-1">{personalInfoErrors.email}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end mt-6">
                        <button
                          onClick={() => handleStepClick(2)}
                          className="px-6 py-2 bg-brand-primary text-white rounded-md bg-brand-primary-hover transition-colors"
                        >
                          Continue to Shipping
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Shipping Address */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                        <MapPin className="h-5 w-5 brand-primary" />
                        <span>Shipping Address</span>
                      </h2>
                      {selectedAddress && (
                        <div className="bg-gray-800 rounded-lg p-4">
                          <h3 className="text-lg font-medium text-white mb-3">Delivery to:</h3>
                          <div className="text-gray-300">
                            <p className="font-medium">{selectedAddress.type}</p>
                            <p>{selectedAddress.address}</p>
                            <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}</p>
                            <p>Phone: {selectedAddress.phone}</p>
                          </div>
                        </div>
                      )}
                      {addressSelectionError && (
                        <p className="text-red-500 text-sm">{addressSelectionError}</p>
                      )}
                      <button
                        onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white hover:bg-gray-700 transition-colors"
                      >
                        <span>Change delivery address</span>
                        {showAddressDropdown ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      {showAddressDropdown && (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-3">
                          {savedAddresses.map((address) => (
                            <div
                              key={address._id || address.address}
                              className={`p-3 rounded-md cursor-pointer transition-colors ${
                                selectedAddress?._id === address._id ? 'bg-brand-primary-opacity border-brand-primary border' : 'bg-gray-700 hover:bg-gray-600'
                              }`}
                              onClick={() => handleAddressSelect(address)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-white">{address.type}</p>
                                  <p className="text-sm text-gray-300">{address.address}</p>
                                  <p className="text-sm text-gray-300">{address.city}, {address.state} {address.zipCode}</p>
                                  <p className="text-sm text-gray-300">Phone: {address.phone}</p>
                                </div>
                                {address.isActive && (
                                  <span className="text-xs brand-primary font-medium">Active</span>
                                )}
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={handleAddNewAddress}
                            className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-md text-white flex items-center justify-center space-x-2 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add new address</span>
                          </button>
                        </div>
                      )}
                      {showAddNewAddress && (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-4">
                          <h3 className="text-lg font-medium text-white">Add New Address</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Address Type</label>
                              <select
                                name="type"
                                value={newAddress.type}
                                onChange={handleNewAddressChange}
                                className={`w-full px-3 py-2 bg-gray-700 border ${newAddressErrors.type ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus-brand-primary`}
                              >
                                <option value="Home">Home</option>
                                <option value="Work">Work</option>
                                <option value="Other">Other</option>
                              </select>
                              {newAddressErrors.type && (
                                <p className="text-red-500 text-xs mt-1">{newAddressErrors.type}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Street Address</label>
                              <input
                                type="text"
                                name="address"
                                value={newAddress.address}
                                onChange={handleNewAddressChange}
                                className={`w-full px-3 py-2 bg-gray-700 border ${newAddressErrors.address ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus-brand-primary`}
                                placeholder="Enter your address"
                              />
                              {newAddressErrors.address && (
                                <p className="text-red-500 text-xs mt-1">{newAddressErrors.address}</p>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                                <input
                                  type="text"
                                  name="city"
                                  value={newAddress.city}
                                  onChange={handleNewAddressChange}
                                  className={`w-full px-3 py-2 bg-gray-700 border ${newAddressErrors.city ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus-brand-primary`}
                                  placeholder="City"
                                />
                                {newAddressErrors.city && (
                                  <p className="text-red-500 text-xs mt-1">{newAddressErrors.city}</p>
                                )}
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                                <input
                                  type="text"
                                  name="state"
                                  value={newAddress.state}
                                  onChange={handleNewAddressChange}
                                  className={`w-full px-3 py-2 bg-gray-700 border ${newAddressErrors.state ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus-brand-primary`}
                                  placeholder="State"
                                />
                                {newAddressErrors.state && (
                                  <p className="text-red-500 text-xs mt-1">{newAddressErrors.state}</p>
                                )}
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">ZIP Code</label>
                                <input
                                  type="text"
                                  name="zipCode"
                                  value={newAddress.zipCode}
                                  onChange={handleNewAddressChange}
                                  className={`w-full px-3 py-2 bg-gray-700 border ${newAddressErrors.zipCode ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus-brand-primary`}
                                  placeholder="ZIP Code"
                                />
                                {newAddressErrors.zipCode && (
                                  <p className="text-red-500 text-xs mt-1">{newAddressErrors.zipCode}</p>
                                )}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                              <input
                                type="tel"
                                name="phone"
                                value={newAddress.phone}
                                onChange={handleNewAddressChange}
                                className={`w-full px-3 py-2 bg-gray-700 border ${newAddressErrors.phone ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus-brand-primary`}
                                placeholder="Phone Number"
                              />
                              {newAddressErrors.phone && (
                                <p className="text-red-500 text-xs mt-1">{newAddressErrors.phone}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => setShowAddNewAddress(false)}
                              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveNewAddress}
                              className="px-4 py-2 bg-brand-primary text-white rounded-md bg-brand-primary-hover transition-colors"
                            >
                              Save Address
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between mt-6">
                        <button
                          onClick={() => setCurrentStep(1)}
                          className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => handleStepClick(3)}
                          className="px-6 py-2 bg-brand-primary text-white rounded-md bg-brand-primary-hover transition-colors"
                        >
                          Continue to Payment
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Payment Information */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                        <CreditCard className="h-5 w-5 brand-primary" />
                        <span>Payment Information</span>
                      </h2>
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div 
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                              formData.paymentMethod === 'razorpay' ? 'border-brand-primary bg-brand-primary-opacity' : 'border-gray-600 hover:border-gray-500'
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'razorpay' }))}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 rounded-full border-2 border-brand-primary flex items-center justify-center">
                                {formData.paymentMethod === 'razorpay' && (
                                  <div className="w-2 h-2 rounded-full bg-brand-primary" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium text-white">Razorpay (UPI, Credit Card, Debit Card, Net Banking)</h3>
                                <p className="text-sm text-gray-400">Pay securely with multiple payment options</p>
                              </div>
                            </div>
                          </div>
                          <div 
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                              formData.paymentMethod === 'cod' ? 'border-brand-primary bg-brand-primary-opacity' : 'border-gray-600 hover:border-gray-500'
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cod' }))}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 rounded-full border-2 border-brand-primary flex items-center justify-center">
                                {formData.paymentMethod === 'cod' && (
                                  <div className="w-2 h-2 rounded-full bg-brand-primary" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium text-white">Pay on Delivery</h3>
                                <p className="text-sm text-gray-400">Pay when your order arrives</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between mt-6">
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-900 rounded-lg p-6 sticky top-4">
                  <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
                  <div className="space-y-4 mb-6">
                    {orderItems.map((item) => (
                      <div key={item.id} className="grid grid-cols-3 gap-4 items-center">
                        <div className="w-20 h-20 bg-gray-800 rounded-md overflow-hidden">
                          <img
                            src={item.image || '/api/placeholder/80/80'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="col-span-1 flex flex-col gap-1">
                          <h3 className="text-sm font-medium text-white">{item.name}</h3>
                          <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                          {item.filters && Object.keys(item.filters).length > 0 && (
                            <p className="text-xs text-gray-400">
                              {Object.entries(item.filters).map(([key, value]) => (
                                <span key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {value} </span>
                              ))}
                            </p>
                          )}
                        </div>
                        <div className="col-span-1 text-right flex flex-col items-end gap-1">
                          {item.inStock ? (
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-2xl font-bold text-[var(--brand-primary)]">
                                ₹{item.price ? (item.price * item.quantity).toFixed(2) : '0.00'}
                              </span>
                              {item.originalPrice > item.price && (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500 line-through">
                                    ₹{item.originalPrice ? (item.originalPrice * item.quantity).toFixed(2) : '0.00'}
                                  </span>
                                  <span className="text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded">
                                    Save ₹{((item.originalPrice - item.price) * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-red-400">Out of Stock</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-800 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white">₹{subtotal.toFixed(2)}</span>
                    </div>
                    {savings > 0 && (
                      <div className="flex justify-between text-sm text-green-400">
                        <span>You Save</span>
                        <span>- ₹{savings.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Shipping</span>
                      <span className="text-white">
                        {totalShipping === 0 ? 'Free' : `₹${totalShipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="border-t border-gray-800 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-white">Total</span>
                        <span className="text-lg font-semibold text-white">₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || currentStep !== 3 || orderItems.some(item => !item.inStock)}
                    className="w-full mt-6 py-3 rounded-lg font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-brand-primary bg-brand-primary-hover"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-400">
                      <Lock className="inline h-3 w-3 mr-1" />
                      Your payment information is secure and encrypted
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;