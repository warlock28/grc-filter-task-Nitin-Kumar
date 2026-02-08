import axios from 'axios';

const API_URL = 'http://localhost:8000';

const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 5000, // 5 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for centralized error handling
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (!error.response) {
            // Network error
            console.error("Network Error: Backend might be down.");
        } else {
            console.error(`API Error: ${error.response.status} - ${error.response.data.detail || error.message}`);
        }
        return Promise.reject(error);
    }
);

export const assessRisk = async (data) => {
    return await apiClient.post('/assess-risk', data);
};

export const getRisks = async (level) => {
    const params = level && level !== 'All' ? { level } : {};
    return await apiClient.get('/risks', { params });
};
