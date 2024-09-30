import axios from 'axios';
import Cookies from 'js-cookie';

// Create an axios instance
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // Your base URL
});

// Add an interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through valid responses
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 (Unauthorized) and token has expired
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loop of retries

      try {
        // Attempt to refresh the token
        const refreshToken = Cookies.get('refresh_token'); // Get the refresh token from cookies
        const accessToken = Cookies.get('token'); // The old (expired) access token

        const response = await axios.post(
          'http://127.0.0.1:8000/api/token/refresh/', // Token refresh endpoint
          { refresh: refreshToken },  // Send refresh token in the request body
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,  // Bearer expired token
              'Content-Type': 'application/json',
            }
          }
        );

        // Get the new access token from the response
        const newAccessToken = response.data?.access;
        const newRefreshToken = response.data?.refresh;

        // Save the new token in cookies (or state)
        Cookies.set('token', newAccessToken, {expires : 0.5/24});
        //save the new refresh token in cookies (or state)
        Cookies.set('refresh_token',newRefreshToken, {expires : 7} )

        // Update the authorization header with the new token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        localStorage.setItem("isAuthenticated", true);

        // Retry the original request with the new token
        return axiosInstance(originalRequest);

      } catch (tokenRefreshError) {
        // If refresh fails, you can handle the error (logout, redirect, etc.)
        console.log('Token refresh failed:', tokenRefreshError);
        return Promise.reject(tokenRefreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
