import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

export const Network = axios.create({
    baseURL: baseURL,
    validateStatus: axios.defaults.validateStatus,
    timeout: 12000,
});
