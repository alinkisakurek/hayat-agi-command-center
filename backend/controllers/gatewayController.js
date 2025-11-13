// Gateway cihazlarının durumunu yöneten mantık (stub)
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

module.exports = {
  getGateways,
  createGateway,
};
