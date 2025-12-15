import api from './api';

export const getSystemOptions = async () => {
    try {
        const response = await api.get('/metadata/system-options');
        return response.data;
    } catch (error) {
        console.error('Metadata servisi hatası:', error);
        throw error;
    }
};