
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShieldAlt, FaClock, FaDog, FaCat } from 'react-icons/fa';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import './Home.css';

const Home = () => {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedPets();
  }, []);

  const fetchFeaturedPets = async () => {
    try {
      const res = await api.get('/pets/featured');
      setFeaturedPets(res.data);
    } catch (error) {
      console.error('Error fetching featured pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const successStories = [
    { name: 'Max & Sarah', story: 'Max was rescued from the streets. Now he enjoys daily walks and belly rubs with his forever family.', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&h=200&fit=crop' },
    { name: 'Luna & Michael', story: 'Luna brought so much joy to Michael\'s life. They are inseparable companions.', image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=200&fit=crop' },
    { name: 'Charlie & Emma', story: 'From shelter to happy home, Charlie found his perfect match in Emma.', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=200&fit=crop' },
  ];

  const petCareTips = [
    { icon: <FaHeart />, title: 'Regular Vet Visits', description: 'Schedule annual check-ups to keep your pet healthy.' },
    { icon: <FaShieldAlt />, title: 'Vaccinations', description: 'Keep vaccinations up to date for disease prevention.' },
    { icon: <FaClock />, title: 'Daily Exercise', description: 'Ensure 30-60 minutes of activity daily.' },
  ];

  const speciesIcons = {
    'Dog': <FaDog />,
    'Cat': <FaCat />,
    'Bird': <FaDog />,
    'Rabbit': <FaCat />,
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Find Your <span className="highlight">Perfect</span> Companion
            </h1>
            <p className="hero-subtitle">
              Give a loving home to a pet in need. Thousands of dogs, cats, birds, and rabbits are waiting for their forever family.
            </p>
            <Link to="/pets" className="hero-btn">
              Adopt Now
              <span className="btn-arrow">→</span>
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Happy Adoptions</span>
            </div>
            <div className="stat">
              <span className="stat-number">200+</span>
              <span className="stat-label">Pets Rescued</span>
            </div>
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Volunteers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="featured-pets">
        <div className="container">
          <div className="section-header">
            <h2>Featured Pets</h2>
            <p>Meet some of our adorable pets waiting for a loving home</p>
          </div>
          <div className="pets-grid">
            {featuredPets.map((pet) => (
              <div key={pet._id} className="pet-card">
                <div className="pet-card-image-wrapper">
                  <img src={pet.imageUrl} alt={pet.name} className="pet-card-image" />
                  <div className="pet-species-badge">
                    {speciesIcons[pet.species] || <FaDog />} {pet.species}
                  </div>
                </div>
                <div className="pet-card-content">
                  <h3 className="pet-name">{pet.name}</h3>
                  <div className="pet-details">
                    <span>{pet.breed}</span>
                    <span>{pet.age} years</span>
                    <span>{pet.gender}</span>
                  </div>
                  <div className="pet-price">${pet.adoptionFee}</div>
                  <Link to={`/pets/${pet._id}`} className="details-btn">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Adopt Section */}
      <section className="why-adopt">
        <div className="container">
          <div className="section-header">
            <h2>Why Adopt a Pet?</h2>
            <p>Adoption changes lives - both yours and your new companion's</p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🏠</div>
              <h3>Give a Second Chance</h3>
              <p>Provide a loving home to a pet in need and save a life</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">❤️</div>
              <h3>Unconditional Love</h3>
              <p>Experience the joy and loyalty of a rescued pet</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💰</div>
              <h3>Cost Effective</h3>
              <p>Adoption fees are much lower than buying from breeders</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">✅</div>
              <h3>Health Checked</h3>
              <p>All pets are vaccinated, microchipped, and health checked</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="success-stories">
        <div className="container">
          <div className="section-header">
            <h2>Success Stories</h2>
            <p>Real stories of love and companionship</p>
          </div>
          <div className="stories-grid">
            {successStories.map((story, index) => (
              <div key={index} className="story-card">
                <img src={story.image} alt={story.name} className="story-image" />
                <div className="story-content">
                  <h3>{story.name}</h3>
                  <p>{story.story}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pet Care Tips Section */}
      <section className="care-tips">
        <div className="container">
          <div className="section-header">
            <h2>Pet Care Tips</h2>
            <p>Essential advice for new pet parents</p>
          </div>
          <div className="tips-grid">
            {petCareTips.map((tip, index) => (
              <div key={index} className="tip-card">
                <div className="tip-icon">{tip.icon}</div>
                <h3>{tip.title}</h3>
                <p>{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Welcome a New Friend?</h2>
            <p>Start your adoption journey today and change a life forever</p>
            <Link to="/pets" className="cta-btn">Browse Available Pets</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
