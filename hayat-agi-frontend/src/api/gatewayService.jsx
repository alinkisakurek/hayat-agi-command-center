
import api from '../services/api';

const API_URL = '/gateways';

// 1. Tüm Cihazları Getir
export const getGateways = async () => {
    // Backend'e git, veri varsa getir, yoksa hata fırlat (Mock veri yok!)
    const response = await api.get(API_URL);
    return response.data;
};

// 2. Kullanıcının Cihazlarını Getir
export const getUserGateways = async () => {
    const response = await api.get(`${API_URL}/user`);
    return response.data;
};

// 3. Yeni Cihaz Ekle
export const createGateway = async (gatewayData) => {
    const response = await api.post(API_URL, gatewayData);
    return response.data;
};

// 4. Cihaz Güncelle (Backend'e eklediğimiz update fonksiyonu için)
export const updateGateway = async (id, gatewayData) => {
    const response = await api.put(`${API_URL}/${id}`, gatewayData);
    return response.data;
};

// 5. Cihaz Sil
export const deleteGateway = async (id) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
};

// 6. Cihaz'a kişi ekle
export const addPersonToGateway = async (gatewayId, personData) => {
    const response = await api.post(`${API_URL}/${gatewayId}/citizens`, personData);
    return response.data;
};

// 7. Cihaz'tan kişi sil
export const removePersonFromGateway = async (gatewayId, personId) => {
    const response = await api.delete(`${API_URL}/${gatewayId}/citizens/${personId}`);
    return response.data;
};

// 8. Cihaz'a evcil hayvan ekle
export const addPetToGateway = async (gatewayId, petData) => {
    const response = await api.post(`${API_URL}/${gatewayId}/pets`, petData);
    return response.data;
};

// 9. Cihaz'tan evcil hayvan sil
export const removePetFromGateway = async (gatewayId, petId) => {
    const response = await api.delete(`${API_URL}/${gatewayId}/pets/${petId}`);
    return response.data;
};