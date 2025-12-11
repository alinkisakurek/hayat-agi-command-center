import api from './api';

// Sorun bildir
export const reportIssue = async (title, description) => {
  try {
    const response = await api.post('/api/issues/report', {
      title,
      description
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Sorun bildirilirken bir hata oluştu' };
  }
};

// Admin: Tüm sorunları getir
export const getAllIssues = async (status = null) => {
  try {
    const params = status ? { status } : {};
    const response = await api.get('/api/issues/all', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Sorunlar alınırken bir hata oluştu' };
  }
};

// Admin: Sorun detayını getir
export const getIssueById = async (id) => {
  try {
    const response = await api.get(`/api/issues/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Sorun detayı alınırken bir hata oluştu' };
  }
};

// Admin: Sorun durumunu güncelle
export const updateIssueStatus = async (id, status, adminNotes = '') => {
  try {
    const response = await api.put(`/api/issues/${id}/status`, {
      status,
      adminNotes
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Sorun durumu güncellenirken bir hata oluştu' };
  }
};

