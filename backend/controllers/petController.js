
const Pet = require('../models/Pet');
const Request = require('../models/Request');

exports.getAllPets = async (req, res) => {
  try {
    const { search, species, sort } = req.query;
    let query = { status: 'available' };
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if (species && species !== 'All') {
      query.species = species;
    }
    
    let petsQuery = Pet.find(query);
    
    if (sort === 'price_asc') {
      petsQuery = petsQuery.sort({ adoptionFee: 1 });
    } else if (sort === 'price_desc') {
      petsQuery = petsQuery.sort({ adoptionFee: -1 });
    } else if (sort === 'newest') {
      petsQuery = petsQuery.sort({ createdAt: -1 });
    } else if (sort === 'oldest') {
      petsQuery = petsQuery.sort({ createdAt: 1 });
    }
    
    const pets = await petsQuery;
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeaturedPets = async (req, res) => {
  try {
    const pets = await Pet.find({ status: 'available' }).limit(6).sort({ createdAt: -1 });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addPet = async (req, res) => {
  try {
    const petData = { ...req.body, ownerEmail: req.userEmail };
    const pet = new Pet(petData);
    await pet.save();
    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    if (pet.ownerEmail !== req.userEmail) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    Object.assign(pet, req.body);
    await pet.save();
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    if (pet.ownerEmail !== req.userEmail) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Request.deleteMany({ petId: pet._id });
    await pet.deleteOne();
    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserPets = async (req, res) => {
  try {
    const pets = await Pet.find({ ownerEmail: req.userEmail });
    const total = pets.length;
    const available = pets.filter(p => p.status === 'available').length;
    const adopted = pets.filter(p => p.status === 'adopted').length;
    
    res.json({ pets, stats: { total, available, adopted } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
