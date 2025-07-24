import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Truck, Shield, Headphones, RefreshCcw, Zap, Globe, ShoppingCart, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('form'); // 'form' for initial form, 'otp' for OTP verification
  const navigate = useNavigate();
  const location = useLocation();

  // Handle Google OAuth callback
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const errorMsg = query.get('msg');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/profile', { replace: true });
      if (window.location.search) {
        window.history.replaceState({}, document.title, '/');
      }
    } else if (errorMsg) {
      let userFriendlyError = decodeURIComponent(errorMsg);
      if (userFriendlyError.includes('already exists')) {
        userFriendlyError = 'An account with this email already exists. Please sign in with your password or use a different email.';
      } else if (userFriendlyError.includes('Google authentication')) {
        userFriendlyError = 'Google authentication failed. Please try again or use email/password login.';
      } else {
        userFriendlyError = userFriendlyError || 'An error occurred during authentication. Please try again.';
      }
      setError(userFriendlyError);
      navigate('/auth', { replace: true });
      if (window.location.search) {
        window.history.replaceState({}, document.title, '/auth');
      }
    }
  }, [location, navigate]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', otp: '' });
    setStep('form');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://abinexis-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/', { replace: true });
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://abinexis-backend.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setStep('otp');
        setError('');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://abinexis-backend.onrender.com/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/profile', { replace: true });
      } else {
        setError(data.message || 'OTP verification failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setError('');
    window.location.href = 'https://abinexis-backend.onrender.com/api/auth/google';
  };

  const handleClearError = () => {
    setError('');
    setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', otp: '' });
  };

  const benefits = [
    {
      icon: <Truck className="w-5 h-5" />,
      title: "Global Dropshipping"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Lightning Fast Processing"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Secure & Trusted Platform"
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Multi-Currency Support"
    },
    {
      icon: <Headphones className="w-5 h-5" />,
      title: "24/7 Customer Support"
    },
    {
      icon: <RefreshCcw className="w-5 h-5" />,
      title: "Real-time Analytics"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 min-h-[550px]">
            {/* Left Side - Benefits */}
            <div className="relative p-7 lg:p-10 bg-gradient-to-br from-[#52B69A]/10 to-[#34A0A4]/10 border-r border-gray-800/50">
              <div className="absolute inset-0 bg-gradient-to-br from-[#52B69A]/5 to-[#168AAD]/5 rounded-l-2xl"></div>
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-gradient-to-r from-[#52B69A] to-[#34A0A4] rounded-xl flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Abinexis</h1>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                    Revolutionize your 
                    <span className="block bg-gradient-to-r from-[#52B69A] to-[#34A0A4] bg-clip-text text-transparent">
                      e-commerce journey
                    </span>
                  </h2>
                  <p className="text-base text-gray-300 mb-7">
                    Join thousands of entrepreneurs who trust Abinexis for their e-commerce success.
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2.5 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-800/40"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-[#52B69A] to-[#34A0A4] rounded-md flex items-center justify-center">
                        {benefit.icon}
                      </div>
                      <span className="text-gray-200 font-medium text-sm">{benefit.title}</span>
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-r from-[#52B69A]/20 to-[#34A0A4]/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
                <div className="absolute top-1/4 right-0 w-16 h-16 bg-gradient-to-r from-[#168AAD]/20 to-[#1A759F]/20 rounded-full blur-2xl translate-x-1/2"></div>
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="p-7 lg:p-10 flex items-center justify-center bg-gray-800/50">
              <div className="w-full max-w-sm">
                <div className="text-center mb-6">
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                    <span className="block bg-gradient-to-r from-[#52B69A] to-[#34A0A4] bg-clip-text text-transparent">
                      {isLogin ? 'Welcome Back' : step === 'form' ? 'Join Abinexis' : 'Verify OTP'}
                    </span>
                  </h2>
                  <p className="text-gray-400">
                    {isLogin
                      ? 'Please login to your account'
                      : step === 'form'
                      ? 'Create your account to get started'
                      : 'Enter the OTP sent to your email'}
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <p className="text-red-400 text-sm flex-1">{error}</p>
                      <button
                        onClick={handleClearError}
                        className="text-gray-400 hover:text-gray-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {error.includes('password authentication') && (
                      <button
                        onClick={() => {
                          setIsLogin(true);
                          setError('');
                          setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', otp: '' });
                          setStep('form');
                        }}
                        className="mt-2 text-[#52B69A] hover:text-[#34A0A4] text-sm underline block"
                      >
                        Try Password Login
                      </button>
                    )}
                    {error.includes('Google authentication') && (
                      <button
                        onClick={handleGoogleLogin}
                        className="mt-2 text-[#52B69A] hover:text-[#34A0A4] text-sm underline block"
                      >
                        Try Google Login Again
                      </button>
                    )}
                  </div>
                )}

                <form onSubmit={isLogin ? handleLogin : (step === 'form' ? handleSignup : handleVerifyOTP)} className="space-y-4">
                  {!isLogin && step === 'form' && (
                    <>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#52B69A] transition-colors duration-300" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="First Name"
                          className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#52B69A] focus:ring-2 focus:ring-[#52B69A]/20 transition-all duration-300"
                          required
                        />
                      </div>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#52B69A] transition-colors duration-300" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Last Name (optional)"
                          className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#52B69A] focus:ring-2 focus:ring-[#52B69A]/20 transition-all duration-300"
                        />
                      </div>
                    </>
                  )}

                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#52B69A] transition-colors duration-300" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#52B69A] focus:ring-2 focus:ring-[#52B69A]/20 transition-all duration-300"
                      required
                    />
                  </div>

                  {(isLogin || step === 'form') && (
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#52B69A] transition-colors duration-300" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full pl-10 pr-10 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#52B69A] focus:ring-2 focus:ring-[#52B69A]/20 transition-all duration-300"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#52B69A] transition-colors duration-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  )}

                  {!isLogin && step === 'form' && (
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#52B69A] transition-colors duration-300" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        className="w-full pl-10 pr-10 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#52B69A] focus:ring-2 focus:ring-[#52B69A]/20 transition-all duration-300"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#52B69A] transition-colors duration-300"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  )}

                  {!isLogin && step === 'otp' && (
                    <div className="relative group">
                      <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        placeholder="Enter OTP"
                        className="w-full pl-4 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#52B69A] focus:ring-2 focus:ring-[#52B69A]/20 transition-all duration-300"
                        required
                      />
                    </div>
                  )}

                  {isLogin && (
                    <div className="text-right">
                      <button
                        type="button"
                        className="text-sm text-[#52B69A] hover:text-[#34A0A4] transition-colors duration-300"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-[#52B69A] to-[#34A0A4] text-white font-semibold rounded-lg hover:from-[#34A0A4] hover:to-[#168AAD] focus:outline-none focus:ring-2 focus:ring-[#52B69A]/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-300"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {isLogin
                          ? 'Signing In...'
                          : step === 'form'
                          ? 'Creating Account...'
                          : 'Verifying OTP...'}
                      </div>
                    ) : isLogin
                    ? 'Sign In'
                    : step === 'form'
                    ? 'Create Account'
                    : 'Verify OTP'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm">
                    {isLogin ? "Don't have an account?" : step === 'form' ? 'Already have an account?' : ''}
                    {(!isLogin && step === 'form') && (
                      <button
                        onClick={toggleForm}
                        className="ml-2 text-[#52B69A] hover:text-[#34A0A4] font-semibold transition-colors duration-300"
                      >
                        Sign In
                      </button>
                    )}
                    {isLogin && (
                      <button
                        onClick={toggleForm}
                        className="ml-2 text-[#52B69A] hover:text-[#34A0A4] font-semibold transition-colors duration-300"
                      >
                        Sign Up
                      </button>
                    )}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-gray-900/50 text-gray-400">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1">
                    <button 
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      className="flex items-center justify-center px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.20-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.60 3.30-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-gray-300 group-hover:text-white transition-colors duration-300 text-sm">
                        {isLoading ? 'Redirecting...' : 'Google'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}