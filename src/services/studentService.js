import api from './api';

export const studentService = {
  getAllStudents: async (search = '') => {
    const url = search ? `/students?search=${encodeURIComponent(search)}` : '/students';
    const response = await api.get(url);
    return response.data;
  },

  getStudentById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  getMyProfile: async () => {
    const response = await api.get('/students/profile/me');
    return response.data;
  },

  createStudent: async (studentData, initialPassword = 'Student@123') => {
    const response = await api.post(`/students?initialPassword=${encodeURIComponent(initialPassword)}`, studentData);
    return response.data;
  },

  updateStudent: async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  },

  deleteStudent: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  }
};

export default studentService;
