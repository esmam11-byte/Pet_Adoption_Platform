import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import './PetDetails.css';

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    pickupDate: '',
    message: ''
  });

  useEffect(() => {
    fetchPetDetails();
  }, [id]);

  const fetchPetDetails = async () => {
    try {
      const res = await api.get(`/pets/${id}`);
      setPet(res.data);
    } catch (error) {
      console.error('Error fetching pet details:', error);
      toast.error('Failed to load pet details');
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptClick = () => {
    if (!user) {
      toast.error('Please login to submit an adoption request');
      navigate('/login');
      return;
    }
    setShowAdoptionForm(true);
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!formData.pickupDate) {
      toast.error('Please select a pickup date');
      return;
    }
    if (!formData.message || formData.message.length < 10) {
      toast.error('Please provide a message (minimum 10 characters)');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/requests', {
        petId: pet._id,
        pickupDate: formData.pickupDate,
        message: formData.message
      });
      toast.success('Adoption request submitted successfully!');
      setShowAdoptionForm(false);
      setFormData({ pickupDate: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!pet) return <div className="container"><h1>Pet not found</h1></div>;

  return (
    <div className="container">
      <div className="pet-details-container">
        <div className="pet-details-image">
          <img src={pet.imageUrl} alt={pet.name} />
        </div>
        
        <div className="pet-details-info">
          <h1>{pet.name}</h1>
          <div className="pet-meta">
            <span className="badge">{pet.species}</span>
            <span className="badge">{pet.breed}</span>
            <span className="badge">{pet.age} years</span>
            <span className="badge">{pet.gender}</span>
          </div>
          
          <div className="pet-details-section">
            <h3>About</h3>
            <p>{pet.description}</p>
          </div>
          
          <div className="pet-details-grid">
            <div><strong>Health Status:</strong> {pet.healthStatus}</div>
            <div><strong>Vaccination:</strong> {pet.vaccinationStatus}</div>
            <div><strong>Location:</strong> {pet.location}</div>
            <div><strong>Status:</strong> 
              <span className={`status-${pet.status}`}>{pet.status}</span>
            </div>
          </div>
          
          <div className="pet-price-large">
            Adoption Fee: ${pet.adoptionFee}
          </div>
          
          {pet.status === 'available' ? (
            <button className="adopt-btn" onClick={handleAdoptClick}>
              Adopt Now
            </button>
          ) : (
            <button className="adopted-btn" disabled>
              Already Adopted
            </button>
          )}
        </div>
      </div>

      {/* Adoption Form Modal */}
      {showAdoptionForm && (
        <div className="modal-overlay" onClick={() => setShowAdoptionForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Submit Adoption Request</h2>
            <form onSubmit={handleSubmitRequest}>
              <div className="form-group">
                <label>Pet Name</label>
                <input type="text" value={pet.name} readOnly disabled />
              </div>
              <div className="form-group">
                <label>Your Name</label>
                <input type="text" value={user?.name || ''} readOnly disabled />
              </div>
              <div className="form-group">
                <label>Your Email</label>
                <input type="email" value={user?.email || ''} readOnly disabled />
              </div>
              <div className="form-group">
                <label>Pickup Date *</label>
                <input 
                  type="date" 
                  required
                  value={formData.pickupDate}
                  onChange={(e) => setFormData({...formData, pickupDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea 
                  rows="4"
                  required
                  placeholder="Tell us why you'd like to adopt this pet..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAdoptionForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetDetails;