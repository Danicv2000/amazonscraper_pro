import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import AdminLogin from "pages/admin-login";
import WhatsAppCheckoutRedirect from "pages/whats-app-checkout-redirect";
import ProductCatalog from "pages/product-catalog";
import AdminDashboard from "pages/admin-dashboard";
import ShoppingCart from "pages/shopping-cart";
import ProductDetail from "pages/product-detail";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<ProductCatalog />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/whats-app-checkout-redirect" element={<WhatsAppCheckoutRedirect />} />
        <Route path="/product-catalog" element={<ProductCatalog />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/shopping-cart" element={<ShoppingCart />} />
        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;