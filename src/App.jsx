import Homepage from './Pages/Home/Homepage';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Shop from './Pages/Shop/shop';
import Product from './Pages/Product/Product';
import CheckoutPage from './Pages/Checkout/CheckoutPage';
import Cart from './Pages/Cart/Cart';
import Order from './Pages/Order/Order';
import Wishlist from './Pages/wishlist/Wishlist';
import OrderDetail from './Pages/Order/OrderDetail';
import AuthPage from './Pages/AuthPage';
import Profile from './Pages/Setting/Profile';
import About from './Pages/about/About';
import TermsAndConditions from './Pages/ServicesPage/TermsAndConditions';
import PrivacyPolicy from './Pages/ServicesPage/PrivacyPolicy';
import ShippingInformation from './Pages/ServicesPage/ShippingInformation';
import ReturnRefundPolicy from './Pages/ServicesPage/ReturnRefundPolicy';
import FAQ from './Pages/ServicesPage/FAQ';

// ProtectedRoute component to handle authentication
function ProtectedRoute({ element }) {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/auth"/>;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/shop/:category" element={<Shop />} />
          <Route path="/shop/:category/:productid" element={<Product />} />
          <Route path="/checkout" element={<ProtectedRoute element={<CheckoutPage />} />} />
          <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
          <Route path="/order" element={<ProtectedRoute element={<Order />} />} />
          <Route path="/order/:id" element={<ProtectedRoute element={<OrderDetail />} />} />
          <Route path="/wishlist" element={<ProtectedRoute element={<Wishlist />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/shipping" element={<ShippingInformation />} />
          <Route path="/returns" element={<ReturnRefundPolicy />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;