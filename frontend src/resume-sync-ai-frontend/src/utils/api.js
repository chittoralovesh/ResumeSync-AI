import axios from 'axios';

const API_BASE_URL = 'https://api.yourservice.com'; // Replace with your actual API base URL

// Function to handle GET requests
export const getRequest = async (endpoint) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error during GET request:', error);
    throw error;
  }
};

// Function to handle POST requests
export const postRequest = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error('Error during POST request:', error);
    throw error;
  }
};

// Function to handle PUT requests
export const putRequest = async (endpoint, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error('Error during PUT request:', error);
    throw error;
  }
};

// Function to handle DELETE requests
export const deleteRequest = async (endpoint) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error during DELETE request:', error);
    throw error;
  }
};