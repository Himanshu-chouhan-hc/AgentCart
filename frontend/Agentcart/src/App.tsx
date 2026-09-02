import Navbar from "./components/layouts/navbar";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Addresses from "./pages/Addresses";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import AIShoppingAssistant from "./components/AIShoppingAssistant";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

function AppContent() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/login" && location.pathname !== "/signup" && (
        <Navbar />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addresses" element={<Addresses />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<Orders />} />
      </Routes>
      <AIShoppingAssistant />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;