import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

/* Components */
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import AdminRoute from "./components/AdminRoute";

/* User Pages */
import Home from "./pages/user/Home";
import Categories from "./pages/user/Categories";
import Search from "./pages/user/Search";
import Cart from "./pages/user/Cart";
import Wishlist from "./pages/user/Wishlist";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import Profile from "./pages/user/Profile";
import ProductDetails from "./pages/user/ProductDetails";
import Checkout from "./pages/user/Checkout";
import OrderTracking from "./pages/user/OrderTracking";

/* Admin Pages */
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddProduct from "./pages/admin/AddProduct";
import ManageProducts from "./pages/admin/ManageProducts";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";

function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {isAdminRoute && location.pathname !== "/admin/login" && <AdminNavbar />}

      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/track-order" element={<OrderTracking />} />

        {/* Admin Entry */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />
        <Route path="/admin/add-product" element={
          <AdminRoute><AddProduct /></AdminRoute>
        } />
        <Route path="/admin/manage-products" element={
          <AdminRoute><ManageProducts /></AdminRoute>
        } />
        <Route path="/admin/orders" element={
          <AdminRoute><Orders /></AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute><Users /></AdminRoute>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
