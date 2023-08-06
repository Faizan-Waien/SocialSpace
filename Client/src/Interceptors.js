import axios from 'axios';

export const api = axios.create();

export const RefreshToken = () => {
    const refreshToken = localStorage.getItem('refreshToken');

    return axios.post('http://localhost:3000/refresh-token', { refreshToken })
        .then((response) => {
            const { token } = response.data;
            localStorage.setItem('token', token);

            // return Promise.resolve();
        })
        .catch((error) => {
            console.log(error);
            return Promise.reject(error);
        });
};

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite loop

            return RefreshToken()
                .then(() => {
                    const token = localStorage.getItem('token');
                    originalRequest.headers.Authorization = `Bearer ${token}`;

                    // Retry the original request with the new access token
                    return api(originalRequest);
                })
                .catch((refreshError) => {
                    console.log(refreshError);
                    return Promise.reject(refreshError);
                });
        }

        return Promise.reject(error);
    }
);