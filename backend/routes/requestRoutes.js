const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  createRequest,
  getUserRequests,
  getPetRequests,
  updateRequestStatus,
  cancelRequest
} = require('../controllers/requestController');

const router = express.Router();

router.post('/', authMiddleware, createRequest);
router.get('/my-requests', authMiddleware, getUserRequests);
router.get('/pet/:petId', authMiddleware, getPetRequests);
router.put('/:requestId/status', authMiddleware, updateRequestStatus);
router.delete('/:requestId', authMiddleware, cancelRequest);

module.exports = router;