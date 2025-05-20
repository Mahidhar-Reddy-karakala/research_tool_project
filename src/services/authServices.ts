import axios from 'axios';
axios.defaults.withCredentials = true;
const API_URL = 'http://localhost:5000/api/auth';

export const register = async (username: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/register`, { username, email, password },{ withCredentials: true });
  return response.data;
};

export const  login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password },{ withCredentials: true });
  return response.data;
};
export const verify = async () => {
  const response = await axios.get(`${API_URL}/verify`, {
    withCredentials: true
  });
  return response.data;
};
