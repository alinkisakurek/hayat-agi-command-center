import axios from 'axios';

const API_URL = 'http://localhost:5000/api/gateways';

// Mock data to use when backend is offline - Görseldeki gibi
const MOCK_DATA = [
    {
        _id: 'm1',
        name: 'Ön Kapı',
        status: 'active',
        battery: 87,
        signal_quality: 'strong',
        connected_devices: 3,
        uptime: 1200, // 20 dakika = 1200 saniye
        last_seen: new Date(Date.now() - 33 * 60 * 1000), // 33 dakika önce
        location: { lat: 41.0082, lng: 28.9784 }
    },
    {
        _id: 'm2',
        name: 'Arka Bahçe',
        status: 'active',
        battery: 61,
        signal_quality: 'medium',
        connected_devices: 2,
        uptime: 900, // 15 dakika = 900 saniye
        last_seen: new Date(Date.now() - 25 * 60 * 1000), // 25 dakika önce
        location: { lat: 41.0079, lng: 28.9790 }
    },
    {
        _id: 'm3',
        name: 'Çatı',
        status: 'low_battery',
        battery: 12,
        signal_quality: 'weak',
        connected_devices: 2,
        uptime: 360, // 6 dakika = 360 saniye
        last_seen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 saat önce
        location: { lat: 41.0090, lng: 28.9775 }
    },
    {
        _id: 'm4',
        name: 'Park',
        status: 'active',
        battery: 92,
        signal_quality: 'strong',
        connected_devices: 8,
        uptime: 432000, // 5 gün = 432000 saniye
        last_seen: new Date(Date.now() - 1 * 60 * 1000), // 1 dakika önce
        location: { lat: 41.0065, lng: 28.9800 }
    },
    {
        _id: 'm5',
        name: 'Okul',
        status: 'active',
        battery: 45,
        signal_quality: 'medium',
        connected_devices: 3,
        uptime: 259200, // 3 gün = 259200 saniye
        last_seen: new Date(Date.now() - 10 * 60 * 1000), // 10 dakika önce
        location: { lat: 41.0100, lng: 28.9760 }
    },
    {
        _id: 'm6',
        name: 'Hastane',
        status: 'active',
        battery: 78,
        signal_quality: 'strong',
        connected_devices: 12,
        uptime: 604800, // 7 gün = 604800 saniye
        last_seen: new Date(Date.now() - 3 * 60 * 1000), // 3 dakika önce
        location: { lat: 41.0085, lng: 28.9815 }
    },
    {
        _id: 'm7',
        name: 'İtfaiye',
        status: 'active',
        battery: 88,
        signal_quality: 'strong',
        connected_devices: 6,
        uptime: 345600, // 4 gün = 345600 saniye
        last_seen: new Date(Date.now() - 2 * 60 * 1000), // 2 dakika önce
        location: { lat: 41.0072, lng: 28.9778 }
    },
    {
        _id: 'm8',
        name: 'Belediye',
        status: 'active',
        battery: 65,
        signal_quality: 'strong',
        connected_devices: 10,
        uptime: 518400, // 6 gün = 518400 saniye
        last_seen: new Date(Date.now() - 4 * 60 * 1000), // 4 dakika önce
        location: { lat: 41.0095, lng: 28.9795 }
    },
    {
        _id: 'm9',
        name: 'Polis Merkezi',
        status: 'active',
        battery: 72,
        signal_quality: 'strong',
        connected_devices: 7,
        uptime: 432000, // 5 gün = 432000 saniye
        last_seen: new Date(Date.now() - 1 * 60 * 1000), // 1 dakika önce
        location: { lat: 41.0068, lng: 28.9782 }
    },
    {
        _id: 'm10',
        name: 'Alışveriş Merkezi',
        status: 'active',
        battery: 55,
        signal_quality: 'medium',
        connected_devices: 15,
        uptime: 259200, // 3 gün = 259200 saniye
        last_seen: new Date(Date.now() - 8 * 60 * 1000), // 8 dakika önce
        location: { lat: 41.0102, lng: 28.9802 }
    },
    {
        _id: 'm11',
        name: 'Otogar',
        status: 'active',
        battery: 38,
        signal_quality: 'medium',
        connected_devices: 4,
        uptime: 172800, // 2 gün = 172800 saniye
        last_seen: new Date(Date.now() - 12 * 60 * 1000), // 12 dakika önce
        location: { lat: 41.0075, lng: 28.9762 }
    },
    {
        _id: 'm12',
        name: 'Stadyum',
        status: 'inactive',
        battery: 50,
        signal_quality: 'medium',
        connected_devices: 0,
        uptime: 0,
        last_seen: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 saat önce
        location: { lat: 41.0098, lng: 28.9770 }
    },
    {
        _id: 'm13',
        name: 'İş Yeri',
        status: 'low_battery',
        battery: 18,
        signal_quality: 'weak',
        connected_devices: 1,
        uptime: 7200, // 2 saat = 7200 saniye
        last_seen: new Date(Date.now() - 15 * 60 * 1000), // 15 dakika önce
        location: { lat: 41.0088, lng: 28.9788 }
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