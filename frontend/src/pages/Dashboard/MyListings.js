import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // ← Add useNavigate here
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import '../Dashboard/Dashboard.css';

const MyListings = () => {
  const [pets, setPets] = useState([]);
  const [stats, setStats] = useState({ total: 0, available: 0, adopted: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // ← Add this line right here

  useEffect(() => {
    fetchMyPets();
  }, []);

  const fetchMyPets = async () => {
    try {
      const res = await api.get('/pets/user');
      setPets(res.data.pets);
      setStats(res.data.stats);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePet = async (petId) => {
    if (window.confirm('Are you sure you want to delete this pet listing?')) {
      try {
        await api.delete(`/pets/${petId}`);
        fetchMyPets();
      } catch (error) {
        console.error('Error deleting pet:', error);
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Pet Listings</h1>
        <p>Manage your listed pets</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Listings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.available}</div>
          <div className="stat-label">Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.adopted}</div>
          <div className="stat-label">Adopted</div>
        </div>
      </div>

      {pets.length === 0 ? (
        <div className="no-data">
          <p>You haven't listed any pets yet.</p>
          <Link to="/dashboard/add-pet" className="btn-primary">Add Your First Pet</Link>
        </div>
      ) : (
        <div className="pets-grid">
          {pets.map((pet) => (
            <div key={pet._id} className="pet-card-dashboard">
              <img src={pet.imageUrl} alt={pet.name} className="pet-card-image" />
              <div className="pet-card-content">
                <h3 className="pet-card-title">{pet.name}</h3>
                <p>{pet.breed} • {pet.age} years</p>
                <p className="pet-card-price">${pet.adoptionFee}</p>
                <div className="pet-card-actions">
                  {/* Change this button to use navigate */}
                  <button 
                    onClick={() => navigate(`/pets/${pet._id}`)} 
                    className="btn-secondary"
                  >
                    View
                  </button>
                  <button onClick={() => deletePet(pet._id)} className="btn-danger">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;