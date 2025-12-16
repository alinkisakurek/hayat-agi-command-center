const axios = require('axios');

exports.getCoordsFromAddress = async (addressText) => {
    try {
        const query = encodeURIComponent(addressText);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;

        const response = await axios.get(url, {
            headers: { 'User-Agent': 'HayatAgiApp/1.0' }
        });

        if (response.data && response.data.length > 0) {
            return {
                lat: parseFloat(response.data[0].lat),
                lng: parseFloat(response.data[0].lon)
            };
        }

        return null;

    } catch (error) {
        console.error('Geocoding Hatası:', error.message);
        return null;
    }
};