import axios from 'axios';

export const API_BASE_URL = 'http://localhost:9091/';

// Helper to get tokens
const getActiveToken = () => localStorage.getItem('token') || ''; 
const getRefreshToken = () => localStorage.getItem('refreshToken');

export const API_ENDPOINTS = {
    LOGIN: 'auth/login',
    REFRESH: 'auth/refresh',
    FETCH_PROGRAMS: 'api/rural-projects/fetchAll',
    FETCH_COMPLIANCES: 'api/compliance-records',
    FETCH_AUDITS: 'api/audits/fetchAll',
    CREATE_AUDITS: 'api/audits/save',
    CREATE_REPORT: 'api/reports/save',
    FETCH_REPORTS: 'api/reports/fetchAll',
    REGISTER: 'auth/register',
    
    // ✅ Notification Endpoints
    NOTIFICATIONS_BY_FARMER: (farmerId) => `api/notifications/farmer/${farmerId}`,
    MARK_NOTIFICATION_READ: (id) => `api/notifications/${id}/read`,
};

// ✅ Added back for Subsidies and UserManagement components
export const getAuthHeaders = () => ({
    'Authorization': `Bearer ${getActiveToken()}`,
    'Content-Type': 'application/json',
});

export const saveTokens = ({ token, refreshToken }) => {
    if (token) localStorage.setItem('token', token);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
};

// --- Axios Interceptors ---

axios.interceptors.request.use((config) => {
    const token = getActiveToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);

        const refreshUrl = `${API_BASE_URL}${API_ENDPOINTS.REFRESH}`;
        const isRefreshRequest = originalRequest.url === refreshUrl || originalRequest.url?.includes(API_ENDPOINTS.REFRESH);
        
        if (isRefreshRequest) {
            clearTokens();
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            const refreshToken = getRefreshToken();
            if (!refreshToken) {
                clearTokens();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            originalRequest._retry = true;
            try {
                const response = await axios.post(
                    refreshUrl,
                    { refreshToken },
                    { headers: { 'Content-Type': 'application/json' } }
                );
                const newToken = response.data.token || response.data.accessToken;
                const newRefreshToken = response.data.refreshToken || response.data.refresh_token;
                
                if (!newToken) throw new Error('Token refresh failed');
                
                saveTokens({ token: newToken, refreshToken: newRefreshToken });
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                clearTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// --- ✅ Notification Service Functions ---

export const fetchNotifications = (farmerId) =>
    axios.get(`${API_BASE_URL}${API_ENDPOINTS.NOTIFICATIONS_BY_FARMER(farmerId)}`
);



export const markAsRead = (id) => 
    axios.patch(`${API_BASE_URL}${API_ENDPOINTS.MARK_NOTIFICATION_READ(id)}`);