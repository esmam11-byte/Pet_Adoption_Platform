const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  getAllPets,
  getFeaturedPets,
  getPetById,
  addPet,
  updatePet,
  deletePet,
  getUserPets
} = require('../controllers/petController');

const router = express.Router();

router.get('/', getAllPets);
router.get('/featured', getFeaturedPets);
router.get('/user', authMiddleware, getUserPets);
router.get('/:id', getPetById);
router.post('/', authMiddleware, addPet);
router.put('/:id', authMiddleware, updatePet);
router.delete('/:id', authMiddleware, deletePet);

module.exports = router;