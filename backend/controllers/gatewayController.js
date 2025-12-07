// Mock data storage
let mockGateways = [
  {
    _id: '1',
    name: 'Ön Kapı',
    status: 'active',
    battery: 85,
    signal_quality: 'strong',
    location: { lat: 41.0082, lng: 28.9784 },
    connected_devices: 3,
    uptime: 1200,
    last_seen: new Date(),
  },
  {
    _id: '2',
    name: 'Arka Bahçe',
    status: 'active',
    battery: 60,
    signal_quality: 'medium',
    location: { lat: 41.0080, lng: 28.9785 },
    connected_devices: 2,
    uptime: 950,
    last_seen: new Date(),
  },
];

let nextId = 3;

// Get All Gateways
exports.getGateways = async (req, res) => {
  try {
    res.status(200).json(mockGateways);
  } catch (error) {
    console.error('Error fetching gateways:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create New Gateway
exports.createGateway = async (req, res) => {
  try {
    const newGateway = {
      _id: String(nextId++),
      name: req.body.name,
      status: req.body.status || 'inactive',
      battery: 0,
      signal_quality: 'none',
      location: req.body.location,
      connected_devices: 0,
      uptime: 0,
      last_seen: new Date(),
    };
    mockGateways.push(newGateway);
    res.status(201).json(newGateway);
  } catch (error) {
    console.error('Error creating gateway:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete Gateway
exports.deleteGateway = async (req, res) => {
  try {
    mockGateways = mockGateways.filter(gw => gw._id !== req.params.id);
    res.json({ message: 'Gateway silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};