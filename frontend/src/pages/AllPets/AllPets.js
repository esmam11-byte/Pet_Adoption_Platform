import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import './AllPets.css';

const AllPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [species, setSpecies] = useState('All');
  const [sort, setSort] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Separate state for the actual search value that triggers API call
  const [activeSearch, setActiveSearch] = useState('');

  // Fetch pets when species, sort, or activeSearch changes
  useEffect(() => {
    fetchPets();
  }, [species, sort, activeSearch]);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/pets', {
        params: { 
          search: activeSearch, 
          species, 
          sort 
        }
      });
      setPets(res.data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission - this prevents the input from losing focus
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    setActiveSearch(searchTerm); // Update the active search
  };

  // Handle search input change without triggering re-render
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSpeciesChange = (e) => {
    setSpecies(e.target.value);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setActiveSearch('');
    setSpecies('All');
    setSort('newest');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container">
      <div className="all-pets-header">
        <h1>Find Your Perfect Companion</h1>
        <p>Browse our available pets waiting for a loving home</p>
      </div>

      <div className="filters-section">
        {/* Wrap search input in a form to prevent page refresh */}
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              autoComplete="off"
            />
            <button type="submit" className="search-btn">Search</button>
          </div>
        </form>
        
        <div className="filter-group">
          <select value={species} onChange={handleSpeciesChange}>
            <option value="All">All Species</option>
            <option value="Dog">Dogs</option>
            <option value="Cat">Cats</option>
            <option value="Bird">Birds</option>
            <option value="Rabbit">Rabbits</option>
            <option value="Other">Other</option>
          </select>
          
          <select value={sort} onChange={handleSortChange}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {pets.length === 0 ? (
        <div className="no-pets">
          <p>No pets found matching your criteria.</p>
          <button onClick={clearAllFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="results-count">
            Found {pets.length} pet{pets.length !== 1 ? 's' : ''}
          </div>
          <div className="pets-grid">
            {pets.map((pet) => (
              <div key={pet._id} className="pet-card">
                <img src={pet.imageUrl} alt={pet.name} className="pet-card-image" />
                <div className="pet-card-content">
                  <h3>{pet.name}</h3>
                  <p>{pet.breed} • {pet.age} years • {pet.gender}</p>
                  <p className="pet-price">${pet.adoptionFee}</p>
                  <Link to={`/pets/${pet._id}`} className="details-btn">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AllPets;