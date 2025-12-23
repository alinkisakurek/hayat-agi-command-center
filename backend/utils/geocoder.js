const axios = require('axios');

exports.getCoordsFromAddress = async (address) => {
    try {
        if (!address) return null;

        let queryStr;
        if (typeof address === 'string') {
            queryStr = address.trim();
        } else if (typeof address === 'object') {
            if (address.full && String(address.full).trim()) {
                queryStr = String(address.full).trim();
            } else {
                const parts = [address.street, address.buildingNo, address.neighborhood, address.district, address.city, address.province, address.postalCode];
                queryStr = parts.filter(Boolean).map(p => String(p).trim()).join(', ');
            }
        } else {
            queryStr = String(address);
        }

        if (!queryStr) return null;

        const query = encodeURIComponent(queryStr);
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&accept-language=tr&q=${query}&limit=1`;

        const response = await axios.get(url, {
            headers: { 'User-Agent': 'HayatAgiApp/1.0' }
        });

        if (response.data && response.data.length > 0) {
            const r = response.data[0];
            return {
                lat: parseFloat(r.lat),
                lng: parseFloat(r.lon),
                raw: r
            };
        }

        return null;

    } catch (error) {
        console.error('Geocoding Hatası:', error.message);
        return null;
    }
};