import axios from 'axios';

const API_URL = 'http://localhost:5000/api/gateways';

// Mock data to use when backend is offline
const MOCK_DATA = [
    {
        _id: 'm1',
        name: 'Ön Kapı',
        status: 'active',
        battery: 85,
        location: { lat: 41.0082, lng: 28.9784 }
    },
    {
        _id: 'm2',
        name: 'Arka Bahçe',
        status: 'inactive',
        battery: 60,
        location: { lat: 41.0079, lng: 28.9790 }
    },
    {
        _id: 'm3',
        name: 'Çatı',
        status: 'low_battery',
        battery: 12,
        location: { lat: 41.0090, lng: 28.9775 }
    }
];

export const getGateways = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.warn('Backend offline, using mock data');
        // simulate network latency
        await new Promise((resolve) => setTimeout(resolve, 500));
        return Promise.resolve(MOCK_DATA);
    }
};

export const createGateway = async (gatewayData) => {
    const response = await axios.post(API_URL, gatewayData);
    return response.data;
};


export const deleteGateway = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};