import axios from 'axios';

const API_BASE = '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchOverview = async (params = {}) => {
  const response = await client.get('/overview', { params });
  return response.data;
};

export const fetchCountries = async () => {
  const response = await client.get('/countries');
  return response.data;
};

export const fetchCountryDetail = async (code) => {
  const response = await client.get(`/country/${code}`);
  return response.data;
};

export const fetchComparison = async (country1, country2) => {
  const response = await client.get('/country/compare', {
    params: { country1, country2 }
  });
  return response.data;
};

export const fetchAnalytics = async (params = {}) => {
  const response = await client.get('/analytics', { params });
  return response.data;
};

export const fetchSustainability = async (params = {}) => {
  const response = await client.get('/sustainability', { params });
  return response.data;
};

export const runScenarioSimulation = async (payload) => {
  const response = await client.post('/scenario', payload);
  return response.data;
};
