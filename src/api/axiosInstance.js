import axios from 'axios';

const storedUser = JSON.parse(localStorage.getItem('user'));
if (!storedUser || !storedUser.accessToken) {
    throw new Error("No user token found");
}

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001/api/', // Set the base URL
    headers: {
        'Content-Type': 'application/json', // Set common headers
        'Authorization': `Bearer ${storedUser.accessToken}`, // Example of setting an Authorization header
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Modify the request config before sending it
        // You can add or modify headers here if needed
        config.headers['X-Custom-Header'] = 'customHeaderValue';

        return config;
    },
    (error) => {
        // Handle the error before sending the request
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Handle the response data here
        return response;
    },
    (error) => {
        // Handle response errors
        if (error.response.status === 401) {
            // Handle unauthorized error
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
