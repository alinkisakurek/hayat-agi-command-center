import api from '../services/api';

const API_URL = '/admin/stats';

// GET /api/admin/stats/citizens?province=&district=&neighborhood=
// KVKK uyumlu agrega yanıt — yalnızca sayısal alanlar döner.
export const getCitizenStats = async ({ province, district, neighborhood } = {}) => {
  const params = {};
  if (province) params.province = province;
  if (district) params.district = district;
  if (neighborhood) params.neighborhood = neighborhood;
  const response = await api.get(`${API_URL}/citizens`, { params });
  return response.data;
};
