import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home/Home';
import AllPets from './pages/AllPets/AllPets';
import PetDetails from './pages/PetDetails/PetDetails';
import MyRequests from './pages/Dashboard/MyRequests';
import AddPet from './pages/Dashboard/AddPet';
import MyListings from './pages/Dashboard/MyListings';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import NotFound from './pages/NotFound/NotFound';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pets" element={<AllPets />} />
              <Route path="/pets/:id" element={<PetDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard/my-requests" element={<PrivateRoute><MyRequests /></PrivateRoute>} />
              <Route path="/dashboard/add-pet" element={<PrivateRoute><AddPet /></PrivateRoute>} />
              <Route path="/dashboard/my-listings" element={<PrivateRoute><MyListings /></PrivateRoute>} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;