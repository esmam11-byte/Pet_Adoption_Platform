
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaPaw, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-container">
          <Link to="/" className="logo">
            <FaPaw className="logo-icon" />
            <span>Pet<span className="logo-highlight">Adopt</span></span>
          </Link>

          <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/pets" onClick={() => setMobileMenuOpen(false)}>All Pets</Link>
            {user && (
              <>
                <Link to="/dashboard/my-requests" onClick={() => setMobileMenuOpen(false)}>My Requests</Link>
                <Link to="/dashboard/add-pet" onClick={() => setMobileMenuOpen(false)}>Add Pet</Link>
                <Link to="/dashboard/my-listings" onClick={() => setMobileMenuOpen(false)}>My Listings</Link>
              </>
            )}
          </div>

          <div className="nav-right">
            {user ? (
              <div className="profile-dropdown">
                <button 
                  className="profile-btn" 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <img src={user.photoURL || 'https://via.placeholder.com/40'} alt={user.name} />
                  <span>{user.name.split(' ')[0]}</span>
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/dashboard/my-requests" onClick={() => setDropdownOpen(false)}>
                      <FaUser /> Dashboard
                    </Link>
                    <button onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="login-btn">Login</Link>
            )}
            
            <button 
              className="mobile-menu-btn" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
