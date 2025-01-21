import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Products from "./pages/Products"; // Product list page
import ProductPage from "./pages/ProductPage"; // Add/Edit product page
import Sales from "./pages/Sales"; // Sales list page
import SalePage from "./pages/SalePage"; // Add/Edit sale page

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={<ProductPage />} />
            <Route path="/products/:productId" element={<ProductPage />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/sales/add" element={<SalePage />} />
            <Route path="/sales/:saleId" element={<SalePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
