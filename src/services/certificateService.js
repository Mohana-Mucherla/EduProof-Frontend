import api from './api';

export const certificateService = {
  getAllCertificates: async (search = '') => {
    const url = search ? `/certificates?search=${encodeURIComponent(search)}` : '/certificates';
    const response = await api.get(url);
    return response.data;
  },

  getCertificateById: async (id) => {
    const response = await api.get(`/certificates/${id}`);
    return response.data;
  },

  getCertificatesByStudent: async (studentId) => {
    const response = await api.get(`/certificates/student/${studentId}`);
    return response.data;
  },

  issueCertificate: async (issueData) => {
    const response = await api.post('/certificates', issueData);
    return response.data;
  },

  revokeCertificate: async (id, reason) => {
    const response = await api.put(`/certificates/${id}/revoke`, { reason });
    return response.data;
  },

  getDownloadUrl: (id) => {
    return `/api/certificates/download/${id}`;
  },

  getDepartments: async () => {
    const response = await api.get('/departments');
    return response.data;
  },

  getCertificateTypes: async () => {
    const response = await api.get('/certificate-types');
    return response.data;
  }
};

export default certificateService;
