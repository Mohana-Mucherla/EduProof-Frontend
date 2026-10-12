import api from './api';

export const verificationService = {
  verifyCertificate: async (certificateCode, verifier = 'Public Recruiter / Verifier') => {
    const response = await api.get(`/verify/${encodeURIComponent(certificateCode.trim())}?verifier=${encodeURIComponent(verifier)}`);
    return response.data;
  },

  verifyByStudentName: async (name, verifier = 'Recruiter') => {
    const response = await api.get(`/verify/student?name=${encodeURIComponent(name.trim())}&verifier=${encodeURIComponent(verifier)}`);
    return response.data;
  },

  getVerificationLogs: async () => {
    const response = await api.get('/verification-logs');
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  }
};

export default verificationService;
