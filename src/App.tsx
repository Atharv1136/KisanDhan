import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import PriceComparison from './pages/farmer/PriceComparison';
import MSPInformation from './pages/farmer/MSPInformation';
import ProcurementCenters from './pages/farmer/ProcurementCenters';
import SellingDeadlines from './pages/farmer/SellingDeadlines';
import UserAccount from './pages/common/UserAccount';
import AdminDashboard from './pages/admin/AdminDashboard';
import ShopkeeperDashboard from './pages/shopkeeper/ShopkeeperDashboard';
import AddShop from './pages/shopkeeper/AddShop';
import ManageCrops from './pages/shopkeeper/ManageCrops';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/common/NotFound';
import './i18n';

function App() {
  const { t } = useTranslation();
  const [userType, setUserType] = useState<string | null>(null);
  
  // Simulate user authentication
  useEffect(() => {
    // For demo purposes, we'll set a default user type
    // In a real app, this would come from authentication
    const storedUserType = localStorage.getItem('userType') || 'farmer';
    setUserType(storedUserType);
  }, []);

  const handleUserTypeChange = (type: string) => {
    localStorage.setItem('userType', type);
    setUserType(type);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header userType={userType} onUserTypeChange={handleUserTypeChange} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Farmer Routes */}
            <Route path="/price-comparison" element={<PriceComparison />} />
            <Route path="/msp-information" element={<MSPInformation />} />
            <Route path="/procurement-centers" element={<ProcurementCenters />} />
            <Route path="/selling-deadlines" element={<SellingDeadlines />} />
            
            {/* Shopkeeper Routes */}
            <Route path="/shopkeeper" element={<ShopkeeperDashboard />} />
            <Route path="/shopkeeper/add-shop" element={<AddShop />} />
            <Route path="/shopkeeper/manage-crops" element={<ManageCrops />} />
            
            {/* Common Routes */}
            <Route path="/account" element={<UserAccount />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;