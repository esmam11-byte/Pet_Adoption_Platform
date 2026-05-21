
const Request = require('../models/Request');
const Pet = require('../models/Pet');

exports.createRequest = async (req, res) => {
  try {
    const { petId, pickupDate, message } = req.body;
    
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    if (pet.status === 'adopted') {
      return res.status(400).json({ message: 'This pet has already been adopted' });
    }
    
    if (pet.ownerEmail === req.userEmail) {
      return res.status(400).json({ message: 'Pet owners cannot request adoption for their own pets' });
    }
    
    const existingRequest = await Request.findOne({ 
      petId, 
      userId: req.userId, 
      status: { $in: ['pending', 'approved'] } 
    });
    
    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending or approved request for this pet' });
    }
    
    const request = new Request({
      petId,
      petName: pet.name,
      userId: req.userId,
      userName: req.userName,
      userEmail: req.userEmail,
      pickupDate,
      message,
      status: 'pending'
    });
    
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPetRequests = async (req, res) => {
  try {
    const { petId } = req.params;
    const pet = await Pet.findById(petId);
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    if (pet.ownerEmail !== req.userEmail) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const requests = await Request.find({ petId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    const pet = await Pet.findById(request.petId);
    if (!pet || pet.ownerEmail !== req.userEmail) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (status === 'approved') {
      const existingApproved = await Request.findOne({ petId: request.petId, status: 'approved' });
      if (existingApproved) {
        return res.status(400).json({ message: 'This pet already has an approved request' });
      }
      
      pet.status = 'adopted';
      await pet.save();
      
      await Request.updateMany(
        { petId: request.petId, _id: { $ne: requestId } },
        { status: 'rejected' }
      );
    }
    
    request.status = status;
    await request.save();
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await Request.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    if (request.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (request.status === 'approved') {
      const pet = await Pet.findById(request.petId);
      if (pet) {
        pet.status = 'available';
        await pet.save();
      }
    }
    
    await request.deleteOne();
    res.json({ message: 'Request cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
