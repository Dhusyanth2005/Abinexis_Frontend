import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Save,
  Edit3,
  ArrowLeft,
  Plus,
  Trash2
} from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
// Utility function for generating unique temporary IDs
const generateTempId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const ProfilePage = ({ onNavigateBack }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    createdAt: '',
    addresses: [],
    authMethod: 'password'
  });
  const [tempProfile, setTempProfile] = useState({ ...profile });
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [settings, setSettings] = useState({
    security: {
      loginAlerts: true
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Clear messages after 3 seconds
  const clearMessages = () => {
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
  };

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/auth'); // Redirect to login if no token
        }
        const response = await axios.get('https://abinexis-backend.onrender.com/api/auth/update', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile({
          firstName: response.data.firstName,
          lastName: response.data.lastName || '',
          email: response.data.email,
          phone: response.data.phone || '',
          createdAt: response.data.createdAt,
          addresses: response.data.addresses || [],
          authMethod: response.data.authMethod || 'password'
        });
        setTempProfile({
          firstName: response.data.firstName,
          lastName: response.data.lastName || '',
          email: response.data.email,
          phone: response.data.phone || '',
          createdAt: response.data.createdAt,
          addresses: response.data.addresses || [],
          authMethod: response.data.authMethod || 'password'
        });
        setSettings({
          security: {
            loginAlerts: response.data.loginAlerts
          }
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile data');
        clearMessages();
      }
    };
    fetchUserProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setTempProfile({ ...profile });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'https://abinexis-backend.onrender.com/api/auth/update',
        {
          firstName: tempProfile.firstName,
          lastName: tempProfile.lastName,
          email: tempProfile.email,
          phone: tempProfile.phone,
          addresses: tempProfile.addresses
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile({ ...tempProfile });
      setIsEditing(false);
      setSuccess('Profile updated successfully');
      setError('');
      clearMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setSuccess('');
      clearMessages();
    }
  };

  const handleCancel = () => {
    setTempProfile({ ...profile });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (field, value) => {
    setTempProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAddress = async () => {
    if (
      newAddress.address &&
      newAddress.city &&
      newAddress.state &&
      newAddress.zipCode &&
      newAddress.phone
    ) {
      const updatedAddresses = [
        ...tempProfile.addresses,
        { ...newAddress, id: generateTempId() }
      ];
      try {
        const token = localStorage.getItem('token');
        await axios.put(
          'https://abinexis-backend.onrender.com/api/auth/update',
          { addresses: updatedAddresses },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(prev => ({ ...prev, addresses: updatedAddresses }));
        setTempProfile(prev => ({ ...prev, addresses: updatedAddresses }));
        setNewAddress({
          type: 'Home',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          phone: ''
        });
        setShowAddAddressForm(false);
        setSuccess('Address added successfully');
        setError('');
        clearMessages();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to add address');
        setSuccess('');
        clearMessages();
      }
    } else {
      setError('Please fill in all required address fields');
      setSuccess('');
      clearMessages();
    }
  };

  const handleRemoveAddress = async (id) => {
    const updatedAddresses = tempProfile.addresses.filter(addr => addr.id !== id && addr._id !== id);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'https://abinexis-backend.onrender.com/api/auth/update',
        { addresses: updatedAddresses },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(prev => ({ ...prev, addresses: updatedAddresses }));
      setTempProfile(prev => ({ ...prev, addresses: updatedAddresses }));
      setSuccess('Address deleted successfully');
      setError('');
      clearMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete address');
      setSuccess('');
      clearMessages();
    }
  };

  const handleAddressInputChange = (field, value) => {
    setNewAddress(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordInputChange = (field, value) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError('All password fields are required');
      setSuccess('');
      clearMessages();
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New password and confirm password do not match');
      setSuccess('');
      clearMessages();
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setSuccess('');
      clearMessages();
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://abinexis-backend.onrender.com/api/auth/change-password',
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSuccess('Password changed successfully');
      setError('');
      clearMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
      setSuccess('');
      clearMessages();
    }
  };

  const handleToggle = async (section, key) => {
    const updatedSettings = {
      ...settings,
      [section]: {
        ...settings[section],
        [key]: !settings[section][key]
      }
    };
    setSettings(updatedSettings);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'https://abinexis-backend.onrender.com/api/auth/update',
        { loginAlerts: updatedSettings.security.loginAlerts },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Settings updated successfully');
      setError('');
      clearMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings');
      setSuccess('');
      clearMessages();
    }
  };

  const handleAddAddressClick = () => {
    setActiveSection('addresses');
    setShowAddAddressForm(true);
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    ...(profile.authMethod !== 'google' ? [{ id: 'security', label: 'Security', icon: Lock }] : [])
  ];

  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
        checked ? 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)]' : 'bg-gray-600'
      }`}
    >
      <div
        className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform duration-200 ${
          checked ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <button
              onClick={onNavigateBack}
              className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] bg-clip-text text-transparent">
                Profile
              </h1>
              <p className="text-gray-400">Manage your personal information</p>
            </div>
          </div>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-500/20 text-green-400 rounded-lg">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <nav className="space-y-2">
                {sections.map(section => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              {activeSection === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[var(--brand-primary)]">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={tempProfile.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 px-4 py-3 bg-gray-800 rounded-lg">
                            <User className="w-5 h-5 text-[var(--brand-primary)]" />
                            <span>{profile.firstName}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={tempProfile.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 px-4 py-3 bg-gray-800 rounded-lg">
                            <Phone className="w-5 h-5 text-[var(--brand-primary)]" />
                            <span>{profile.phone || 'Not provided'}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={tempProfile.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 px-4 py-3 bg-gray-800 rounded-lg">
                            <Mail className="w-5 h-5 text-[var(--brand-primary)]" />
                            <span>{profile.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={tempProfile.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 px-4 py-3 bg-gray-800 rounded-lg">
                            <User className="w-5 h-5 text-[var(--brand-primary)]" />
                            <span>{profile.lastName || 'Not provided'}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Member Since</label>
                        <div className="flex items-center space-x-2 px-4 py-3 bg-gray-800 rounded-lg">
                          <Calendar className="w-5 h-5 text-[var(--brand-primary)]" />
                          <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {profile.addresses.length === 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-800">
                      <div className="text-center py-6">
                        <MapPin className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">No addresses added yet</p>
                        <button
                          onClick={handleAddAddressClick}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] hover:from-[var(--brand-secondary)] hover:to-[var(--brand-accent)] rounded-lg transition-all duration-200 mx-auto"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Address</span>
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end space-x-3 mt-8">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleCancel}
                          className="px-6 py-2 text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] hover:from-[var(--brand-secondary)] hover:to-[var(--brand-accent)] rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleEdit}
                        className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] hover:from-[var(--brand-secondary)] hover:to-[var(--brand-accent)] rounded-lg transition-all duration-200 transform hover:scale-105"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
              {activeSection === 'addresses' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[var(--brand-primary)]">Addresses</h2>
                    <button
                      onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] hover:from-[var(--brand-secondary)] hover:to-[var(--brand-accent)] rounded-lg transition-all duration-200"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Address</span>
                    </button>
                  </div>
                  {showAddAddressForm && (
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h3 className="font-medium mb-4">Add New Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
                          <select
                            value={newAddress.type}
                            onChange={(e) => handleAddressInputChange('type', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                          >
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
                          <input
                            type="text"
                            value={newAddress.address}
                            onChange={(e) => handleAddressInputChange('address', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                          <input
                            type="text"
                            value={newAddress.city}
                            onChange={(e) => handleAddressInputChange('city', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">State</label>
                          <input
                            type="text"
                            value={newAddress.state}
                            onChange={(e) => handleAddressInputChange('state', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">ZIP Code</label>
                          <input
                            type="text"
                            value={newAddress.zipCode}
                            onChange={(e) => handleAddressInputChange('zipCode', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                          <input
                            type="tel"
                            value={newAddress.phone}
                            onChange={(e) => handleAddressInputChange('phone', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3 mt-4">
                        <button
                          onClick={() => setShowAddAddressForm(false)}
                          className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddAddress}
                          className="px-4 py-2 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] hover:from-[var(--brand-secondary)] hover:to-[var(--brand-accent)] rounded-lg transition-all duration-200"
                        >
                          Add Address
                        </button>
                      </div>
                    </div>
                  )}
                  {profile.addresses.length === 0 && !showAddAddressForm && (
                    <div className="text-center py-8">
                      <MapPin className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">No addresses added yet</p>
                      <button
                        onClick={() => setShowAddAddressForm(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] hover:from-[var(--brand-secondary)] hover:to-[var(--brand-accent)] rounded-lg transition-all duration-200 mx-auto"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Your First Address</span>
                      </button>
                    </div>
                  )}
                  {profile.addresses.length > 0 && (
                    <div className="space-y-4">
                      {profile.addresses.map(address => (
                        <div
                          key={address.id || address._id}
                          className="p-4 rounded-lg border border-gray-700 bg-gray-800 transition-all duration-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                                  {address.type}
                                </span>
                              </div>
                              <p className="text-gray-400 text-sm">{address.address}</p>
                              <p className="text-gray-400 text-sm">{address.city}, {address.state} {address.zipCode}</p>
                              <p className="text-gray-400 text-sm">{address.phone}</p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleRemoveAddress(address.id || address._id)}
                                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {activeSection === 'security' && profile.authMethod !== 'google' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[var(--brand-primary)]">Security</h2>
                  <div className="space-y-4">
                    <div className="py-3 border-b border-gray-800">
                      <h3 className="font-medium mb-2">Change Password</h3>
                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Current Password"
                            value={passwordForm.currentPassword}
                            onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent pr-12"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <input
                          type="password"
                          placeholder="New Password"
                          value={passwordForm.newPassword}
                          onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                        />
                        <input
                          type="password"
                          placeholder="Confirm New Password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                        />
                        <button
                          onClick={handleChangePassword}
                          className="px-4 py-2 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] hover:from-[var(--brand-secondary)] hover:to-[var(--brand-accent)] rounded-lg transition-all duration-200"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h3 className="font-medium">Login Alerts</h3>
                        <p className="text-sm text-gray-400">Get notified of new logins</p>
                      </div>
                      <Toggle
                        checked={settings.security.loginAlerts}
                        onChange={() => handleToggle('security', 'loginAlerts')}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] hover:from-[var(--brand-secondary)] hover:to-[var(--brand-accent)] rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Profile() {
  const nav = useNavigate();
  const handleNavigateBack = () => {
    nav('/'); // Navigate back to the previous page
  };

  return (
    <div className="font-sans">
      <ProfilePage onNavigateBack={handleNavigateBack} />
    </div>
  );
}