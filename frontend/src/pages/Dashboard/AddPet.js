import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import '../Dashboard/Dashboard.css';

const AddPet = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    imageUrl: '',
    healthStatus: '',
    vaccinationStatus: 'Vaccinated',
    location: '',
    adoptionFee: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/pets', formData);
      toast.success('Pet added successfully!');
      navigate('/dashboard/my-listings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add pet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Add a Pet for Adoption</h1>
        <p>List a new pet to find them a loving home</p>
      </div>

      <form onSubmit={handleSubmit} className="dashboard-form">
        <div className="form-row">
          <div className="form-group">
            <label>Pet Name *</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Species *</label>
            <select value={formData.species} onChange={(e) => setFormData({...formData, species: e.target.value})}>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Rabbit">Rabbit</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Breed *</label>
            <input type="text" required value={formData.breed} onChange={(e) => setFormData({...formData, breed: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Age (years) *</label>
            <input type="number" required value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Gender *</label>
            <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="form-group">
            <label>Image URL *</label>
            <input type="text" required value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://example.com/pet-image.jpg" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Health Status *</label>
            <input type="text" required value={formData.healthStatus} onChange={(e) => setFormData({...formData, healthStatus: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Vaccination Status *</label>
            <select value={formData.vaccinationStatus} onChange={(e) => setFormData({...formData, vaccinationStatus: e.target.value})}>
              <option value="Vaccinated">Vaccinated</option>
              <option value="Partial">Partial</option>
              <option value="Not Vaccinated">Not Vaccinated</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location *</label>
            <input type="text" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Adoption Fee ($) *</label>
            <input type="number" required value={formData.adoptionFee} onChange={(e) => setFormData({...formData, adoptionFee: e.target.value})} />
          </div>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea rows="4" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Tell us about this pet's personality, behavior, and special needs..." />
        </div>

        <div className="form-group">
          <label>Owner Email (Auto-filled)</label>
          <input type="email" readOnly value={user?.email || ''} />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Adding Pet...' : 'Add Pet for Adoption'}
        </button>
      </form>
    </div>
  );
};

export default AddPet;