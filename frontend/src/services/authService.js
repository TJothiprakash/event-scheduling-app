import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Adjust the URL as per your backend setup

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await axios.post(`${API_URL}/register`, { username, email, password });
  return response.data;
};
