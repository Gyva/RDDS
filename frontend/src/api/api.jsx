import axios from 'axios';
import Cookies from 'js-cookie';

// Create an Axios instance
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Adjust to your backend's base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add access token to headers
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refreshing
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 (Unauthorized), try to refresh the token
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite loop

            try {
                // Refresh token using the refresh token
                const refreshToken = Cookies.get('refresh_token');
                const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
                    refresh: refreshToken,
                });

                // Save the new access token
                const { access } = response.data;
                Cookies.set('token', access, { expires: 7 });

                // Retry the original request with the new token
                originalRequest.headers['Authorization'] = `Bearer ${access}`;
                return api(originalRequest);
            } catch (err) {
                // Handle refresh token failure (e.g., redirect to login)
                console.error('Token refresh failed:', err);
                // Optionally, clear tokens and redirect to login
                Cookies.remove('token');
                Cookies.remove('refresh_token');
                window.location.href = '/login'; // Redirect to login if refresh fails
            }
        }

        return Promise.reject(error);
    }
);

export default api;
