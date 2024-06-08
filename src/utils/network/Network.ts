import axios from 'axios';

export const Network = axios.create({
    baseURL: 'http://localhost:8080',
    validateStatus: axios.defaults.validateStatus,
    timeout: 12000,
});
