// Logic to manage the state of gateway devices
const mongoose = require('mongoose');
const Gateway = require('../models/Gateway');

// GET /api/gateways
async function getGateways(req, res, next) {
  try {
    const list = await Gateway.find().lean();
    res.json(list);
  } catch (err) {
    next(err);
  }
}

// POST /api/gateways
async function createGateway(req, res, next) {
  try {
    const gw = await Gateway.create(req.body);
    res.status(201).json(gw);
  } catch (err) {
    next(err);
  }
}

// GET /api/gateways/:id
async function getGatewayById(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid gateway id' });
    }
    const gw = await Gateway.findById(id).lean();
    if (!gw) {
      return res.status(404).json({ message: 'Gateway not found' });
    }
    res.json(gw);
  } catch (err) {
    next(err);
  }
}

// PUT /api/gateways/:id
async function updateGateway(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid gateway id' });
    }
    const updated = await Gateway.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: 'Gateway not found' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/gateways/:id
async function deleteGateway(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid gateway id' });
    }
    const deleted = await Gateway.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Gateway not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getGateways,
  createGateway,
  getGatewayById,
  updateGateway,
  deleteGateway,
};
