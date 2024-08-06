import React, { createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import OrderPage from './pages/OrderPage';
import NavigationBar from './components/Navbar';
import ProductPage from './pages/ProductsPage'
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RestockPage from './pages/RestockPage';
import './styles/App.css';


const AppContent = () => {
  return (
    <>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route
          path="/content/*"
          element={
            <ProtectedRoute>
              <>
                <NavigationBar />
                <Routes>
                  <Route path="/orders" element={<OrderPage />} />
                  <Route path="/products" element={<ProductPage />} />
                  <Route path="/products/restock" element={<RestockPage />} />
                </Routes>
              </>
            </ProtectedRoute>
          }
        />
      </Routes >
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router basename='/react-frontend'>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
