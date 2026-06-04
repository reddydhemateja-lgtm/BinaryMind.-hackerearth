import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.error || err.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// SQL APIs
export const sqlAPI = {
  analyze: (query, dialect) => api.post('/api/sql/analyze', { query, dialect }),
  optimize: (query, dialect, context) => api.post('/api/sql/optimize', { query, dialect, context }),
  nlToSql: (prompt, schema, dialect) => api.post('/api/sql/nl-to-sql', { prompt, schema, dialect }),
};

// Compare APIs
export const compareAPI = {
  compareFiles: (formData) => api.post('/api/compare/files', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  compareText: (text1, text2, mode, name1, name2) =>
    api.post('/api/compare/text', { text1, text2, mode, name1, name2 }),
  getAISummary: (diff, name1, name2) =>
    api.post('/api/compare/ai-summary', { diff, name1, name2 }),
};

// Analysis APIs
export const analysisAPI = {
  analyzeFile: (formData) => api.post('/api/analysis/data', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  detectSchema: (data, format) => api.post('/api/analysis/schema', { data, format }),
  getCleaningSuggestions: (formData) => api.post('/api/analysis/clean', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const healthCheck = () => api.get('/health');

export default api;
