import axios from "axios";

export function createAxiosResponseInterceptor() {
    const interceptor = axios.interceptors.response.use(
        response => response,
        error => {
            // Reject promise if usual error
            if (error.response.status !== 401) {
                return Promise.reject(error);
            }

            /*
             * When response code is 401, try to refresh the token.
             * Eject the interceptor so it doesn't loop in case
             * token refresh causes the 401 response
             */
            axios.interceptors.response.eject(interceptor);

            return axios.post('/api/token/refresh').then(response => {
                return axios(error.response.config);
            }).catch(error => {
                return Promise.reject(error);
            }).finally(createAxiosResponseInterceptor);
        }
    );
}
