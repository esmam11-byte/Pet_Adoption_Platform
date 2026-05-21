
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaHeart } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>PetAdopt</h3>
            <p>Giving pets a second chance at happiness.</p>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: info@petadopt.com</p>
            <p>Phone: (555) 123-4567</p>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Made with <FaHeart /> for pets everywhere</p>
          <p>&copy; 2024 PetAdopt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
