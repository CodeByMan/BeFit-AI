import API from './Api';

const workoutService = {
  listWorkouts: async (params = {}) => {
    const res = await API.get('/workouts', { params });
    return res.data;
  },

  getWorkout: async (id) => {
    const res = await API.get(`/workouts/${id}`);
    return res.data;
  },

  createWorkout: async (data) => {
    const res = await API.post('/workouts', data);
    return res.data;
  },

  updateWorkout: async (id, data) => {
    const res = await API.put(`/workouts/${id}`, data);
    return res.data;
  },

  deleteWorkout: async (id) => {
    const res = await API.delete(`/workouts/${id}`);
    return res.data;
  },

  getAnalytics: async (params = {}) => {
    const res = await API.get('/workouts/analytics', { params });
    return res.data;
  },
};

export default workoutService;
